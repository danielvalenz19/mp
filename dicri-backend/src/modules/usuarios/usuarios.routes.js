const { Router } = require('express');
const router = Router();
const usuariosController = require('./usuarios.controller');
const verifyToken = require('../../middlewares/authMiddleware');
const roleMiddleware = require('../../middlewares/roleMiddleware');

// Middleware general para todas las rutas de usuarios: Login + Rol ADMIN/COORDINADOR
router.use(verifyToken);
router.use(roleMiddleware(['ADMIN', 'COORDINADOR']));

/**
 * @swagger
 * tags:
 *   name: Usuarios
 *   description: Gestión de usuarios (Requiere Rol ADMIN o COORDINADOR)
 */

/**
 * @swagger
 * /usuarios:
 *   get:
 *     summary: Listar usuarios
 *     tags: [Usuarios]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: query
 *         name: busqueda
 *         schema:
 *           type: string
 *         description: Buscar por nombre o correo
 *       - in: query
 *         name: rolId
 *         schema:
 *           type: integer
 *       - in: query
 *         name: estado
 *         schema:
 *           type: integer
 *           enum: [0, 1]
 *     responses:
 *       200:
 *         description: Lista de usuarios
 */
router.get('/', usuariosController.listar);

/**
 * @swagger
 * /usuarios/{id}:
 *   get:
 *     summary: Obtener detalle de usuario
 *     tags: [Usuarios]
 *     security: [{ bearerAuth: [] }]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Detalle del usuario
 */
router.get('/:id', usuariosController.obtener);

/**
 * @swagger
 * /usuarios:
 *   post:
 *     summary: Crear nuevo usuario
 *     tags: [Usuarios]
 *     security: [{ bearerAuth: [] }]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [nombre, correo, password, idRol]
 *             properties:
 *               nombre:
 *                 type: string
 *               correo:
 *                 type: string
 *               password:
 *                 type: string
 *               idRol:
 *                 type: integer
 *     responses:
 *       201:
 *         description: Usuario creado
 */
router.post('/', usuariosController.crear);

/**
 * @swagger
 * /usuarios/{id}:
 *   put:
 *     summary: Actualizar datos generales
 *     tags: [Usuarios]
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
 *             properties:
 *               nombre:
 *                 type: string
 *               correo:
 *                 type: string
 *               idRol:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Actualizado
 */
router.put('/:id', usuariosController.actualizar);

/**
 * @swagger
 * /usuarios/{id}/password:
 *   patch:
 *     summary: Cambiar contraseña de un usuario
 *     tags: [Usuarios]
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
 *             required: [password]
 *             properties:
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Contraseña cambiada
 */
router.patch('/:id/password', usuariosController.cambiarPassword);

/**
 * @swagger
 * /usuarios/{id}/estado:
 *   patch:
 *     summary: Activar / Desactivar usuario
 *     tags: [Usuarios]
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
 *             required: [estado]
 *             properties:
 *               estado:
 *                 type: integer
 *                 enum: [0, 1]
 *                 description: 1 = Activo, 0 = Inactivo
 *     responses:
 *       200:
 *         description: Estado actualizado
 */
router.patch('/:id/estado', usuariosController.cambiarEstado);

module.exports = router;