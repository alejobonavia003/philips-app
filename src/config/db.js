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

// ESTO ES LO QUE FALTA:
const initDb = async () => {
  try {
    // Forzamos a que busque en tu esquema y luego en public
    await pool.query("SET search_path TO philips_db, public;");
    console.log("✅ Schema search_path configurado");
  } catch (err) {
    console.error("❌ Error configurando el search_path:", err);
  }
};

initDb();

// Verificación de conexión
pool.on("connect", () => {
  console.log("Conexion exitosa con Neon");
});

export const query = (text, params) => pool.query(text, params);
export default pool;
