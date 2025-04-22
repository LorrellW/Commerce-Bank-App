// src/app/db/dbConnect.ts            ← give it a .ts (or .mjs) extension
import { Pool } from "pg";

/** one shared pool for the whole app */
export const pool = new Pool({
  user:     process.env.DB_USER     ?? "postgres",
  host:     process.env.DB_HOST     ?? "localhost",
  database: process.env.DB_NAME     ?? "fortune400",
  password: process.env.DB_PASSWORD ?? "",
  port:     Number(process.env.DB_PORT) || 5432,
});

/* ───  quick dev‑time check ─── */
if (process.env.NODE_ENV !== "production") {
  pool
    .query("SELECT NOW()")
    .then(res => console.log("Postgres connected:", res.rows[0].now))
    .catch(err => console.error("Postgres connection error:", err));
}
