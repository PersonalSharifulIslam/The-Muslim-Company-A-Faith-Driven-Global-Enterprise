import { Router } from "express";
import bcrypt from "bcryptjs";
import { pool } from "@workspace/db";
import { requireAdmin } from "../lib/auth-middleware";

const router = Router();
router.use(requireAdmin);

async function generateEmployeeId(): Promise<string> {
  const year = new Date().getFullYear();
  const result = await pool.query("SELECT COUNT(*) FROM employees");
  const seq = String(parseInt(result.rows[0].count) + 1).padStart(3, "0");
  return `TMC-${year}-${seq}`;
}

router.get("/admin/employees", async (_req, res): Promise<void> => {
  res.json((await pool.query("SELECT id,employee_id,name,email,department,role,position,phone,joining_date,status,created_at FROM employees ORDER BY created_at DESC")).rows);
});

router.get("/admin/employees/:id", async (req, res): Promise<void> => {
  const result = await pool.query("SELECT id,employee_id,name,email,department,role,position,phone,address,emergency_contact,joining_date,status FROM employees WHERE id=$1", [parseInt(req.params.id as string)]);
  if (!result.rows[0]) { res.status(404).json({ error: "Not found" }); return; }
  res.json(result.rows[0]);
});

router.post("/admin/employees", async (req, res): Promise<void> => {
  const { name, email, password, department, role, position, phone, address, joining_date } = req.body as Record<string, string>;
  if (!name || !email || !password || !department) { res.status(400).json({ error: "Name, email, password, department required" }); return; }
  const employee_id = await generateEmployeeId();
  const result = await pool.query(
    `INSERT INTO employees (employee_id,name,email,password_hash,department,role,position,phone,address,joining_date,status)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,'active') RETURNING id,employee_id,name,email,department,role,position,status`,
    [employee_id, name, email.toLowerCase(), await bcrypt.hash(password, 12), department, role||"employee", position||"", phone||"", address||"", joining_date||new Date().toISOString().split("T")[0]]
  );
  res.status(201).json(result.rows[0]);
});

router.put("/admin/employees/:id", async (req, res): Promise<void> => {
  const { name, email, department, role, position, phone, address, joining_date, status } = req.body as Record<string, string>;
  const result = await pool.query(
    `UPDATE employees SET name=COALESCE($1,name),email=COALESCE($2,email),department=COALESCE($3,department),role=COALESCE($4,role),position=COALESCE($5,position),phone=COALESCE($6,phone),address=COALESCE($7,address),joining_date=COALESCE($8,joining_date),status=COALESCE($9,status) WHERE id=$10 RETURNING id,employee_id,name,email,department,role,position,status`,
    [name||null,email?.toLowerCase()||null,department||null,role||null,position||null,phone||null,address||null,joining_date||null,status||null,parseInt(req.params.id as string)]
  );
  if (!result.rows[0]) { res.status(404).json({ error: "Not found" }); return; }
  res.json(result.rows[0]);
});

router.post("/admin/employees/:id/reset-password", async (req, res): Promise<void> => {
  const { new_password } = req.body as { new_password?: string };
  if (!new_password || new_password.length < 8) { res.status(400).json({ error: "Min 8 char password required" }); return; }
  const result = await pool.query("UPDATE employees SET password_hash=$1 WHERE id=$2 RETURNING id", [await bcrypt.hash(new_password, 12), parseInt(req.params.id as string)]);
  if (!result.rows[0]) { res.status(404).json({ error: "Not found" }); return; }
  res.json({ message: "Password reset successfully" });
});

router.delete("/admin/employees/:id", async (req, res): Promise<void> => {
  await pool.query("DELETE FROM employees WHERE id=$1", [parseInt(req.params.id as string)]);
  res.sendStatus(204);
});

router.get("/admin/attendance", async (req, res): Promise<void> => {
  const { date, employee_id } = req.query as Record<string, string>;
  let q = "SELECT a.*,e.name as employee_name FROM attendance a JOIN employees e ON a.employee_id=e.employee_id WHERE 1=1";
  const params: (string|number)[] = [];
  if (date) { params.push(date); q += ` AND a.date=$${params.length}`; }
  if (employee_id) { params.push(employee_id); q += ` AND a.employee_id=$${params.length}`; }
  res.json((await pool.query(q + " ORDER BY a.date DESC LIMIT 200", params)).rows);
});

router.get("/admin/leave", async (_req, res): Promise<void> => {
  res.json((await pool.query("SELECT l.*,e.name as employee_name FROM leave_requests l JOIN employees e ON l.employee_id=e.employee_id ORDER BY l.created_at DESC")).rows);
});

router.put("/admin/leave/:id", async (req, res): Promise<void> => {
  const { status, admin_note } = req.body as Record<string, string>;
  const result = await pool.query(
    "UPDATE leave_requests SET status=COALESCE($1,status),admin_note=COALESCE($2,admin_note),updated_at=NOW() WHERE id=$3 RETURNING *",
    [status||null, admin_note||null, parseInt(req.params.id as string)]
  );
  if (!result.rows[0]) { res.status(404).json({ error: "Not found" }); return; }
  res.json(result.rows[0]);
});

router.get("/admin/tasks", async (_req, res): Promise<void> => {
  res.json((await pool.query("SELECT t.*,e.name as employee_name FROM tasks t JOIN employees e ON t.employee_id=e.employee_id ORDER BY t.created_at DESC")).rows);
});

router.post("/admin/tasks", async (req, res): Promise<void> => {
  const { employee_id, title, description, priority, deadline } = req.body as Record<string, string>;
  if (!employee_id || !title) { res.status(400).json({ error: "employee_id and title required" }); return; }
  res.status(201).json((await pool.query(
    "INSERT INTO tasks (employee_id,title,description,priority,deadline,status,progress) VALUES ($1,$2,$3,$4,$5,'pending',0) RETURNING *",
    [employee_id, title, description||"", priority||"medium", deadline||null]
  )).rows[0]);
});

router.put("/admin/tasks/:id", async (req, res): Promise<void> => {
  const { title, description, priority, status, deadline } = req.body as Record<string, string>;
  const result = await pool.query(
    "UPDATE tasks SET title=COALESCE($1,title),description=COALESCE($2,description),priority=COALESCE($3,priority),status=COALESCE($4,status),deadline=COALESCE($5,deadline),updated_at=NOW() WHERE id=$6 RETURNING *",
    [title||null,description||null,priority||null,status||null,deadline||null,parseInt(req.params.id as string)]
  );
  if (!result.rows[0]) { res.status(404).json({ error: "Not found" }); return; }
  res.json(result.rows[0]);
});

router.delete("/admin/tasks/:id", async (req, res): Promise<void> => {
  await pool.query("DELETE FROM tasks WHERE id=$1", [parseInt(req.params.id as string)]);
  res.sendStatus(204);
});

router.post("/admin/notifications/send", async (req, res): Promise<void> => {
  const { employee_id, title, message, type } = req.body as Record<string, string>;
  if (!title || !message) { res.status(400).json({ error: "Title and message required" }); return; }
  res.status(201).json((await pool.query(
    "INSERT INTO employee_notifications (employee_id,title,message,type,broadcast) VALUES ($1,$2,$3,$4,$5) RETURNING *",
    [employee_id||null, title, message, type||"info", !employee_id]
  )).rows[0]);
});

router.delete("/admin/notifications/:id", async (req, res): Promise<void> => {
  await pool.query("DELETE FROM employee_notifications WHERE id=$1", [parseInt(req.params.id as string)]);
  res.sendStatus(204);
});

router.get("/admin/documents", async (_req, res): Promise<void> => {
  res.json((await pool.query("SELECT * FROM employee_documents ORDER BY created_at DESC")).rows);
});

router.post("/admin/documents", async (req, res): Promise<void> => {
  const { employee_id, name, category, file_url, description, is_public } = req.body as Record<string, string>;
  if (!name || !file_url) { res.status(400).json({ error: "Name and file_url required" }); return; }
  res.status(201).json((await pool.query(
    "INSERT INTO employee_documents (employee_id,name,category,file_url,description,is_public) VALUES ($1,$2,$3,$4,$5,$6) RETURNING *",
    [employee_id||null, name, category||"general", file_url, description||"", is_public==="true"]
  )).rows[0]);
});

router.delete("/admin/documents/:id", async (req, res): Promise<void> => {
  await pool.query("DELETE FROM employee_documents WHERE id=$1", [parseInt(req.params.id as string)]);
  res.sendStatus(204);
});

export default router;
