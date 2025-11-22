const indiciosRepo = require('./indicios.repository');
const expedientesRepo = require('../expedientes/expedientes.repository'); // Reutilizamos para checar estado

const listar = async (idExpediente) => {
  return await indiciosRepo.listarPorExpediente(idExpediente);
};

const obtener = async (id) => {
  const indicio = await indiciosRepo.obtenerPorId(id);
  if (!indicio) throw new Error('Indicio no encontrado');
  return indicio;
};

const crear = async (idExpediente, data, userId) => {
  // 1. Validar estado del expediente
  const exp = await expedientesRepo.obtenerPorId(idExpediente);
  if (!exp) throw new Error('Expediente no existe');
  
  if (exp.estado_codigo !== 'BORRADOR' && exp.estado_codigo !== 'RECHAZADO') {
    throw new Error('No se pueden agregar indicios a un expediente en proceso o cerrado');
  }

  return await indiciosRepo.crear({
    idExpediente,
    descripcion: data.descripcion,
    color: data.color,
    tamano: data.tamano,
    peso: data.peso,
    ubicacion: data.ubicacion,
    idTecnico: userId
  });
};

const actualizar = async (idIndicio, data) => {
  // 1. Obtener indicio para ver el estado de su expediente padre
  const indicio = await obtener(idIndicio);
  
  if (indicio.estado_expediente_codigo !== 'BORRADOR' && indicio.estado_expediente_codigo !== 'RECHAZADO') {
    throw new Error('No se puede editar este indicio porque el expediente está bloqueado');
  }

  await indiciosRepo.actualizar(idIndicio, data);
  return { message: 'Indicio actualizado' };
};

const eliminar = async (idIndicio) => {
  const indicio = await obtener(idIndicio);
  
  if (indicio.estado_expediente_codigo !== 'BORRADOR' && indicio.estado_expediente_codigo !== 'RECHAZADO') {
    throw new Error('No se puede eliminar este indicio porque el expediente está bloqueado');
  }

  await indiciosRepo.eliminar(idIndicio);
  return { message: 'Indicio eliminado' };
};

module.exports = { listar, obtener, crear, actualizar, eliminar };