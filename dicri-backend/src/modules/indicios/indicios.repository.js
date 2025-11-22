const { getPool } = require('../../db');

const listarPorExpediente = async (idExpediente) => {
  const pool = await getPool();
  const result = await pool.request()
    .input('IdExpediente', idExpediente)
    .execute('sp_Indicios_ListarPorExpediente');
  return result.recordset;
};

const obtenerPorId = async (idIndicio) => {
  const pool = await getPool();
  const result = await pool.request()
    .input('IdIndicio', idIndicio)
    .execute('sp_Indicios_ObtenerPorId');
  return result.recordset[0];
};

const crear = async (data) => {
  const pool = await getPool();
  const result = await pool.request()
    .input('IdExpediente', data.idExpediente)
    .input('Descripcion', data.descripcion)
    .input('Color', data.color)
    .input('Tamano', data.tamano)
    .input('Peso', data.peso)
    .input('Ubicacion', data.ubicacion)
    .input('IdTecnico', data.idTecnico)
    .execute('sp_Indicios_Crear');
  return result.recordset[0];
};

const actualizar = async (id, data) => {
  const pool = await getPool();
  await pool.request()
    .input('IdIndicio', id)
    .input('Descripcion', data.descripcion)
    .input('Color', data.color)
    .input('Tamano', data.tamano)
    .input('Peso', data.peso)
    .input('Ubicacion', data.ubicacion)
    .execute('sp_Indicios_Actualizar');
};

const eliminar = async (id) => {
  const pool = await getPool();
  await pool.request()
    .input('IdIndicio', id)
    .execute('sp_Indicios_Eliminar');
};

module.exports = { listarPorExpediente, obtenerPorId, crear, actualizar, eliminar };