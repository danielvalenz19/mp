require('dotenv').config();
const express = require('express');
const cors = require('cors');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');

// Importar rutas
const authRoutes = require('./modules/auth/auth.routes');
const usuariosRoutes = require('./modules/usuarios/usuarios.routes');
const catalogosRoutes = require('./modules/catalogos/catalogos.routes');
const expedientesRoutes = require('./modules/expedientes/expedientes.routes');
const indiciosRoutes = require('./modules/indicios/indicios.routes');
const historialRoutes = require('./modules/historial/historial.routes');
const reportesRoutes = require('./modules/reportes/reportes.routes');

const app = express();

app.use(cors());
app.use(express.json());

// Documentación
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Rutas
app.use('/auth', authRoutes);
app.use('/usuarios', usuariosRoutes);
app.use('/catalogos', catalogosRoutes);
app.use('/expedientes', expedientesRoutes);
app.use('/', indiciosRoutes); // Indicios usa rutas mixtas
app.use('/historial', historialRoutes);
app.use('/reportes', reportesRoutes);

app.get('/ping', (req, res) => {
  res.json({ ok: true, message: 'API DICRI viva 🔧' });
});

module.exports = app; // <--- ESTO ES LO IMPORTANTE