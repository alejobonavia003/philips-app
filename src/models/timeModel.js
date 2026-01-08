import { query } from "../config/db.js";

/**
 * Iniciar una tarea: Cambia estado a 'en_progreso' y crea un log de tiempo
 */
export async function startTask(todo_id) {
  // 1. Set last_start_time on todos and change status to 'en_progreso'
  await query(
    "UPDATE todos SET last_start_time = NOW(), status = 'en_progreso' WHERE id = $1",
    [todo_id]
  );

  // 2. Create a time_logs entry for history (optional but useful)
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
  // 1. Obtener la tarea para leer last_start_time y total_time
  const todoRes = await query(
    "SELECT last_start_time, total_time FROM todos WHERE id = $1",
    [todo_id]
  );

  if (!todoRes.rows || todoRes.rows.length === 0) {
    throw new Error("Todo no encontrado");
  }

  const todo = todoRes.rows[0];

  if (!todo.last_start_time) {
    // Nada que pausar
    return null;
  }

  // 2. Calcular segundos transcurridos usando SQL para evitar problemas de parseo
  const secondsRes = await query(
    "SELECT FLOOR(EXTRACT(EPOCH FROM (NOW() - $1::timestamp)))::int AS seconds",
    [todo.last_start_time]
  );

  const secondsElapsed = secondsRes.rows[0].seconds || 0;

  // 3. Actualizar la tarea: sumar al total_time, limpiar last_start_time, cambiar estado
  const updatedTodo = await query(
    `UPDATE todos
     SET total_time = COALESCE(total_time, 0) + $1,
         last_start_time = NULL,
         status = 'pausada'
     WHERE id = $2
     RETURNING *`,
    [secondsElapsed, todo_id]
  );

  // 4. Actualizar el time_log abierto por consistencia (si existe)
  await query(
    `UPDATE time_logs
     SET end_time = NOW(),
         duration_seconds = $1
     WHERE todo_id = $2 AND end_time IS NULL`,
    [secondsElapsed, todo_id]
  );

  return { added_seconds: secondsElapsed, todo: updatedTodo.rows[0] };
}

export const getDailyStats = async (user_id) => {
  const { rows } = await query(
    `SELECT 
        t.title, 
        SUM(tl.duration_seconds) as total_seconds
     FROM todos t
     JOIN time_logs tl ON t.id = tl.todo_id
     WHERE t.user_id = $1 
       AND DATE(tl.start_time) = CURRENT_DATE
     GROUP BY t.id, t.title`,
    [user_id]
  );
  // Convertimos segundos a horas con un decimal para el front
  return rows.map((r) => ({
    title: r.title,
    hours: parseFloat((r.total_seconds / 3600).toFixed(1)),
  }));
};

export const getWeeklyProductivity = async (user_id) => {
  const { rows } = await query(
    `SELECT 
        TO_CHAR(start_time, 'Dy') as day, 
        SUM(duration_seconds) / 3600 as hours
     FROM time_logs tl
     JOIN todos t ON tl.todo_id = t.id
     WHERE t.user_id = $1 
       AND start_time >= CURRENT_DATE - INTERVAL '7 days'
     GROUP BY day, DATE(start_time)
     ORDER BY DATE(start_time) ASC`,
    [user_id]
  );
  return rows;
};

export const getTimeMoneyCorrelation = async (user_id) => {
  const { rows } = await query(
    `SELECT 
        t.title,
        SUM(tl.duration_seconds) / 3600 as total_hours,
        SUM(CASE WHEN f.type = 'ingreso' THEN f.amount ELSE -f.amount END) as net_money
     FROM todos t
     LEFT JOIN time_logs tl ON t.id = tl.todo_id
     LEFT JOIN finances f ON t.id = f.todo_id
     WHERE t.user_id = $1
     GROUP BY t.id, t.title
     HAVING SUM(tl.duration_seconds) > 0`,
    [user_id]
  );
  return rows;
};
