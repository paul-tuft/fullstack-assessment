import { Pool } from "pg";

const pool = new Pool({
  user: "postgres",     
  host: "localhost",
  database: "cardsdb", 
  password: "SnubisGood",
  port: 5432,
});

export default pool;