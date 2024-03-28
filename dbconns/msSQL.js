
var sql = require('mssql');
var config = {
    user: 'sa',
    password: 'p@ssw0rd',
    database: 'CPV',
    server: '10.3.7.72', // You can use 'localhost\\instance' to connect to named instance
    requestTimeout: 100000,   //요청시간이 길어지면 저 시간이되면 끊어짐 Defalut : 15000 현재는 100초임
    options: {
        encrypt: false,
        enableArithAbort: true,
    },
}

const sqlConfig = {
    user: process.env.DB_USER,
    password: process.env.DB_PWD,
    database: process.env.DB_NAME,
    server: 'localhost',
    pool: {
      max: 10,
      min: 0,
      idleTimeoutMillis: 30000
    },
    options: {
      encrypt: true, // for azure
      trustServerCertificate: false // change to true for local dev / self-signed certs
    }
  }


async function getConn() {
    const conn = await sql.connect(config, err)
    return conn
}

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

}
//==========================================
(async function () {
    try {
        let pool = await sql.connect(config)
        let result1 = await pool.request()
            .input('input_parameter', sql.Int, value)
            .query('select * from mytable where id = @input_parameter')
            
        console.dir(result1)
    
        // Stored procedure
        
        let result2 = await pool.request()
            .input('input_parameter', sql.Int, value)
            .output('output_parameter', sql.VarChar(50))
            .execute('procedure_name')
        
        console.dir(result2)
    } catch (err) {
        // ... error checks
    }
})()

sql.on('error', err => {
    // ... error handler
})