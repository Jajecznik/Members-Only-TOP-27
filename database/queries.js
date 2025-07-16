const pool = require('./pool');

async function getUserById(id) {
  const { rows } = await pool.query(
    `SELECT * FROM users WHERE id = $1`,
    [id]
  );

  return rows[0];
}

async function getUserByUsername(username) {
  const { rows } = await pool.query(
    `SELECT * FROM users WHERE username = $1`,
    [username]
  );

  return rows[0];
}

async function getUserByEmail(email) {
  const { rows } = await pool.query(
    `SELECT * FROM users WHERE email = $1`,
    [email]
  );

  return rows[0];
}

async function createUser(data) {
  await pool.query(
    `INSERT INTO users (first_name, last_name, username, email, password) VALUES ($1, $2, $3, $4, $5)`,
    [data.firstName, data.lastName, data.username, data.email, data.password]
  );

  return;
}

async function giveUserAdmin(userId) {
  await pool.query(
    `UPDATE users SET is_admin = true WHERE id = $1`,
    [userId]
  );
}

async function giveUserMembership(userId) {
  await pool.query(
    `UPDATE users SET membership_status = true WHERE id = $1`,
    [userId]
  );
}

async function addNewMessage(message) {
  await pool.query(
    `INSERT INTO messages (title, message, user_id) VALUES ($1, $2, $3)`,
    [message.title, message.message, message.userId]
  );
}

async function getAllMessages() {
  const { rows } = await pool.query(
    `SELECT 
      m.id,
      m.title, 
      m.message, 
      m.created_at, 
      u.username 
        FROM messages m
        JOIN users u ON m.user_id = u.id
        ORDER BY m.created_at DESC;
    `
  );

  return rows;
}

async function deleteMessage(id) {
  await pool.query(
    `DELETE FROM messages WHERE id = $1`,
    [id]
  );
}

module.exports = {
  getUserById,
  getUserByUsername,
  getUserByEmail,
  createUser,
  giveUserAdmin,
  giveUserMembership,
  addNewMessage,
  getAllMessages,
  deleteMessage
}