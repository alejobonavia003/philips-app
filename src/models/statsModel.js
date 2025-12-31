import { query } from "../config/db.js";

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

export const getTimeHistory = async (user_id) => {
  const { rows } = await query(
    `SELECT 
        t.title, 
        tl.start_time, 
        tl.duration_seconds
     FROM time_logs tl
     JOIN todos t ON tl.todo_id = t.id
     WHERE t.user_id = $1 
       AND tl.duration_seconds IS NOT NULL -- Solo sesiones terminadas
     ORDER BY tl.start_time DESC
     LIMIT 20`,
    [user_id]
  );
  return rows;
};
