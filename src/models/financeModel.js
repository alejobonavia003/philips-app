import { query } from "../config/db.js";

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
  const result = await query(
    "INSERT INTO finances (user_id, amount, type, description, todo_id) VALUES ($1, $2, $3, $4, $5) RETURNING *",
    [user_id, amount, type, description, todo_id]
  );
  return result.rows[0];
}

/**
 * Obtener el balance total de un usuario
 */
export async function getUserBalance(user_id) {
  const result = await query(
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
  const result = await query(
    "SELECT * FROM finances WHERE user_id = $1 ORDER BY created_at DESC",
    [user_id]
  );
  return result.rows;
}
