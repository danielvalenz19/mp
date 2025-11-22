const historialRepo = require('./historial.repository');

const consultarHistorial = async (query) => {
  return await historialRepo.listarGlobal(query);
};

module.exports = { consultarHistorial };