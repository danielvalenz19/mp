const reportesService = require('./reportes.service');

const porEstado = async (req, res) => {
  try {
    const data = await reportesService.getReporteEstados(req.query);
    res.json({ ok: true, data });
  } catch (error) {
    res.status(500).json({ ok: false, message: error.message });
  }
};

const porDependencia = async (req, res) => {
  try {
    const data = await reportesService.getReporteDependencias(req.query);
    res.json({ ok: true, data });
  } catch (error) {
    res.status(500).json({ ok: false, message: error.message });
  }
};

const porTecnico = async (req, res) => {
  try {
    const data = await reportesService.getReporteTecnicos(req.query);
    res.json({ ok: true, data });
  } catch (error) {
    res.status(500).json({ ok: false, message: error.message });
  }
};

module.exports = { porEstado, porDependencia, porTecnico };