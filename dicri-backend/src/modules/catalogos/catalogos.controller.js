const catalogosService = require('./catalogos.service');

const getRoles = async (req, res) => {
  try {
    const data = await catalogosService.listarRoles();
    res.json({ ok: true, data });
  } catch (error) {
    res.status(500).json({ ok: false, message: error.message });
  }
};

const getEstados = async (req, res) => {
  try {
    const data = await catalogosService.listarEstados();
    res.json({ ok: true, data });
  } catch (error) {
    res.status(500).json({ ok: false, message: error.message });
  }
};

const getDependencias = async (req, res) => {
  try {
    const data = await catalogosService.listarDependencias();
    res.json({ ok: true, data });
  } catch (error) {
    res.status(500).json({ ok: false, message: error.message });
  }
};

module.exports = { getRoles, getEstados, getDependencias };