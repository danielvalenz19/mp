const bcrypt = require('bcryptjs');
const usuariosRepo = require('./usuarios.repository');

const listarUsuarios = async (query) => {
  const { rolId, estado, busqueda } = query;
  return await usuariosRepo.listar(rolId, estado, busqueda);
};

const obtenerUsuario = async (id) => {
  const usuario = await usuariosRepo.obtenerPorId(id);
  if (!usuario) throw new Error('Usuario no encontrado');
  return usuario;
};

const crearUsuario = async (data) => {
  // Hashear password
  const salt = await bcrypt.genSalt(10);
  const hashPassword = await bcrypt.hash(data.password, salt);

  const nuevoUsuario = {
    nombre: data.nombre,
    correo: data.correo,
    hashPassword: hashPassword,
    idRol: data.idRol
  };
  return await usuariosRepo.crear(nuevoUsuario);
};

const actualizarUsuario = async (id, data) => {
  // Validar que exista
  await obtenerUsuario(id);
  await usuariosRepo.actualizar(id, data);
  return { message: 'Usuario actualizado' };
};

const cambiarPassword = async (id, newPassword) => {
  await obtenerUsuario(id);
  const salt = await bcrypt.genSalt(10);
  const hash = await bcrypt.hash(newPassword, salt);
  await usuariosRepo.cambiarPassword(id, hash);
};

const cambiarEstado = async (id, estado) => {
  await obtenerUsuario(id);
  await usuariosRepo.cambiarEstado(id, estado);
};

module.exports = { listarUsuarios, obtenerUsuario, crearUsuario, actualizarUsuario, cambiarPassword, cambiarEstado };