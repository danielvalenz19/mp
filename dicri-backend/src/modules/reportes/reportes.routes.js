const { Router } = require('express');
const router = Router();
const reportesController = require('./reportes.controller');
const verifyToken = require('../../middlewares/authMiddleware');
const roleMiddleware = require('../../middlewares/roleMiddleware');

router.use(verifyToken);
router.use(roleMiddleware(['COORDINADOR', 'ADMIN']));

/**
 * @swagger
 * tags:
 *   name: Reportes
 *   description: Estadisticas para dashboard
 */

/**
 * @swagger
 * /reportes/expedientes-por-estado:
 *   get:
 *     summary: Conteo de expedientes por estado
 *     tags: [Reportes]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
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
 *       - in: query
 *         name: dependenciaId
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Stats
 */
router.get('/expedientes-por-estado', reportesController.porEstado);

/**
 * @swagger
 * /reportes/expedientes-por-dependencia:
 *   get:
 *     summary: Conteo de expedientes por fiscalia
 *     tags: [Reportes]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
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
 *         description: Stats
 */
router.get('/expedientes-por-dependencia', reportesController.porDependencia);

/**
 * @swagger
 * /reportes/expedientes-por-tecnico:
 *   get:
 *     summary: Carga de trabajo por tecnico
 *     tags: [Reportes]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
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
 *         description: Stats
 */
router.get('/expedientes-por-tecnico', reportesController.porTecnico);

module.exports = router;