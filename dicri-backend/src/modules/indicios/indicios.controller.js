const indiciosService = require('./indicios.service');

const listarPorExpediente = async (req, res) => {
  try {
    const data = await indiciosService.listar(req.params.expedienteId);
    res.json({ ok: true, data });
  } catch (error) {
    res.status(500).json({ ok: false, message: error.message });
  }
};

const obtener = async (req, res) => {
  try {
    const data = await indiciosService.obtener(req.params.id);
    res.json({ ok: true, data });
  } catch (error) {
    res.status(404).json({ ok: false, message: error.message });
  }
};

const crear = async (req, res) => {
  try {
    const { descripcion } = req.body;
    if (!descripcion) return res.status(400).json({ ok: false, message: 'La descripción es obligatoria' });

    const result = await indiciosService.crear(req.params.expedienteId, req.body, req.user.id);
    res.status(201).json({ ok: true, message: 'Indicio registrado', id: result.id });
  } catch (error) {
    res.status(400).json({ ok: false, message: error.message });
  }
};

const actualizar = async (req, res) => {
  try {
    await indiciosService.actualizar(req.params.id, req.body);
    res.json({ ok: true, message: 'Indicio actualizado' });
  } catch (error) {
    res.status(400).json({ ok: false, message: error.message });
  }
};

const eliminar = async (req, res) => {
  try {
    await indiciosService.eliminar(req.params.id);
    res.json({ ok: true, message: 'Indicio eliminado' });
  } catch (error) {
    res.status(400).json({ ok: false, message: error.message });
  }
};

module.exports = { listarPorExpediente, obtener, crear, actualizar, eliminar };