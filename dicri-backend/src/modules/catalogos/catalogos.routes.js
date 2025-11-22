const { Router } = require('express');
const router = Router();
const catalogosController = require('./catalogos.controller');
const verifyToken = require('../../middlewares/authMiddleware');

router.use(verifyToken); // Protegemos todo el módulo

/**
 * @swagger
 * tags:
 *   name: Catalogos
 *   description: Listados para llenar combos/selects (Requiere Auth)
 */

/**
 * @swagger
 * /catalogos/roles:
 *   get:
 *     summary: Listar roles de usuario
 *     tags: [Catalogos]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de roles
 */
router.get('/roles', catalogosController.getRoles);

/**
 * @swagger
 * /catalogos/estados-expediente:
 *   get:
 *     summary: Listar posibles estados de un expediente
 *     tags: [Catalogos]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de estados (BORRADOR, APROBADO, etc.)
 */
router.get('/estados-expediente', catalogosController.getEstados);

/**
 * @swagger
 * /catalogos/dependencias:
 *   get:
 *     summary: Listar fiscalías o unidades (Dependencias)
 *     tags: [Catalogos]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de dependencias
 */
router.get('/dependencias', catalogosController.getDependencias);

module.exports = router;