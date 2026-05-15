import { Router } from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { pool } from "@workspace/db";

const uploadsDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadsDir),
  filename: (_req, file, cb) => cb(null, `${Date.now()}-${file.originalname.replace(/\s+/g, "_")}`),
});
const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 } });

const router = Router();

function generateRefNumber(name: string, jobId: number): string {
  const initials = name.trim().split(/\s+/).map((n) => n[0]?.toUpperCase() || "").join("").slice(0, 3) || "XX";
  const year = new Date().getFullYear();
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let random = "";
  for (let i = 0; i < 6; i++) random += chars.charAt(Math.floor(Math.random() * chars.length));
  return `BD/${initials}/${jobId}/${year}/${random}`;
}

router.get("/jobs", async (req, res): Promise<void> => {
  const result = await pool.query("SELECT * FROM jobs WHERE status = $1 ORDER BY created_at DESC", ["active"]);
  res.json(result.rows);
});

router.get("/jobs/:slug", async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.slug) ? req.params.slug[0] : req.params.slug;
  const result = await pool.query("SELECT * FROM jobs WHERE slug = $1 AND status = $2", [raw, "active"]);
  if (!result.rows[0]) {
    res.status(404).json({ error: "Job not found" });
    return;
  }
  res.json(result.rows[0]);
});

router.get("/newsroom", async (_req, res): Promise<void> => {
  const result = await pool.query("SELECT * FROM newsroom_posts WHERE published = true ORDER BY created_at DESC");
  res.json(result.rows);
});

router.get("/newsroom/:slug", async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.slug) ? req.params.slug[0] : req.params.slug;
  const result = await pool.query("SELECT * FROM newsroom_posts WHERE slug = $1 AND published = true", [raw]);
  if (!result.rows[0]) {
    res.status(404).json({ error: "Article not found" });
    return;
  }
  res.json(result.rows[0]);
});

router.get("/notices", async (_req, res): Promise<void> => {
  const result = await pool.query("SELECT * FROM notices ORDER BY pinned DESC, created_at DESC");
  res.json(result.rows);
});

router.get("/blog", async (_req, res): Promise<void> => {
  const result = await pool.query("SELECT * FROM blog_posts WHERE published = true ORDER BY created_at DESC");
  res.json(result.rows);
});

router.get("/blog/:slug", async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.slug) ? req.params.slug[0] : req.params.slug;
  const result = await pool.query("SELECT * FROM blog_posts WHERE slug = $1 AND published = true", [raw]);
  if (!result.rows[0]) {
    res.status(404).json({ error: "Post not found" });
    return;
  }
  res.json(result.rows[0]);
});

router.get("/applications/lookup/:ref", async (req, res): Promise<void> => {
  const raw = Array.isArray(req.params.ref) ? req.params.ref[0] : req.params.ref;
  const result = await pool.query("SELECT * FROM applications WHERE UPPER(reference_number) = UPPER($1)", [raw]);
  if (!result.rows[0]) {
    res.status(404).json({ error: "Application not found" });
    return;
  }
  const { email, phone, address, education, experience, skills, cover_letter, ...safe } = result.rows[0];
  void email; void phone; void address; void education; void experience; void skills; void cover_letter;
  res.json(safe);
});

router.post("/applications", upload.single("cv"), async (req, res): Promise<void> => {
  const b = req.body as Record<string, string>;
  const { name, email, phone, address, education, experience, skills, portfolio, cover_letter, job_db_id } = b;
  if (!name || !email || !phone || !address || !education || !experience || !skills || !cover_letter || !job_db_id) {
    res.status(400).json({ error: "All required fields must be provided" });
    return;
  }
  const jobResult = await pool.query("SELECT job_id, title FROM jobs WHERE id = $1", [parseInt(job_db_id)]);
  if (!jobResult.rows[0]) { res.status(404).json({ error: "Job not found" }); return; }
  const { job_id, title: job_title } = jobResult.rows[0] as { job_id: number; title: string };
  const refNumber = generateRefNumber(name, job_id);
  const cvUrl = req.file ? `/api/uploads/${req.file.filename}` : "";
  const result = await pool.query(
    `INSERT INTO applications (reference_number, job_id, job_title, name, email, phone, address, education, experience, skills, portfolio, cover_letter, cv_url, status, updated_at)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,'submitted',NOW()) RETURNING *`,
    [refNumber, job_id, job_title, name, email, phone, address, education, experience, skills, portfolio || "", cover_letter, cvUrl]
  );
  res.status(201).json(result.rows[0]);
});

export default router;
