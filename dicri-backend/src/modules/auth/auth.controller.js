const authService = require('./auth.service');

const login = async (req, res) => {
  try {
    const { correo, password } = req.body;
    if (!correo || !password) return res.status(400).json({ ok: false, message: 'Faltan datos' });

    const data = await authService.login(correo, password);
    res.json({ ok: true, ...data });
  } catch (error) {
    res.status(401).json({ ok: false, message: error.message });
  }
};

const refreshToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) return res.status(400).json({ ok: false, message: 'Se requiere refreshToken' });

    const data = await authService.refresh(refreshToken);
    res.json({ ok: true, ...data });
  } catch (error) {
    res.status(403).json({ ok: false, message: error.message });
  }
};

const logout = async (req, res) => {
  try {
    const { refreshToken } = req.body;
    // Si no envían token, igual respondemos OK para no dar pistas, pero idealmente validamos.
    if (refreshToken) {
      await authService.logout(refreshToken);
    }
    res.json({ ok: true, message: 'Sesión cerrada correctamente' });
  } catch (error) {
    res.status(500).json({ ok: false, message: error.message });
  }
};

const getMe = async (req, res) => {
  res.json({ ok: true, user: req.user });
};

module.exports = { login, refreshToken, logout, getMe };
