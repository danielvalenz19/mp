const { Router } = require('express');
const router = Router();
const historialController = require('./historial.controller');
const verifyToken = require('../../middlewares/authMiddleware');
const roleMiddleware = require('../../middlewares/roleMiddleware');

// Solo COORDINADOR o ADMIN deberían ver la auditoría global
router.use(verifyToken);
router.use(roleMiddleware(['COORDINADOR', 'ADMIN']));

/**
 * @swagger
 * tags:
 *   name: Historial
 *   description: Auditoría global de movimientos
 */

/**
 * @swagger
 * /historial/expedientes:
 *   get:
 *     summary: Buscar en la bitácora de cambios
 *     tags: [Historial]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: query
 *         name: expedienteId
 *         schema:
 *           type: integer
 *       - in: query
 *         name: usuarioId
 *         schema:
 *           type: integer
 *       - in: query
 *         name: fechaDesde
 *         schema:
 *           type: string
 *           format: date
 *       - in: query
 *         name: fechaHasta
 *         schema:
 *           type: string
 *           format: date
 *     responses:
 *       200:
 *         description: Lista de movimientos
 */
router.get('/expedientes', historialController.listar);

module.exports = router;