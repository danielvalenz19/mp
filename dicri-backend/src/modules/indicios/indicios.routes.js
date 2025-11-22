const { Router } = require('express');
const router = Router();
const indiciosController = require('./indicios.controller');
const verifyToken = require('../../middlewares/authMiddleware');

router.use(verifyToken);

/**
 * @swagger
 * tags:
 *   name: Indicios
 *   description: Gestión de evidencias dentro de un caso
 */

/**
 * @swagger
 * /expedientes/{expedienteId}/indicios:
 *   get:
 *     summary: Listar indicios de un expediente
 *     tags: [Indicios]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: expedienteId
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Lista de indicios
 */
router.get('/expedientes/:expedienteId/indicios', indiciosController.listarPorExpediente);

/**
 * @swagger
 * /expedientes/{expedienteId}/indicios:
 *   post:
 *     summary: Agregar indicio a un expediente (Solo BORRADOR/RECHAZADO)
 *     tags: [Indicios]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: expedienteId
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [descripcion]
 *             properties:
 *               descripcion:
 *                 type: string
 *               color:
 *                 type: string
 *               tamano:
 *                 type: string
 *               peso:
 *                 type: number
 *               ubicacion:
 *                 type: string
 *     responses:
 *       201:
 *         description: Creado
 */
router.post('/expedientes/:expedienteId/indicios', indiciosController.crear);

/**
 * @swagger
 * /indicios/{id}:
 *   get:
 *     summary: Detalle de un indicio
 *     tags: [Indicios]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Detalle
 */
router.get('/indicios/:id', indiciosController.obtener);

/**
 * @swagger
 * /indicios/{id}:
 *   put:
 *     summary: Actualizar indicio
 *     tags: [Indicios]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               descripcion:
 *                 type: string
 *               color:
 *                 type: string
 *               tamano:
 *                 type: string
 *               peso:
 *                 type: number
 *               ubicacion:
 *                 type: string
 *     responses:
 *       200:
 *         description: Actualizado
 */
router.put('/indicios/:id', indiciosController.actualizar);

/**
 * @swagger
 * /indicios/{id}:
 *   delete:
 *     summary: Eliminar indicio
 *     tags: [Indicios]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Eliminado
 */
router.delete('/indicios/:id', indiciosController.eliminar);

module.exports = router;