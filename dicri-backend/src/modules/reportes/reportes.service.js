const reportesRepo = require('./reportes.repository');

const getReporteEstados = async (query) => {
  return await reportesRepo.porEstado(query.fechaDesde, query.fechaHasta, query.dependenciaId);
};

const getReporteDependencias = async (query) => {
  return await reportesRepo.porDependencia(query.fechaDesde, query.fechaHasta);
};

const getReporteTecnicos = async (query) => {
  return await reportesRepo.porTecnico(query.fechaDesde, query.fechaHasta);
};

module.exports = { getReporteEstados, getReporteDependencias, getReporteTecnicos };