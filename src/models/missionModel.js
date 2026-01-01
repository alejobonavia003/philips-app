import pool from "../config/db.js";

// Crear una misión (puede ser primaria o secundaria si trae parent_id)
export const createMission = async (
  user_id,
  title,
  description,
  type,
  parent_id = null,
  financial_goal = 0,
  deadline = null
) => {
  const { rows } = await query(
    `INSERT INTO missions (user_id, title, description, type, parent_id, financial_goal, deadline)
     VALUES ($1, $2, $3, $4, $5, $6, $7)
     RETURNING *`,
    [user_id, title, description, type, parent_id, financial_goal, deadline]
  );
  return rows[0];
};

// Obtener todas las misiones de un usuario (para listas generales)
export const getAllMissions = async (user_id) => {
  const { rows } = await query(
    `SELECT * FROM missions WHERE user_id = $1 ORDER BY created_at DESC`,
    [user_id]
  );
  return rows;
};

// Obtener solo las PRIMARIAS (con progreso calculado - FASE AVANZADA PREPARADA)
export const getPrimaryMissions = async (user_id) => {
  const { rows } = await query(
    `SELECT * FROM missions 
     WHERE user_id = $1 AND type = 'primaria' 
     ORDER BY created_at DESC`,
    [user_id]
  );
  return rows;
};

// Obtener las SECUNDARIAS de una misión específica
export const getSecondaryMissions = async (parent_id) => {
  const { rows } = await query(
    `SELECT * FROM missions 
     WHERE parent_id = $1 
     ORDER BY created_at DESC`,
    [parent_id]
  );
  return rows;
};

// Eliminar misión
export const deleteMission = async (id) => {
  // Nota: Al tener claves foráneas, si borras una misión, asegúrate de manejar qué pasa con sus tareas.
  // Por ahora hacemos un delete simple.
  await query(`DELETE FROM missions WHERE id = $1`, [id]);
};

export const updateMission = async (
  id,
  { title, description, type, status, parent_id, financial_goal, deadline }
) => {
  const { rows } = await query(
    `UPDATE missions
     SET title = COALESCE($1, title),
         description = COALESCE($2, description),
         type = COALESCE($3, type),
         status = COALESCE($4, status),
         parent_id = COALESCE($5, parent_id),
         financial_goal = COALESCE($6, financial_goal),
         deadline = COALESCE($7, deadline)
     WHERE id = $8
     RETURNING *`,
    [title, description, type, status, parent_id, financial_goal, deadline, id]
  );
  return rows[0];
};
