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

// Verificación de conexión
pool.on("connect", () => {
  console.log("Conexion exitosa con Neon");
});

export const query = (text, params) => pool.query(text, params);
export default pool;
