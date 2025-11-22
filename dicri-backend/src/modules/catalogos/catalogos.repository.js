const { getPool } = require('../../db');

const getRoles = async () => {
  const pool = await getPool();
  const result = await pool.request().execute('sp_Catalogos_ListarRoles');
  return result.recordset;
};

const getEstados = async () => {
  const pool = await getPool();
  const result = await pool.request().execute('sp_Catalogos_ListarEstados');
  return result.recordset;
};

const getDependencias = async () => {
  const pool = await getPool();
  const result = await pool.request().execute('sp_Catalogos_ListarDependencias');
  return result.recordset;
};

module.exports = { getRoles, getEstados, getDependencias };