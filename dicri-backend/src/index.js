require('dotenv').config();
const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express'); // Importar UI
const swaggerSpec = require('./config/swagger'); // Importar config
const { getPool } = require('./db');

// Importar rutas de módulos
const authRoutes = require('./modules/auth/auth.routes');
const usuariosRoutes = require('./modules/usuarios/usuarios.routes');

const app = express();
const PORT = process.env.PORT || 3013;

app.use(cors());
app.use(express.json());

// --- DOCUMENTACIÓN SWAGGER ---
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
console.log(`📄 Swagger disponible en http://localhost:${PORT}/api-docs`);

// --- RUTAS ---
app.use('/auth', authRoutes);
app.use('/usuarios', usuariosRoutes);

app.get('/ping', (req, res) => {
  res.json({ ok: true, message: 'API DICRI viva 🔧' });
});

app.listen(PORT, async () => {
  console.log(`API escuchando en puerto ${PORT}`);
  try {
    await getPool();
    console.log(`✅ Conectado a SQL Server (${process.env.DB_NAME})`);
  } catch (err) {
    console.error('❌ Error conectando a SQL Server:', err.message);
  }
});
