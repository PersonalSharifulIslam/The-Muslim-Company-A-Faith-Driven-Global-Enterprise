import { Router } from "express";
import { pool } from "@workspace/db";
import { requireAdmin } from "../lib/auth-middleware";

const router = Router();
router.use(requireAdmin);

function slugify(s: string) {
  return s.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "") + "-" + Date.now();
}

router.get("/admin/stats", async (_req, res): Promise<void> => {
  const [j, a, n, no, b] = await Promise.all([
    pool.query("SELECT COUNT(*) FROM jobs"),
    pool.query("SELECT COUNT(*) FROM applications"),
    pool.query("SELECT COUNT(*) FROM newsroom_posts"),
    pool.query("SELECT COUNT(*) FROM notices"),
    pool.query("SELECT COUNT(*) FROM blog_posts"),
  ]);
  res.json({ jobs: parseInt(j.rows[0].count), applications: parseInt(a.rows[0].count), news: parseInt(n.rows[0].count), notices: parseInt(no.rows[0].count), blogs: parseInt(b.rows[0].count) });
});

router.get("/admin/jobs", async (_req, res): Promise<void> => {
  const result = await pool.query("SELECT * FROM jobs ORDER BY created_at DESC");
  res.json(result.rows);
});

router.post("/admin/jobs", async (req, res): Promise<void> => {
  const { title, department, employment_type, location, description, responsibilities, requirements, preferred, benefits, salary, deadline, status } = req.body;
  if (!title || !department || !employment_type || !location || !deadline) {
    res.status(400).json({ error: "Missing required fields" });
    return;
  }
  const maxResult = await pool.query("SELECT COALESCE(MAX(job_id), 10924) as max_id FROM jobs");
  const nextJobId = parseInt(maxResult.rows[0].max_id) + 1;
  const slug = `${title.toLowerCase().replace(/[^a-z0-9]+/g, "-")}-${nextJobId}`;
  const result = await pool.query(
    `INSERT INTO jobs (job_id, title, slug, department, employment_type, location, description, responsibilities, requirements, preferred, benefits, salary, deadline, status)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14) RETURNING *`,
    [nextJobId, title, slug, department, employment_type, location, description || "", responsibilities || "", requirements || "", preferred || "", benefits || "", salary || "", deadline, status || "active"]
  );
  res.status(201).json(result.rows[0]);
});

router.put("/admin/jobs/:id", async (req, res): Promise<void> => {
  const id = parseInt(Array.isArray(req.params.id) ? req.params.id[0] : req.params.id);
  const { title, department, employment_type, location, description, responsibilities, requirements, preferred, benefits, salary, deadline, status } = req.body;
  const result = await pool.query(
    `UPDATE jobs SET title=$1, department=$2, employment_type=$3, location=$4, description=$5, responsibilities=$6, requirements=$7, preferred=$8, benefits=$9, salary=$10, deadline=$11, status=$12 WHERE id=$13 RETURNING *`,
    [title, department, employment_type, location, description || "", responsibilities || "", requirements || "", preferred || "", benefits || "", salary || "", deadline, status, id]
  );
  if (!result.rows[0]) { res.status(404).json({ error: "Job not found" }); return; }
  res.json(result.rows[0]);
});

router.delete("/admin/jobs/:id", async (req, res): Promise<void> => {
  const id = parseInt(Array.isArray(req.params.id) ? req.params.id[0] : req.params.id);
  await pool.query("DELETE FROM jobs WHERE id = $1", [id]);
  res.sendStatus(204);
});

router.get("/admin/applications", async (_req, res): Promise<void> => {
  const result = await pool.query("SELECT * FROM applications ORDER BY created_at DESC");
  res.json(result.rows);
});

router.put("/admin/applications/:id", async (req, res): Promise<void> => {
  const id = parseInt(Array.isArray(req.params.id) ? req.params.id[0] : req.params.id);
  const { status } = req.body as { status: string };
  const result = await pool.query("UPDATE applications SET status=$1, updated_at=NOW() WHERE id=$2 RETURNING *", [status, id]);
  if (!result.rows[0]) { res.status(404).json({ error: "Application not found" }); return; }
  res.json(result.rows[0]);
});

router.get("/admin/newsroom", async (_req, res): Promise<void> => {
  const result = await pool.query("SELECT * FROM newsroom_posts ORDER BY created_at DESC");
  res.json(result.rows);
});

router.post("/admin/newsroom", async (req, res): Promise<void> => {
  const { title, category, excerpt, content, image_url, featured, published } = req.body;
  if (!title || !category) { res.status(400).json({ error: "Title and category required" }); return; }
  const slug = slugify(title);
  const result = await pool.query(
    `INSERT INTO newsroom_posts (title, slug, category, excerpt, content, image_url, featured, published) VALUES ($1,$2,$3,$4,$5,$6,$7,$8) RETURNING *`,
    [title, slug, category, excerpt || "", content || "", image_url || "", Boolean(featured), Boolean(published)]
  );
  res.status(201).json(result.rows[0]);
});

router.put("/admin/newsroom/:id", async (req, res): Promise<void> => {
  const id = parseInt(Array.isArray(req.params.id) ? req.params.id[0] : req.params.id);
  const { title, category, excerpt, content, image_url, featured, published } = req.body;
  const result = await pool.query(
    `UPDATE newsroom_posts SET title=$1, category=$2, excerpt=$3, content=$4, image_url=$5, featured=$6, published=$7 WHERE id=$8 RETURNING *`,
    [title, category, excerpt || "", content || "", image_url || "", Boolean(featured), Boolean(published), id]
  );
  if (!result.rows[0]) { res.status(404).json({ error: "Not found" }); return; }
  res.json(result.rows[0]);
});

router.delete("/admin/newsroom/:id", async (req, res): Promise<void> => {
  const id = parseInt(Array.isArray(req.params.id) ? req.params.id[0] : req.params.id);
  await pool.query("DELETE FROM newsroom_posts WHERE id = $1", [id]);
  res.sendStatus(204);
});

router.get("/admin/notices", async (_req, res): Promise<void> => {
  const result = await pool.query("SELECT * FROM notices ORDER BY pinned DESC, created_at DESC");
  res.json(result.rows);
});

router.post("/admin/notices", async (req, res): Promise<void> => {
  const { title, category, content, pdf_url, important, pinned } = req.body;
  if (!title || !category) { res.status(400).json({ error: "Title and category required" }); return; }
  const result = await pool.query(
    `INSERT INTO notices (title, category, content, pdf_url, important, pinned) VALUES ($1,$2,$3,$4,$5,$6) RETURNING *`,
    [title, category, content || "", pdf_url || "", Boolean(important), Boolean(pinned)]
  );
  res.status(201).json(result.rows[0]);
});

router.put("/admin/notices/:id", async (req, res): Promise<void> => {
  const id = parseInt(Array.isArray(req.params.id) ? req.params.id[0] : req.params.id);
  const { title, category, content, pdf_url, important, pinned } = req.body;
  const result = await pool.query(
    `UPDATE notices SET title=$1, category=$2, content=$3, pdf_url=$4, important=$5, pinned=$6 WHERE id=$7 RETURNING *`,
    [title, category, content || "", pdf_url || "", Boolean(important), Boolean(pinned), id]
  );
  if (!result.rows[0]) { res.status(404).json({ error: "Not found" }); return; }
  res.json(result.rows[0]);
});

router.delete("/admin/notices/:id", async (req, res): Promise<void> => {
  const id = parseInt(Array.isArray(req.params.id) ? req.params.id[0] : req.params.id);
  await pool.query("DELETE FROM notices WHERE id = $1", [id]);
  res.sendStatus(204);
});

router.get("/admin/blog", async (_req, res): Promise<void> => {
  const result = await pool.query("SELECT * FROM blog_posts ORDER BY created_at DESC");
  res.json(result.rows);
});

router.post("/admin/blog", async (req, res): Promise<void> => {
  const { title, category, excerpt, content, image_url, author, reading_time, seo_title, meta_description, published } = req.body;
  if (!title || !category) { res.status(400).json({ error: "Title and category required" }); return; }
  const slug = slugify(title);
  const result = await pool.query(
    `INSERT INTO blog_posts (title, slug, category, excerpt, content, image_url, author, reading_time, seo_title, meta_description, published) VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11) RETURNING *`,
    [title, slug, category, excerpt || "", content || "", image_url || "", author || "The Muslim Company", parseInt(reading_time) || 5, seo_title || "", meta_description || "", Boolean(published)]
  );
  res.status(201).json(result.rows[0]);
});

router.put("/admin/blog/:id", async (req, res): Promise<void> => {
  const id = parseInt(Array.isArray(req.params.id) ? req.params.id[0] : req.params.id);
  const { title, category, excerpt, content, image_url, author, reading_time, seo_title, meta_description, published } = req.body;
  const result = await pool.query(
    `UPDATE blog_posts SET title=$1, category=$2, excerpt=$3, content=$4, image_url=$5, author=$6, reading_time=$7, seo_title=$8, meta_description=$9, published=$10 WHERE id=$11 RETURNING *`,
    [title, category, excerpt || "", content || "", image_url || "", author || "The Muslim Company", parseInt(reading_time) || 5, seo_title || "", meta_description || "", Boolean(published), id]
  );
  if (!result.rows[0]) { res.status(404).json({ error: "Not found" }); return; }
  res.json(result.rows[0]);
});

router.delete("/admin/blog/:id", async (req, res): Promise<void> => {
  const id = parseInt(Array.isArray(req.params.id) ? req.params.id[0] : req.params.id);
  await pool.query("DELETE FROM blog_posts WHERE id = $1", [id]);
  res.sendStatus(204);
});

export default router;
