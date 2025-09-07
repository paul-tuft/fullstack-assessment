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

// Get all cards
app.get("/cards", async (req, res) => {
  const result = await pool.query("SELECT * FROM cards ORDER BY id ASC");
  res.json(result.rows);
});

// Click a card
app.post("/cards/:id/click", async (req, res) => {
  const { id } = req.params;
  const client = await pool.connect();

  await client.query("BEGIN");

  const { rows } = await client.query("SELECT * FROM cards WHERE id = $1", [id]);
  const card = rows[0];

  const firstClick = card.first_click ?? new Date();
  const clickCount = card.click_count + 1;

  await client.query(
    "UPDATE cards SET click_count = $1, first_click = $2 WHERE id = $3",
    [clickCount, firstClick, id]
  );

  await client.query("COMMIT");
  client.release();

  res.json({
    id: Number(id),
    click_count: clickCount,
    first_click: firstClick,
  });
});

// Reset all cards
app.post("/cards/reset", async (req, res) => {
  await pool.query("UPDATE cards SET click_count = 0, first_click = NULL");
  res.json({ message: "All cards reset" });
});

app.listen(4000, () => console.log("Backend running on port http://localhost:4000"));