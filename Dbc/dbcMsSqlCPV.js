
const sql = require('mssql');

// Connection 정보 정의 (속성 설명 출처 : CHAT GPT 검색)
const pool = new sql.ConnectionPool({
  user: process.env.MSSQL_DB_CPV_USER,
  password: process.env.MSSQL_DB_CPV_PW,
  database: process.env.MSSQL_DB_CPV_DBNAME,
  server: process.env.MSSQL_DB_CPV_SERVER,
  requestTimeout: 100000,
  pool: {
    max: 5,
    min: 0,
    idleTimeoutMillis: 30000 
  },
  options: {
    encrypt: false,
    enableArithAbort: true,
  },
})


// Query 전송
async function sendQry(str) {
  let conn;
  try {
    conn = await pool.connect();
    const rows = await conn.query(str);
    return rows.recordset;
  } catch (err) {
    console.error(`\n<↓↓↓↓↓ Error occur ↓↓↓↓↓>\n\n"${str}". `, err)
  } finally {
    if (conn) {
      conn.close();
    }
  }
};


// Procedure 실행
async function sendReq(prm) {
  let conn;
  let sqlReq;
  let rs;
  try {
    conn = await pool.connect()
    sqlReq = conn.request();
    prm.pInput.map((value, key) => {
      sqlReq.input(`${value.name}`, `${value.value}`)
    })
    prm.pOutput.map((value, key) => {
      sqlReq.output(`${value.name}`)
    })
    rs = (await sqlReq.execute(prm.procedure))
  } catch (err) {
    console.error(`\n<↓↓↓↓↓ Error occur ↓↓↓↓↓>\n\n. `, err)
  } finally {
    if (conn) {
      conn.close();
    }
  }
  return rs
}

module.exports = { sendQry, sendReq }