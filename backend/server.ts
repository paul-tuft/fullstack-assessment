import express from "express";
import cors from "cors";
import { Pool } from "pg";

const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "postgres",
  password: "password",
  port: 5432,
});

// Ensure table exists and seed cards
const init = async () => {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS cards (
      id SERIAL PRIMARY KEY,
      click_count INT DEFAULT 0,
      first_click_ts TIMESTAMP
    );
  `);

  for (let i = 1; i <= 8; i++) {
    await pool.query(`
      INSERT INTO cards (id, click_count, first_click_ts)
      VALUES ($1, 0, NULL)
      ON CONFLICT (id) DO NOTHING
    `, [i]);
  }
};

init();

// Get all cards
app.get("/cards", async (req, res) => {
  const result = await pool.query("SELECT id, click_count, first_click_ts FROM cards ORDER BY id ASC");
  res.json(result.rows);
});

// Click a card
app.post("/cards/:id/click", async (req, res) => {
  const { id } = req.params;

  const { rows } = await pool.query("SELECT * FROM cards WHERE id = $1", [id]);
  const card = rows[0];

  const firstClick = card.first_click_ts || new Date();
  const clickCount = card.click_count + 1;

  await pool.query(
    "UPDATE cards SET click_count = $1, first_click_ts = $2 WHERE id = $3",
    [clickCount, firstClick, id]
  );

  res.json({ id: Number(id), click_count: clickCount, first_click_ts: firstClick });
});

// Reset all cards
app.post("/cards/reset", async (req, res) => {
  await pool.query("UPDATE cards SET click_count = 0, first_click_ts = NULL");
  res.json({ message: "All cards reset" });
});

app.listen(4000, () => console.log("Backend running on port http://localhost:4000"));