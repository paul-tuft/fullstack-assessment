import express from "express";
import cors from "cors";
import { Pool } from "pg";

const app = express();
const port = 4000;

app.use(cors());
app.use(express.json());

// PostgreSQL connection
const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "cards",
  password: "SnubisGood",
  port: 5432,
});

// --- API Routes ---

// 1. Get all cards
app.get("/cards", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM cards ORDER BY first_click NULLS LAST, id"
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

// 2. Update click count and first click
app.post("/cards/:id/click", async (req, res) => {
  const cardId = parseInt(req.params.id);
  try {
    // Check if first_click exists
    const cardRes = await pool.query("SELECT * FROM cards WHERE id=$1", [cardId]);
    const card = cardRes.rows[0];

    let firstClick = card.first_click;
    if (!firstClick) {
      firstClick = new Date();
    }

    await pool.query(
      "UPDATE cards SET clicks = clicks + 1, first_click = $1 WHERE id = $2",
      [firstClick, cardId]
    );

    res.json({ message: "Card updated" });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

// 3. Reset all cards
app.post("/cards/reset", async (req, res) => {
  try {
    await pool.query("UPDATE cards SET clicks = 0, first_click = NULL");
    res.json({ message: "All cards reset" });
  } catch (err) {
    console.error(err);
    res.status(500).send("Server error");
  }
});

// Start server
app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});