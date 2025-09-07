import { Router } from "express";
import pool from "./db";

const router = Router();

router.get("/cards", async (_req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM cards ORDER BY first_click_ts NULLS LAST, id"
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: "Database error" });
  }
});


router.post("/cards/:id/click", async (req, res) => {
  const { id } = req.params;
  try {
    const updateQuery = `
      UPDATE cards
      SET click_count = click_count + 1,
          first_click_ts = COALESCE(first_click_ts, NOW())
      WHERE id = $1
      RETURNING *;
    `;
    const result = await pool.query(updateQuery, [id]);
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: "Database error" });
  }
});


router.post("/reset", async (_req, res) => {
  try {
    await pool.query("UPDATE cards SET click_count = 0, first_click_ts = NULL");
    res.json({ message: "Reset successful" });
  } catch (err) {
    res.status(500).json({ error: "Database error" });
  }
});

export default router;