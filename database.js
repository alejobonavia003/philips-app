import dotenv from "dotenv";
import pkg from "pg";
const { Pool } = pkg;

dotenv.config();

const pool = new Pool({
  // Usamos la URL completa
  connectionString: process.env.DATABASE_URL,
  // Neon y la mayoría de los hosts cloud requieren SSL
  ssl: {
    rejectUnauthorized: false,
  },
  max: 10,
  idleTimeoutMillis: 30000,
});

// Función para verificar la conexión
async function checkConnection() {
  try {
    // IMPORTANTE: Neon crea por defecto el esquema 'public'.
    // Si tus tablas están en 'philips_db', debemos asegurarnos de crear el esquema
    // y establecer el path en cada conexión.
    await pool.query("CREATE SCHEMA IF NOT EXISTS philips_db;");
    await pool.query("SET search_path TO philips_db, public;");

    await pool.query("SELECT 1");
    console.log("✅ Conexión exitosa a Neon Cloud");
    return true;
  } catch (error) {
    console.error("❌ Error al conectar con Neon:", error);
    return false;
  }
}

checkConnection();

// El resto de tus funciones (getTodosByID, createTodo, etc.)
// funcionarán exactamente igual porque usan 'pool.query'.

/**
 * obtener todos los todos por id de usuario
 * @param {id usuario} id
 * @returns
 */
export async function getTodosByID(id) {
  const rows = await pool.query(
    "SELECT todos.*, shared_todos.shared_with_id FROM todos LEFT JOIN shared_todos ON todos.id = shared_todos.todo_id WHERE todos.user_id = $1 OR shared_todos.shared_with_id = $1",
    [id]
  );
  return rows.rows;
}

/**
 * obtener todo por id
 * @param {todo id} id
 * @returns
 */
export async function getTodo(id) {
  const row = await pool.query("SELECT * FROM todos WHERE id = $1", [id]);
  return row.rows;
}

/**
 * obtener los los usuarios que comparten un todo
 * @param {id del todo} id
 * @returns
 */
export async function getSharedTodoById(id) {
  const rows = await pool.query(
    "SELECT * FROM shared_todos WHERE todo_id = $1",
    [id]
  );
  return rows.rows;
}

/**
 * obtener usuario por id
 * @param {id usuario} id
 * @returns
 */
export async function getUserById(id) {
  const row = await pool.query(
    "SELECT id, username, email, created_at FROM users WHERE id = $1",
    [id]
  );
  return row.rows[0];
}

/**
 * obtener usuario por email
 * @param {*} email
 * @returns
 */
export async function getUserByEmail(email) {
  const row = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
  return row.rows[0];
}

/**
 * crear un todo de un usuario
 * @param {*} user_id
 * @param {*} title
 * @param {*} description
 * @returns
 */
export async function createTodo(user_id, title, description) {
  const result = await pool.query(
    "INSERT INTO todos (user_id, title, description) VALUES ($1, $2, $3) RETURNING *",
    [user_id, title, description]
  );
  return result.rows[0];
}
/**
 * funcion para eliminar un todo
 * @param {id del todo} id
 * @returns cantidad de filas eliminadas
 */
export async function deleteTodo(id) {
  const result = await pool.query("DELETE FROM todos WHERE id = $1", [id]);
  return result.rowCount;
}

/**
 * marcar un todo como completado o no completado
 * @param {id del todo} id
 * @returns
 */
export async function toggleTodo(id) {
  const actualValueRow = await pool.query(
    "SELECT is_completed FROM todos WHERE id = $1",
    [id]
  );
  const actualValue = actualValueRow.rows[0].is_completed;
  const newValue = !actualValue;

  const result = await pool.query(
    "UPDATE todos SET is_completed = $1 WHERE id = $2 RETURNING *",
    [newValue, id]
  );
  return result.rows[0];
}

/**
 * funcion para compartir un todo con otro usuario
 * @param {id del todo que van a compartir} todo_id
 * @param {el que comparte el todo} shared_with_id
 * @param {al que le compartieron el todo} user_id
 * @returns no lose
 */
export async function shareTodo(todo_id, shared_with_id, user_id) {
  const result = await pool.query(
    "INSERT INTO shared_todos (todo_id, shared_with_id, user_id) VALUES ($1, $2, $3) RETURNING *",
    [todo_id, shared_with_id, user_id]
  );
  return result.rows[0];
}

/**
 * chekear si un todo ya fue compartido con un usuario
 * @param {*} todo_id
 * @param {*} shared_with_id
 * @returns
 */
export async function checkAlreadyShared(todo_id, shared_with_id) {
  const result = await pool.query(
    "SELECT * FROM shared_todos WHERE todo_id = $1 AND shared_with_id = $2",
    [todo_id, shared_with_id]
  );
  return result.rows.length > 0;
}

/**
 * Registrar un movimiento de dinero (Ingreso o Egreso)
 */
export async function addFinanceRecord(
  user_id,
  amount,
  type,
  description,
  todo_id = null
) {
  const result = await pool.query(
    "INSERT INTO finances (user_id, amount, type, description, todo_id) VALUES ($1, $2, $3, $4, $5) RETURNING *",
    [user_id, amount, type, description, todo_id]
  );
  return result.rows[0];
}

/**
 * Obtener el balance total de un usuario
 */
export async function getUserBalance(user_id) {
  const result = await pool.query(
    `SELECT 
        SUM(CASE WHEN type = 'ingreso' THEN amount ELSE 0 END) as total_ingresos,
        SUM(CASE WHEN type = 'egreso' THEN amount ELSE 0 END) as total_egresos
     FROM finances WHERE user_id = $1`,
    [user_id]
  );

  const { total_ingresos, total_egresos } = result.rows[0];
  return {
    balance: (total_ingresos || 0) - (total_egresos || 0),
    ingresos: total_ingresos || 0,
    egresos: total_egresos || 0,
  };
}

/**
 * Obtener todos los registros financieros para la pestaña de Finanzas
 */
export async function getFinanceHistory(user_id) {
  const result = await pool.query(
    "SELECT * FROM finances WHERE user_id = $1 ORDER BY created_at DESC",
    [user_id]
  );
  return result.rows;
}
