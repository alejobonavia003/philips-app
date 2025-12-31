import { query } from "../config/db.js";

/**
 * obtener todos los todos por id de usuario
 * @param {id usuario} id
 * @returns
 */
export const getTodosByID = async (id) => {
  const rows = await query(
    "SELECT todos.*, shared_todos.shared_with_id FROM todos LEFT JOIN shared_todos ON todos.id = shared_todos.todo_id WHERE todos.user_id = $1 OR shared_todos.shared_with_id = $1",
    [id]
  );
  return rows.rows;
};

/**
 * obtener todo por id
 * @param {todo id} id
 * @returns
 */
export const getTodo = async (id) => {
  const rows = await query("SELECT * FROM todos WHERE id = $1", [id]);
  return rows.rows;
};

/**
 * obtener los los usuarios que comparten un todo
 * @param {id del todo} id
 * @returns
 */
export async function getSharedTodoById(id) {
  const rows = await query("SELECT * FROM shared_todos WHERE todo_id = $1", [
    id,
  ]);
  return rows.rows;
}

// Antes: export const createTodo = async (user_id, title, description) => { ...
// AHORA:
export const createTodo = async (
  user_id,
  title,
  description,
  mission_id = null
) => {
  const { rows } = await query(
    `INSERT INTO todos (user_id, title, description, mission_id)
     VALUES ($1, $2, $3, $4)
     RETURNING *`,
    [user_id, title, description, mission_id]
  );
  return rows[0];
};

/**
 * funcion para eliminar un todo
 * @param {id del todo} id
 * @returns cantidad de filas eliminadas
 */
export async function deleteTodo(id) {
  const result = await query("DELETE FROM todos WHERE id = $1", [id]);
  return result.rowCount;
}

/**
 * marcar un todo como completado o no completado
 * @param {id del todo} id
 * @returns
 */
export async function toggleTodo(id) {
  const actualValueRow = await query(
    "SELECT is_completed FROM todos WHERE id = $1",
    [id]
  );
  const actualValue = actualValueRow.rows[0].is_completed;
  const newValue = !actualValue;

  const result = await query(
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
  const result = await query(
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
  const result = await query(
    "SELECT * FROM shared_todos WHERE todo_id = $1 AND shared_with_id = $2",
    [todo_id, shared_with_id]
  );
  return result.rows.length > 0;
}
