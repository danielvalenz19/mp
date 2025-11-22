const { getPool } = require('../../db');

const getUserByEmail = async (correo) => {
  const pool = await getPool();
  const result = await pool.request()
    .input('correo', correo)
    .execute('sp_Usuarios_GetByCorreo');
  return result.recordset[0];
};

// --- NUEVO: Métodos para Refresh Token ---

const saveRefreshToken = async (idUsuario, token, fechaExpiracion) => {
  const pool = await getPool();
  await pool.request()
    .input('IdUsuario', idUsuario)
    .input('Token', token)
    .input('FechaExpiracion', fechaExpiracion)
    .execute('sp_RefreshTokens_Guardar');
};

const getRefreshToken = async (token) => {
  const pool = await getPool();
  const result = await pool.request()
    .input('Token', token)
    .execute('sp_RefreshTokens_Obtener');
  return result.recordset[0];
};

const revokeRefreshToken = async (token) => {
  const pool = await getPool();
  await pool.request()
    .input('Token', token)
    .execute('sp_RefreshTokens_Revocar');
};

module.exports = { 
  getUserByEmail, 
  saveRefreshToken, 
  getRefreshToken, 
  revokeRefreshToken 
};
