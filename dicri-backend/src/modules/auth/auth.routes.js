const { Router } = require('express');
const router = Router();
const authController = require('./auth.controller');
const verifyToken = require('../../middlewares/authMiddleware');

/**
 * @swagger
 * tags:
 *   name: Auth
 *   description: Endpoints de autenticación (Login, Refresh, Logout, Me)
 */

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Iniciar sesión y obtener tokens
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [correo, password]
 *             properties:
 *               correo:
 *                 type: string
 *                 default: admin@dicri.gob.gt
 *               password:
 *                 type: string
 *                 default: 123456
 *     responses:
 *       200:
 *         description: Login exitoso
 */
router.post('/login', authController.login);

/**
 * @swagger
 * /auth/refresh:
 *   post:
 *     summary: Obtener un nuevo Access Token usando el Refresh Token
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [refreshToken]
 *             properties:
 *               refreshToken:
 *                 type: string
 *     responses:
 *       200:
 *         description: Token renovado
 *       403:
 *         description: Token inválido o expirado
 */
router.post('/refresh', authController.refreshToken);

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: Cerrar sesión (Revocar Refresh Token)
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [refreshToken]
 *             properties:
 *               refreshToken:
 *                 type: string
 *     responses:
 *       200:
 *         description: Sesión cerrada
 */
router.post('/logout', authController.logout);

/**
 * @swagger
 * /auth/me:
 *   get:
 *     summary: Obtener perfil del usuario actual (Requiere Access Token)
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Datos del usuario
 */
router.get('/me', verifyToken, authController.getMe);

module.exports = router;
