const mariadb = require('mariadb');

// Connection 정보 정의
const pool = mariadb.createPool({
  host: process.env.THISDB_HOST,
  port: process.env.THISDB_PORT,
  database: process.env.THISDB_NAME,
  user: process.env.THISDB_USER,
  password: process.env.THISDB_PW,
  connectionLimit: 5
});

// DB Connection 객체 생성 함수
async function getConn() { // try ~ catch가 안 먹힘
  try {
    const conn = await pool.getConnection();
    return conn;
  } catch (err) {
    console.error(`\n<↓↓↓↓↓ DB connection error ↓↓↓↓↓>\n\n`, err)
  }
}

// Query 전송
async function sendQry(str) {
  let conn;
  try {
    conn = await getConn();
    const rows = await conn.query(str);
    return rows;
  } catch (err) {
    console.error(`\n<↓↓↓↓↓ Error executing the query ↓↓↓↓↓>\n\n"${str}". `, err)
  } finally {
    if (conn) {
      conn.release();
      conn.end()
    }
  }
};


module.exports = { sendQry }