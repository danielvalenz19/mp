const expedientesRepo = require('./expedientes.repository');

const listarExpedientes = async (query) => {
  return await expedientesRepo.listar(query);
};

const obtenerExpediente = async (id) => {
  const exp = await expedientesRepo.obtenerPorId(id);
  if (!exp) throw new Error('Expediente no encontrado');
  return exp;
};

const crearExpediente = async (data, userId) => {
  return await expedientesRepo.crear({
    titulo: data.titulo,
    descripcion: data.descripcion,
    idDependencia: data.idDependencia,
    idTecnico: userId // El usuario logueado
  });
};

const actualizarExpediente = async (id, data) => {
  // 1. Validar que exista y estado
  const exp = await obtenerExpediente(id);
  
  // REGLA: Solo editar si es BORRADOR o RECHAZADO
  const estadosEditables = ['BORRADOR', 'RECHAZADO'];
  if (!estadosEditables.includes(exp.estado_codigo)) {
    throw new Error(`No se puede editar el expediente en estado ${exp.estado_codigo}`);
  }

  await expedientesRepo.actualizar(id, data);
  return { message: 'Expediente actualizado' };
};

// --- Lógica de Estados ---

const enviarARevision = async (id, userId) => {
  const exp = await obtenerExpediente(id);
  if (exp.estado_codigo !== 'BORRADOR' && exp.estado_codigo !== 'RECHAZADO') {
    throw new Error('Solo expedientes en Borrador o Rechazados pueden enviarse a revisión');
  }
  await expedientesRepo.cambiarEstado(id, 'EN_REVISION', userId, 'Envío a revisión');
};

const aprobarExpediente = async (id, userId) => {
  const exp = await obtenerExpediente(id);
  if (exp.estado_codigo !== 'EN_REVISION') {
    throw new Error('Solo expedientes En Revisión pueden ser aprobados');
  }
  await expedientesRepo.cambiarEstado(id, 'APROBADO', userId, 'Aprobado por Coordinador');
};

const rechazarExpediente = async (id, userId, justificacion) => {
  const exp = await obtenerExpediente(id);
  if (exp.estado_codigo !== 'EN_REVISION') {
    throw new Error('Solo expedientes En Revisión pueden ser rechazados');
  }
  await expedientesRepo.cambiarEstado(id, 'RECHAZADO', userId, justificacion);
};

const verHistorial = async (id) => {
  return await expedientesRepo.obtenerHistorial(id);
};

module.exports = { 
  listarExpedientes, obtenerExpediente, crearExpediente, 
  actualizarExpediente, enviarARevision, aprobarExpediente, 
  rechazarExpediente, verHistorial 
};