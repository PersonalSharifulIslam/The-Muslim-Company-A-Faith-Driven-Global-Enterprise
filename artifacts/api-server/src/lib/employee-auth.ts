import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const SECRET = (process.env.SESSION_SECRET || "tmc-fallback-secret") + "_employee";

export type EmployeePayload = { id: number; employee_id: string; email: string; role: string; name: string };

declare global {
  namespace Express {
    interface Request {
      employee?: EmployeePayload;
    }
  }
}

export function requireEmployee(req: Request, res: Response, next: NextFunction): void {
  const auth = req.headers.authorization;
  if (!auth?.startsWith("Bearer ")) { res.status(401).json({ error: "Unauthorized" }); return; }
  try {
    const payload = jwt.verify(auth.slice(7), SECRET) as EmployeePayload;
    req.employee = payload;
    next();
  } catch {
    res.status(401).json({ error: "Invalid or expired token" });
  }
}

export function signEmployeeToken(payload: EmployeePayload): string {
  return jwt.sign(payload, SECRET, { expiresIn: "12h" });
}
