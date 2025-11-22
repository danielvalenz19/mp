const { getPool } = require('../../db');

const listar = async (rolId, estado, busqueda) => {
  const pool = await getPool();
  const request = pool.request();
  if (rolId) request.input('RolId', rolId);
  if (estado !== undefined) request.input('Estado', estado);
  if (busqueda) request.input('Busqueda', busqueda);
  
  const result = await request.execute('sp_Usuarios_Listar');
  return result.recordset;
};

const obtenerPorId = async (id) => {
  const pool = await getPool();
  const result = await pool.request()
    .input('IdUsuario', id)
    .execute('sp_Usuarios_ObtenerPorId');
  return result.recordset[0];
};

const crear = async (usuario) => {
  const pool = await getPool();
  const result = await pool.request()
    .input('NombreCompleto', usuario.nombre)
    .input('Correo', usuario.correo)
    .input('HashPassword', usuario.hashPassword)
    .input('IdRol', usuario.idRol)
    .execute('sp_Usuarios_Crear');
  return result.recordset[0];
};

const actualizar = async (id, usuario) => {
  const pool = await getPool();
  await pool.request()
    .input('IdUsuario', id)
    .input('NombreCompleto', usuario.nombre)
    .input('Correo', usuario.correo)
    .input('IdRol', usuario.idRol)
    .execute('sp_Usuarios_Actualizar');
};

const cambiarPassword = async (id, hashPassword) => {
  const pool = await getPool();
  await pool.request()
    .input('IdUsuario', id)
    .input('HashPassword', hashPassword)
    .execute('sp_Usuarios_CambiarPassword');
};

const cambiarEstado = async (id, estado) => {
  const pool = await getPool();
  await pool.request()
    .input('IdUsuario', id)
    .input('Estado', estado)
    .execute('sp_Usuarios_CambiarEstado');
};

module.exports = { listar, obtenerPorId, crear, actualizar, cambiarPassword, cambiarEstado };