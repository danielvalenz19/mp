const historialService = require('./historial.service');

const listar = async (req, res) => {
  try {
    const data = await historialService.consultarHistorial(req.query);
    res.json({ ok: true, data });
  } catch (error) {
    res.status(500).json({ ok: false, message: error.message });
  }
};

module.exports = { listar };