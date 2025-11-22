require('dotenv').config();
const sql = require('mssql');

const sqlConfig = {
  user: process.env.DB_USER, // sa
  password: process.env.DB_PASSWORD, // 12345678
  database: process.env.DB_NAME, // DicriEvidenciasDB
  server: process.env.DB_SERVER, // localhost
  options: {
    encrypt: false,
    trustServerCertificate: true,
  },
};

let pool;

async function getPool() {
  if (pool) return pool;
  console.log('CONFIG SQL USADA POR NODE:', sqlConfig);
  pool = await sql.connect(sqlConfig);
  return pool;
}

module.exports = { sql, getPool };
