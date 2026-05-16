import { Router } from "express";
import bcrypt from "bcryptjs";
import { pool } from "@workspace/db";
import { requireEmployee, signEmployeeToken } from "../lib/employee-auth";

const router = Router();

router.post("/employee/auth/login", async (req, res): Promise<void> => {
  const { identifier, password } = req.body as { identifier?: string; password?: string };
  if (!identifier || !password) { res.status(400).json({ error: "Employee ID or email and password required" }); return; }
  const result = await pool.query(
    "SELECT id,employee_id,name,email,password_hash,role,status FROM employees WHERE employee_id=$1 OR email=$1",
    [identifier.trim()]
  );
  const emp = result.rows[0];
  if (!emp) { res.status(401).json({ error: "Invalid credentials" }); return; }
  if (emp.status !== "active") { res.status(403).json({ error: "Account inactive. Contact HR." }); return; }
  if (!await bcrypt.compare(password, emp.password_hash)) { res.status(401).json({ error: "Invalid credentials" }); return; }
  const token = signEmployeeToken({ id: emp.id, employee_id: emp.employee_id, email: emp.email, role: emp.role, name: emp.name });
  res.json({ token, employee: { id: emp.id, employee_id: emp.employee_id, name: emp.name, email: emp.email, role: emp.role } });
});

router.get("/employee/auth/me", requireEmployee, async (req, res): Promise<void> => {
  const result = await pool.query(
    "SELECT id,employee_id,name,email,department,role,position,phone,address,profile_image,joining_date,status FROM employees WHERE id=$1",
    [req.employee!.id]
  );
  if (!result.rows[0]) { res.status(404).json({ error: "Not found" }); return; }
  res.json({ employee: result.rows[0] });
});

export default router;
