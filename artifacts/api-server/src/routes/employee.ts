import { Router } from "express";
import bcrypt from "bcryptjs";
import { pool } from "@workspace/db";
import { requireEmployee } from "../lib/employee-auth";

const router = Router();
router.use(requireEmployee);

router.get("/employee/dashboard", async (req, res): Promise<void> => {
  const eid = req.employee!.employee_id;
  const today = new Date().toISOString().split("T")[0];
  const [emp, att, leaves, taskStats, notifs] = await Promise.all([
    pool.query("SELECT id,employee_id,name,email,department,role,position,joining_date FROM employees WHERE employee_id=$1", [eid]),
    pool.query("SELECT * FROM attendance WHERE employee_id=$1 AND date=$2", [eid, today]),
    pool.query("SELECT status,COUNT(*) as count FROM leave_requests WHERE employee_id=$1 GROUP BY status", [eid]),
    pool.query("SELECT status,COUNT(*) as count FROM tasks WHERE employee_id=$1 GROUP BY status", [eid]),
    pool.query("SELECT COUNT(*) FROM employee_notifications WHERE (employee_id=$1 OR broadcast=TRUE) AND is_read=FALSE", [eid]),
  ]);
  const recentTasks = await pool.query("SELECT * FROM tasks WHERE employee_id=$1 ORDER BY created_at DESC LIMIT 5", [eid]);
  const recentNotifs = await pool.query("SELECT * FROM employee_notifications WHERE employee_id=$1 OR broadcast=TRUE ORDER BY created_at DESC LIMIT 5", [eid]);
  res.json({
    employee: emp.rows[0],
    today_attendance: att.rows[0] || null,
    leave_stats: leaves.rows,
    task_stats: taskStats.rows,
    unread_notifications: parseInt(notifs.rows[0].count),
    recent_tasks: recentTasks.rows,
    recent_notifications: recentNotifs.rows,
  });
});

router.get("/employee/attendance", async (req, res): Promise<void> => {
  const eid = req.employee!.employee_id;
  const { month, year } = req.query as Record<string, string>;
  let q = "SELECT * FROM attendance WHERE employee_id=$1";
  const params: (string | number)[] = [eid];
  if (month && year) { q += " AND EXTRACT(MONTH FROM date)=$2 AND EXTRACT(YEAR FROM date)=$3"; params.push(parseInt(month), parseInt(year)); }
  q += " ORDER BY date DESC LIMIT 60";
  res.json((await pool.query(q, params)).rows);
});

router.post("/employee/attendance/checkin", async (req, res): Promise<void> => {
  const eid = req.employee!.employee_id;
  const today = new Date().toISOString().split("T")[0];
  const existing = await pool.query("SELECT * FROM attendance WHERE employee_id=$1 AND date=$2", [eid, today]);
  if (existing.rows[0]?.check_in) { res.status(400).json({ error: "Already checked in today" }); return; }
  res.json((await pool.query(
    "INSERT INTO attendance (employee_id,date,check_in,status) VALUES ($1,$2,NOW(),'present') ON CONFLICT (employee_id,date) DO UPDATE SET check_in=NOW() RETURNING *",
    [eid, today]
  )).rows[0]);
});

router.post("/employee/attendance/checkout", async (req, res): Promise<void> => {
  const eid = req.employee!.employee_id;
  const today = new Date().toISOString().split("T")[0];
  const existing = await pool.query("SELECT * FROM attendance WHERE employee_id=$1 AND date=$2", [eid, today]);
  if (!existing.rows[0]?.check_in) { res.status(400).json({ error: "No check-in found for today" }); return; }
  if (existing.rows[0]?.check_out) { res.status(400).json({ error: "Already checked out" }); return; }
  const hrs = Math.round(((Date.now() - new Date(existing.rows[0].check_in).getTime()) / 3600000) * 100) / 100;
  res.json((await pool.query("UPDATE attendance SET check_out=NOW(),working_hours=$1 WHERE employee_id=$2 AND date=$3 RETURNING *", [hrs, eid, today])).rows[0]);
});

router.get("/employee/leave", async (req, res): Promise<void> => {
  res.json((await pool.query("SELECT * FROM leave_requests WHERE employee_id=$1 ORDER BY created_at DESC", [req.employee!.employee_id])).rows);
});

router.post("/employee/leave", async (req, res): Promise<void> => {
  const { leave_type, reason, start_date, end_date } = req.body as Record<string, string>;
  if (!leave_type || !reason || !start_date || !end_date) { res.status(400).json({ error: "All fields required" }); return; }
  const days = Math.ceil((new Date(end_date).getTime() - new Date(start_date).getTime()) / 86400000) + 1;
  res.status(201).json((await pool.query(
    "INSERT INTO leave_requests (employee_id,leave_type,reason,start_date,end_date,days,status) VALUES ($1,$2,$3,$4,$5,$6,'pending') RETURNING *",
    [req.employee!.employee_id, leave_type, reason, start_date, end_date, days]
  )).rows[0]);
});

router.get("/employee/tasks", async (req, res): Promise<void> => {
  res.json((await pool.query("SELECT * FROM tasks WHERE employee_id=$1 ORDER BY created_at DESC", [req.employee!.employee_id])).rows);
});

router.put("/employee/tasks/:id", async (req, res): Promise<void> => {
  const { status, progress } = req.body as { status?: string; progress?: number };
  const result = await pool.query(
    "UPDATE tasks SET status=COALESCE($1,status),progress=COALESCE($2,progress),updated_at=NOW() WHERE id=$3 AND employee_id=$4 RETURNING *",
    [status||null, progress??null, parseInt(req.params.id as string), req.employee!.employee_id]
  );
  if (!result.rows[0]) { res.status(404).json({ error: "Not found" }); return; }
  res.json(result.rows[0]);
});

router.get("/employee/documents", async (req, res): Promise<void> => {
  res.json((await pool.query("SELECT * FROM employee_documents WHERE employee_id=$1 OR is_public=TRUE ORDER BY created_at DESC", [req.employee!.employee_id])).rows);
});

router.get("/employee/notifications", async (req, res): Promise<void> => {
  res.json((await pool.query("SELECT * FROM employee_notifications WHERE employee_id=$1 OR broadcast=TRUE ORDER BY created_at DESC LIMIT 50", [req.employee!.employee_id])).rows);
});

router.put("/employee/notifications/:id/read", async (req, res): Promise<void> => {
  await pool.query("UPDATE employee_notifications SET is_read=TRUE WHERE id=$1", [parseInt(req.params.id as string)]);
  res.sendStatus(204);
});

router.put("/employee/notifications/read-all", async (req, res): Promise<void> => {
  await pool.query("UPDATE employee_notifications SET is_read=TRUE WHERE employee_id=$1 OR broadcast=TRUE", [req.employee!.employee_id]);
  res.sendStatus(204);
});

router.get("/employee/profile", async (req, res): Promise<void> => {
  const result = await pool.query(
    "SELECT id,employee_id,name,email,department,role,position,phone,address,profile_image,emergency_contact,joining_date,status FROM employees WHERE id=$1",
    [req.employee!.id]
  );
  if (!result.rows[0]) { res.status(404).json({ error: "Not found" }); return; }
  res.json(result.rows[0]);
});

router.put("/employee/profile", async (req, res): Promise<void> => {
  const { name, phone, address, emergency_contact } = req.body as Record<string, string>;
  res.json((await pool.query(
    "UPDATE employees SET name=COALESCE($1,name),phone=COALESCE($2,phone),address=COALESCE($3,address),emergency_contact=COALESCE($4,emergency_contact) WHERE id=$5 RETURNING id,employee_id,name,email,department,role,position,phone,address,emergency_contact",
    [name||null, phone||null, address||null, emergency_contact||null, req.employee!.id]
  )).rows[0]);
});

router.put("/employee/profile/password", async (req, res): Promise<void> => {
  const { current_password, new_password } = req.body as { current_password?: string; new_password?: string };
  if (!current_password || !new_password || new_password.length < 8) { res.status(400).json({ error: "Valid passwords required (min 8 chars)" }); return; }
  const emp = await pool.query("SELECT password_hash FROM employees WHERE id=$1", [req.employee!.id]);
  if (!await bcrypt.compare(current_password, emp.rows[0].password_hash)) { res.status(401).json({ error: "Current password incorrect" }); return; }
  await pool.query("UPDATE employees SET password_hash=$1 WHERE id=$2", [await bcrypt.hash(new_password, 12), req.employee!.id]);
  res.json({ message: "Password updated successfully" });
});

export default router;
