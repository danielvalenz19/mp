const { getPool } = require('../../db');

const listar = async (params) => {
  const pool = await getPool();
  const request = pool.request();
  if (params.estado) request.input('EstadoId', params.estado);
  if (params.dependencia) request.input('DependenciaId', params.dependencia);
  if (params.tecnico) request.input('TecnicoId', params.tecnico);
  if (params.busqueda) request.input('Busqueda', params.busqueda);
  // Fechas opcionales
  if (params.fechaDesde) request.input('FechaDesde', params.fechaDesde);
  if (params.fechaHasta) request.input('FechaHasta', params.fechaHasta);

  const result = await request.execute('sp_Expedientes_Listar');
  return result.recordset;
};

const obtenerPorId = async (id) => {
  const pool = await getPool();
  const result = await pool.request()
    .input('IdExpediente', id)
    .execute('sp_Expedientes_ObtenerPorId');
  return result.recordset[0];
};

const crear = async (data) => {
  const pool = await getPool();
  const result = await pool.request()
    .input('Titulo', data.titulo)
    .input('DescripcionBreve', data.descripcion)
    .input('IdTecnicoRegistra', data.idTecnico)
    .input('IdDependencia', data.idDependencia)
    .execute('sp_Expedientes_Crear');
  return result.recordset[0];
};

const actualizar = async (id, data) => {
  const pool = await getPool();
  await pool.request()
    .input('IdExpediente', id)
    .input('Titulo', data.titulo)
    .input('DescripcionBreve', data.descripcion)
    .input('IdDependencia', data.idDependencia)
    .execute('sp_Expedientes_Actualizar');
};

const cambiarEstado = async (idExpediente, codigoEstado, idUsuario, justificacion = null) => {
  const pool = await getPool();
  await pool.request()
    .input('IdExpediente', idExpediente)
    .input('NuevoCodigoEstado', codigoEstado)
    .input('IdUsuarioAccion', idUsuario)
    .input('Justificacion', justificacion)
    .execute('sp_Expedientes_CambiarEstado');
};

const obtenerHistorial = async (id) => {
  const pool = await getPool();
  const result = await pool.request()
    .input('IdExpediente', id)
    .execute('sp_Expedientes_Historial');
  return result.recordset;
};

module.exports = { listar, obtenerPorId, crear, actualizar, cambiarEstado, obtenerHistorial };