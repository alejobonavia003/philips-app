import { query } from "../config/db.js";

/**
 * obtener usuario por id
 * @param {id usuario} id
 * @returns
 */
export async function getUserById(id) {
  const row = await query(
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
  const row = await query("SELECT * FROM users WHERE email = $1", [email]);
  return row.rows[0];
}
