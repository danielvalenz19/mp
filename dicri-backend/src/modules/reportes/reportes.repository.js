const { getPool } = require('../../db');

const porEstado = async (desde, hasta, dependenciaId) => {
  const pool = await getPool();
  const request = pool.request();
  if (desde) request.input('FechaDesde', desde);
  if (hasta) request.input('FechaHasta', hasta);
  if (dependenciaId) request.input('DependenciaId', dependenciaId);
  
  const result = await request.execute('sp_Reportes_PorEstado');
  return result.recordset;
};

const porDependencia = async (desde, hasta) => {
  const pool = await getPool();
  const request = pool.request();
  if (desde) request.input('FechaDesde', desde);
  if (hasta) request.input('FechaHasta', hasta);

  const result = await request.execute('sp_Reportes_PorDependencia');
  return result.recordset;
};

const porTecnico = async (desde, hasta) => {
  const pool = await getPool();
  const request = pool.request();
  if (desde) request.input('FechaDesde', desde);
  if (hasta) request.input('FechaHasta', hasta);

  const result = await request.execute('sp_Reportes_PorTecnico');
  return result.recordset;
};

module.exports = { porEstado, porDependencia, porTecnico };