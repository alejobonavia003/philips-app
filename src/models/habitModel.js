import { query } from "../config/db.js";

/**
 * Modelo actualizado para `habits` y `habit_logs` acorde al esquema proporcionado:
 *
 * habits: id, user_id, name, frequency, created_at
 * habit_logs: id, habit_id, date, completed
 */

export const createHabit = async (user_id, name, frequency = "daily") => {
  const { rows } = await query(
    `INSERT INTO habits (user_id, name, frequency)
     VALUES ($1, $2, $3)
     RETURNING *`,
    [user_id, name, frequency]
  );
  return rows[0];
};

export const getHabitsByUser = async (user_id) => {
  const result = await query(
    `SELECT id, user_id, name, frequency, created_at
     FROM habits
     WHERE user_id = $1
     ORDER BY created_at DESC`,
    [user_id]
  );
  return result.rows;
};

export const getHabitById = async (id) => {
  const result = await query(
    `SELECT id, user_id, name, frequency, created_at
     FROM habits
     WHERE id = $1`,
    [id]
  );
  return result.rows[0];
};

export const updateHabit = async (id, { name, frequency }) => {
  const { rows } = await query(
    `UPDATE habits
     SET name = COALESCE($1, name),
         frequency = COALESCE($2, frequency)
     WHERE id = $3
     RETURNING id, user_id, name, frequency, created_at`,
    [name, frequency, id]
  );
  return rows[0];
};

export const deleteHabit = async (id) => {
  const result = await query(`DELETE FROM habits WHERE id = $1`, [id]);
  return result.rowCount > 0;
};

// ------------------ Habit Logs ------------------

export const addHabitLog = async (habit_id, date, completed = false) => {
  const { rows } = await query(
    `INSERT INTO habit_logs (habit_id, date, completed)
     VALUES ($1, $2, $3)
     ON CONFLICT (habit_id, date) DO UPDATE SET completed = EXCLUDED.completed
     RETURNING *`,
    [habit_id, date, completed]
  );
  return rows[0];
};

export const getHabitLogs = async (
  habit_id,
  startDate = null,
  endDate = null
) => {
  if (startDate && endDate) {
    const res = await query(
      `SELECT * FROM habit_logs WHERE habit_id = $1 AND date BETWEEN $2 AND $3 ORDER BY date ASC`,
      [habit_id, startDate, endDate]
    );
    return res.rows;
  }
  const res = await query(
    `SELECT * FROM habit_logs WHERE habit_id = $1 ORDER BY date ASC`,
    [habit_id]
  );
  return res.rows;
};

export const getHabitLogByDate = async (habit_id, date) => {
  const res = await query(
    `SELECT * FROM habit_logs WHERE habit_id = $1 AND date = $2`,
    [habit_id, date]
  );
  return res.rows[0];
};

export const updateHabitLog = async (id, { completed }) => {
  const { rows } = await query(
    `UPDATE habit_logs SET completed = COALESCE($1, completed) WHERE id = $2 RETURNING *`,
    [completed, id]
  );
  return rows[0];
};

export const deleteHabitLog = async (id) => {
  const res = await query(`DELETE FROM habit_logs WHERE id = $1`, [id]);
  return res.rowCount > 0;
};
