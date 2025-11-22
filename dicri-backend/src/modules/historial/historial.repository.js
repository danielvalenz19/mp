const { getPool } = require('../../db');

const listarGlobal = async (filters) => {
  const pool = await getPool();
  const request = pool.request();
  
  if (filters.expedienteId) request.input('ExpedienteId', filters.expedienteId);
  if (filters.estadoId) request.input('EstadoId', filters.estadoId);
  if (filters.usuarioId) request.input('UsuarioId', filters.usuarioId);
  if (filters.fechaDesde) request.input('FechaDesde', filters.fechaDesde);
  if (filters.fechaHasta) request.input('FechaHasta', filters.fechaHasta);

  const result = await request.execute('sp_Historial_ListarGlobal');
  return result.recordset;
};

module.exports = { listarGlobal };