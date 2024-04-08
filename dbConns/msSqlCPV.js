
var sql = require('mssql');

// Connection 정보 정의 (속성 설명 출처 : CHAT GPT 검색)
const pool = new sql.ConnectionPool({
  user: 'sa',
  password: 'p@ssw0rd',
  database: 'CPV',
  server: '10.3.7.72', // You can use 'localhost\\instance' to connect to named instance
  requestTimeout: 100000,   //요청시간이 길어지면 저 시간이되면 끊어짐 Defalut : 15000 현재는 100초임
  pool: {
    max: 5, /* 풀에 유지할 최대 연결 수입니다.
    이 값을 너무 높게 설정하면 서버 리소스를 과도하게 사용할 수 있으며,
    너무 낮게 설정하면 동시에 처리할 수 있는 요청 수가 제한됩니다.
    */
    min: 0, /* 풀에 유지할 최소 연결 수입니다.
    풀에 연결 수가 이 값보다 적으면 풀에 연결이 추가됩니다.
    */
    idleTimeoutMillis: 30000 /* 사용되지 않은 연결이 풀에 유지되는 시간(밀리초)입니다.
    이 시간이 경과하면 연결이 풀에서 제거됩니다.
    이를 통해 불필요한 리소스 소비를 방지할 수 있습니다.
    */
  },
  options: {
    encrypt: false, /* SQL Server 연결을 암호화할지 여부를 결정하는 옵션입니다.
    encrypt를 true로 설정하면 데이터가 네트워크를 통해 전송될 때 암호화됩니다.
    보안상의 이유로 데이터를 암호화하여 전송하는 것이 안전합니다.
    그러나 일부 환경에서는 암호화가 필요하지 않을 수도 있습니다. */
    enableArithAbort: true, /* SQL Server에서 산술 연산이 중단될 때 트랜잭션을 종료할지 여부를 결정하는 옵션입니다.
    이 옵션이 true로 설정되면 산술 오류가 발생할 때 트랜잭션이 종료됩니다.
    일반적으로 이 값을 true로 설정하여 산술 연산 오류를 감지하고 처리하는 것이 좋습니다. */
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
  let sqlReq;
  let rs;
  try {
    sqlReq = (await pool.connect()).request();
    prm.p.map((value, key) => {
      sqlReq.input(`${value.name}`, `${value.value}`)
    })
    prm.o.map((value, key) => {
      sqlReq.output(`${value.name}`)
    })
    rs = (await sqlReq.execute(prm.procedure)).output
  } catch (err) {
    console.error(`\n<↓↓↓↓↓ Error occur ↓↓↓↓↓>\n\n. `, err)
  }
  return rs
}

module.exports = { sendQry, sendReq }