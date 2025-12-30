import pkg from "pg";
import dotenv from "dotenv";

const { Pool } = pkg;
dotenv.config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
  max: 10,
  idleTimeoutMillis: 30000,
});

// SOLUCIÓN: Usar el evento 'connect' para configurar la sesión
// Cada vez que el pool entrega un cliente, ejecutamos esto:
pool.on("connect", (client) => {
  client.query("SET search_path TO philips_db, public;");
});

export const query = (text, params) => pool.query(text, params);
export default pool;
