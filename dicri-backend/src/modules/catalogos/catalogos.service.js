const catalogosRepo = require('./catalogos.repository');

const listarRoles = async () => {
  return await catalogosRepo.getRoles();
};

const listarEstados = async () => {
  return await catalogosRepo.getEstados();
};

const listarDependencias = async () => {
  return await catalogosRepo.getDependencias();
};

module.exports = { listarRoles, listarEstados, listarDependencias };