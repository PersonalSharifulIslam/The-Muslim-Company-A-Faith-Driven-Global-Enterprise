import { Router } from "express";
import bcrypt from "bcryptjs";
import { pool } from "@workspace/db";
import { requireAdmin, signToken } from "../lib/auth-middleware";
import { logger } from "../lib/logger";

const router = Router();

router.post("/auth/login", async (req, res): Promise<void> => {
  const { email, password } = req.body as { email?: string; password?: string };
  if (!email || !password) {
    res.status(400).json({ error: "Email and password required" });
    return;
  }
  const result = await pool.query("SELECT id, email, password_hash FROM admin_users WHERE email = $1", [email.toLowerCase()]);
  const user = result.rows[0];
  if (!user) {
    res.status(401).json({ error: "Invalid credentials" });
    return;
  }
  const valid = await bcrypt.compare(password, user.password_hash);
  if (!valid) {
    res.status(401).json({ error: "Invalid credentials" });
    return;
  }
  const token = signToken({ id: user.id, email: user.email });
  req.log.info({ email: user.email }, "Admin logged in");
  res.json({ token, email: user.email });
});

router.get("/auth/me", requireAdmin, async (req, res): Promise<void> => {
  res.json({ user: { email: req.admin!.email } });
});

router.post("/auth/setup", async (req, res): Promise<void> => {
  const countResult = await pool.query("SELECT COUNT(*) FROM admin_users");
  if (parseInt(countResult.rows[0].count) > 0) {
    res.status(409).json({ error: "Admin already configured" });
    return;
  }
  const { email, password } = req.body as { email?: string; password?: string };
  if (!email || !password || password.length < 8) {
    res.status(400).json({ error: "Valid email and password (min 8 chars) required" });
    return;
  }
  const hash = await bcrypt.hash(password, 12);
  const result = await pool.query(
    "INSERT INTO admin_users (email, password_hash) VALUES ($1, $2) RETURNING id, email",
    [email.toLowerCase(), hash]
  );
  const user = result.rows[0];
  const token = signToken({ id: user.id, email: user.email });
  logger.info({ email: user.email }, "First admin user created");
  res.status(201).json({ token, email: user.email });
});

export default router;
