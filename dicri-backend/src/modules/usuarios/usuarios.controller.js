const usuariosService = require('./usuarios.service');

const listar = async (req, res) => {
  try {
    const usuarios = await usuariosService.listarUsuarios(req.query);
    res.json({ ok: true, data: usuarios });
  } catch (error) {
    res.status(500).json({ ok: false, message: error.message });
  }
};

const obtener = async (req, res) => {
  try {
    const usuario = await usuariosService.obtenerUsuario(req.params.id);
    res.json({ ok: true, data: usuario });
  } catch (error) {
    res.status(404).json({ ok: false, message: error.message });
  }
};

const crear = async (req, res) => {
  try {
    const { nombre, correo, password, idRol } = req.body;
    if (!nombre || !correo || !password || !idRol) {
      return res.status(400).json({ ok: false, message: 'Faltan datos obligatorios' });
    }
    const result = await usuariosService.crearUsuario({ nombre, correo, password, idRol });
    res.status(201).json({ ok: true, message: 'Usuario creado', id: result.id });
  } catch (error) {
    res.status(400).json({ ok: false, message: error.message });
  }
};

const actualizar = async (req, res) => {
  try {
    const { nombre, correo, idRol } = req.body;
    await usuariosService.actualizarUsuario(req.params.id, { nombre, correo, idRol });
    res.json({ ok: true, message: 'Usuario actualizado correctamente' });
  } catch (error) {
    res.status(400).json({ ok: false, message: error.message });
  }
};

const cambiarPassword = async (req, res) => {
  try {
    const { password } = req.body;
    if (!password) return res.status(400).json({ ok: false, message: 'Falta nueva contraseña' });
    
    await usuariosService.cambiarPassword(req.params.id, password);
    res.json({ ok: true, message: 'Contraseña actualizada' });
  } catch (error) {
    res.status(500).json({ ok: false, message: error.message });
  }
};

const cambiarEstado = async (req, res) => {
  try {
    const { estado } = req.body; // 1 o 0
    if (estado === undefined) return res.status(400).json({ ok: false, message: 'Falta estado' });

    await usuariosService.cambiarEstado(req.params.id, estado);
    res.json({ ok: true, message: `Estado actualizado a ${estado}` });
  } catch (error) {
    res.status(500).json({ ok: false, message: error.message });
  }
};

module.exports = { listar, obtener, crear, actualizar, cambiarPassword, cambiarEstado };