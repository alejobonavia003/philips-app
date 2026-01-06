import { query } from "../config/db.js";

/**
 * CRUD básico para Habits (hábitos)
 * Se asume que existe una tabla `habits` con columnas mínimas:
 * id, user_id, title, description, frequency, is_active, created_at, updated_at
 */

export const createHabit = async (
  user_id,
  title,
  description = null,
  frequency = "daily"
) => {
  const { rows } = await query(
    `INSERT INTO habits (user_id, title, description, frequency)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
    [user_id, title, description, frequency]
  );
  return rows[0];
};

export const getHabitsByUser = async (user_id) => {
  const result = await query(
    `SELECT * FROM habits WHERE user_id = $1 ORDER BY created_at DESC`,
    [user_id]
  );
  return result.rows;
};

export const getHabitById = async (id) => {
  const result = await query(`SELECT * FROM habits WHERE id = $1`, [id]);
  return result.rows[0];
};

export const updateHabit = async (
  id,
  { title, description, frequency, is_active }
) => {
  const { rows } = await query(
    `UPDATE habits
     SET title = COALESCE($1, title),
         description = COALESCE($2, description),
         frequency = COALESCE($3, frequency),
         is_active = COALESCE($4, is_active),
         updated_at = NOW()
     WHERE id = $5
     RETURNING *`,
    [title, description, frequency, is_active, id]
  );
  return rows[0];
};

export const deleteHabit = async (id) => {
  const result = await query(`DELETE FROM habits WHERE id = $1`, [id]);
  return result.rowCount > 0;
};
