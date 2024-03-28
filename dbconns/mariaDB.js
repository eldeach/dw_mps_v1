const mariadb = require('mariadb');

// Connection 정보 정의
const pool = mariadb.createPool({
  host: process.env.THISDB_HOST,
  port: process.env.THISDB_PORT,
  user: process.env.THISDB_USER,
  password: process.env.THISDB_PW,
  connectionLimit: 5
});

// DB Connection 객체 생성 함수
async function getConn(dbName = process.env.THISDB_NAME) {
  const conn = await pool.getConnection();
  conn.query('USE ' + dbName);
  return conn;
}

// Query 전송
async function sendQry(str) {
  let conn;
  try {
    conn = await getConn();
    const rows = await conn.query(str);
    return rows;
  } catch (err) {
    console.log(err)
  } finally {
    conn.release();
    conn.end()
  }
};

module.exports = { sendQry }