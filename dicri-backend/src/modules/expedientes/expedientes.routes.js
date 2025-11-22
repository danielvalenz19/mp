const { Router } = require('express');
const router = Router();
const expController = require('./expedientes.controller');
const verifyToken = require('../../middlewares/authMiddleware');
const roleMiddleware = require('../../middlewares/roleMiddleware');

router.use(verifyToken);

/**
 * @swagger
 * tags:
 *   name: Expedientes
 *   description: Gestión principal de casos
 */

/**
 * @swagger
 * /expedientes:
 *   get:
 *     summary: Listar expedientes con filtros
 *     tags: [Expedientes]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: query
 *         name: busqueda
 *         schema:
 *           type: string
 *       - in: query
 *         name: estado
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Lista obtenida
 */
router.get('/', expController.listar);

/**
 * @swagger
 * /expedientes:
 *   post:
 *     summary: Crear nuevo expediente (Estado BORRADOR)
 *     tags: [Expedientes]
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [titulo, idDependencia]
 *             properties:
 *               titulo:
 *                 type: string
 *               descripcion:
 *                 type: string
 *               idDependencia:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Creado exitosamente
 */
router.post('/', expController.crear);

/**
 * @swagger
 * /expedientes/{id}:
 *   get:
 *     summary: Detalle de un expediente
 *     tags: [Expedientes]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Detalle encontrado
 */
router.get('/:id', expController.obtener);

/**
 * @swagger
 * /expedientes/{id}:
 *   put:
 *     summary: Actualizar datos (Solo en BORRADOR/RECHAZADO)
 *     tags: [Expedientes]
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
 *               titulo:
 *                 type: string
 *               descripcion:
 *                 type: string
 *               idDependencia:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Actualizado
 */
router.put('/:id', expController.actualizar);

/**
 * @swagger
 * /expedientes/{id}/enviar-revision:
 *   patch:
 *     summary: Cambiar estado a EN_REVISION
 *     tags: [Expedientes]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Enviado a revisión
 */
router.patch('/:id/enviar-revision', expController.enviarRevision);

/**
 * @swagger
 * /expedientes/{id}/aprobar:
 *   patch:
 *     summary: Aprobar expediente (Solo COORDINADOR)
 *     tags: [Expedientes]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Aprobado
 */
router.patch('/:id/aprobar', roleMiddleware(['COORDINADOR', 'ADMIN']), expController.aprobar);

/**
 * @swagger
 * /expedientes/{id}/rechazar:
 *   patch:
 *     summary: Rechazar expediente (Solo COORDINADOR)
 *     tags: [Expedientes]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [justificacion]
 *             properties:
 *               justificacion:
 *                 type: string
 *     responses:
 *       200:
 *         description: Rechazado
 */
router.patch('/:id/rechazar', roleMiddleware(['COORDINADOR', 'ADMIN']), expController.rechazar);

/**
 * @swagger
 * /expedientes/{id}/historial-estados:
 *   get:
 *     summary: Ver bitácora de cambios de estado
 *     tags: [Expedientes]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Historial
 */
router.get('/:id/historial-estados', expController.historial);

module.exports = router;