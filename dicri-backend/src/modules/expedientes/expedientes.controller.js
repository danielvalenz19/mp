const expService = require('./expedientes.service');

const listar = async (req, res) => {
  try {
    const data = await expService.listarExpedientes(req.query);
    res.json({ ok: true, data });
  } catch (error) {
    res.status(500).json({ ok: false, message: error.message });
  }
};

const obtener = async (req, res) => {
  try {
    const data = await expService.obtenerExpediente(req.params.id);
    res.json({ ok: true, data });
  } catch (error) {
    res.status(404).json({ ok: false, message: error.message });
  }
};

const crear = async (req, res) => {
  try {
    const { titulo, descripcion, idDependencia } = req.body;
    if (!titulo || !idDependencia) return res.status(400).json({ ok: false, message: 'Faltan datos' });

    const result = await expService.crearExpediente(req.body, req.user.id);
    res.status(201).json({ ok: true, message: 'Expediente creado', data: result });
  } catch (error) {
    res.status(400).json({ ok: false, message: error.message });
  }
};

const actualizar = async (req, res) => {
  try {
    await expService.actualizarExpediente(req.params.id, req.body);
    res.json({ ok: true, message: 'Actualizado correctamente' });
  } catch (error) {
    res.status(400).json({ ok: false, message: error.message });
  }
};

const enviarRevision = async (req, res) => {
  try {
    await expService.enviarARevision(req.params.id, req.user.id);
    res.json({ ok: true, message: 'Expediente enviado a revisión' });
  } catch (error) {
    res.status(400).json({ ok: false, message: error.message });
  }
};

const aprobar = async (req, res) => {
  try {
    await expService.aprobarExpediente(req.params.id, req.user.id);
    res.json({ ok: true, message: 'Expediente APROBADO' });
  } catch (error) {
    res.status(400).json({ ok: false, message: error.message });
  }
};

const rechazar = async (req, res) => {
  try {
    const { justificacion } = req.body;
    if (!justificacion) return res.status(400).json({ ok: false, message: 'La justificación es obligatoria' });

    await expService.rechazarExpediente(req.params.id, req.user.id, justificacion);
    res.json({ ok: true, message: 'Expediente RECHAZADO' });
  } catch (error) {
    res.status(400).json({ ok: false, message: error.message });
  }
};

const historial = async (req, res) => {
  try {
    const data = await expService.verHistorial(req.params.id);
    res.json({ ok: true, data });
  } catch (error) {
    res.status(500).json({ ok: false, message: error.message });
  }
};

module.exports = { 
  listar, obtener, crear, actualizar, 
  enviarRevision, aprobar, rechazar, historial 
};