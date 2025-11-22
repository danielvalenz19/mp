require('dotenv').config();
const express = require('express');
const cors = require('cors');
const { getPool } = require('./db');

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3013;

app.get('/ping', (req, res) => {
  res.json({ ok: true, message: 'API DICRI viva 🔧' });
});

app.get('/test-db', async (req, res) => {
  try {
    const pool = await getPool();
    const result = await pool.request().query('SELECT TOP 1 1 AS ok;');

    res.json({
      db: 'ok',
      result: result.recordset,
    });
  } catch (err) {
    console.error('Error /test-db:', err);
    res.status(500).json({
      db: 'error',
      message: err.message,
    });
  }
});

app.listen(PORT, async () => {
  console.log(`API escuchando en puerto ${PORT}`);
  try {
    await getPool();
    console.log(
      `✅ Conectado a SQL Server (${process.env.DB_SERVER}) BD: ${process.env.DB_NAME}`
    );
  } catch (err) {
    console.error('❌ Error conectando a SQL Server:', err.message);
  }
});
