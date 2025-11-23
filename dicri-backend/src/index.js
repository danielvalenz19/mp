// src/index.js
const app = require('./app'); // Importamos la configuración
const { getPool } = require('./db');

const PORT = process.env.PORT || 3013;

app.listen(PORT, async () => {
  console.log(`API escuchando en puerto ${PORT}`);
  console.log(`📄 Swagger disponible en http://localhost:${PORT}/api-docs`);
  try {
    await getPool();
    console.log(`✅ Conectado a SQL Server (${process.env.DB_NAME})`);
  } catch (err) {
    console.error('❌ Error conectando a SQL Server:', err.message);
  }
});
