const mariadb = require('mariadb');

// Connection 정보 정의
const pool = mariadb.createPool({
  host: process.env.MARIA_DB_CPV_SERVER,
  port: process.env.MARIA_DB_CPV_SERVER_PORT,
  database: process.env.MARIA_DB_CPV_DBNAME,
  user: process.env.MARIA_DB_CPV_USER,
  password: process.env.MARIA_DB_CPV_PW,
  connectionLimit: 5
});

// Query 전송
async function sendQry(str) {
  let conn;
  try {
    conn = await pool.getConnection();
    const rows = await conn.query(str);
    return rows;
  } catch (err) {
    console.error(`\n<↓↓↓↓↓ Error occur ↓↓↓↓↓>\n\n"${str}". `, err)
  } finally {
    if (conn) {
      conn.release();
      conn.end()
    }
  }
};


module.exports = { sendQry }