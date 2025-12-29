import { query } from "../config/db.js";

/**
 * Iniciar una tarea: Cambia estado a 'en_progreso' y crea un log de tiempo
 */
export async function startTask(todo_id) {
  // 1. Cambiamos el estado de la tarea
  await query("UPDATE todos SET status = 'en_progreso' WHERE id = $1", [
    todo_id,
  ]);
  // 2. Creamos el registro de inicio
  const result = await query(
    "INSERT INTO time_logs (todo_id, start_time) VALUES ($1, NOW()) RETURNING *",
    [todo_id]
  );
  return result.rows[0];
}

/**
 * Pausar una tarea: Cambia estado a 'pausada' y cierra el log de tiempo calculando la duración
 */
export async function pauseTask(todo_id) {
  await query("UPDATE todos SET status = 'pausada' WHERE id = $1", [todo_id]);
  // Cerramos el log que estaba abierto (end_time es NULL)
  const result = await query(
    `UPDATE time_logs 
     SET end_time = NOW(), 
         duration_seconds = EXTRACT(EPOCH FROM (NOW() - start_time)) 
     WHERE todo_id = $1 AND end_time IS NULL 
     RETURNING *`,
    [todo_id]
  );
  return result.rows[0];
}
