import { query } from "../config/db.js";

// Crear una misión
export const createMission = async (
  user_id,
  title,
  description,
  financial_goal = 0,
  deadline = null
) => {
  const { rows } = await query(
    `INSERT INTO missions (user_id, title, description, financial_goal, deadline)
     VALUES ($1, $2, $3, $4, $5)
     RETURNING *`,
    [user_id, title, description, financial_goal, deadline]
  );
  return rows[0];
};

// Obtener todas las misiones de un usuario
export const getAllMissions = async (user_id) => {
  const { rows } = await query(
    `SELECT * FROM missions 
     WHERE user_id = $1 
     ORDER BY created_at DESC`,
    [user_id]
  );
  return rows;
};

// Eliminar misión
export const deleteMission = async (id) => {
  await query(`DELETE FROM missions WHERE id = $1`, [id]);
};

export const updateMission = async (
  id,
  { title, description, status, financial_goal, deadline }
) => {
  const { rows } = await query(
    `UPDATE missions
     SET title = COALESCE($1, title),
         description = COALESCE($2, description),
         status = COALESCE($3, status),
         financial_goal = COALESCE($4, financial_goal),
         deadline = COALESCE($5, deadline)
     WHERE id = $6
     RETURNING *`,
    [title, description, status, financial_goal, deadline, id]
  );
  return rows[0];
};
