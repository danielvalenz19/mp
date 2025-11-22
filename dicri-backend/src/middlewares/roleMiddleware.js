const roleMiddleware = (allowedRoles) => {
  return (req, res, next) => {
    // req.user viene del authMiddleware previo
    if (!req.user || !req.user.rol) {
      return res.status(403).json({ ok: false, message: 'Acceso denegado: Rol no identificado' });
    }

    // allowedRoles debe ser un array, ej: ['ADMIN', 'COORDINADOR']
    // Convertimos a mayúsculas por si acaso
    const userRol = req.user.rol.toUpperCase();
    const permitted = allowedRoles.map(r => r.toUpperCase());

    if (permitted.includes(userRol)) {
      next();
    } else {
      return res.status(403).json({ ok: false, message: `Acceso denegado. Se requiere rol: ${allowedRoles.join(' o ')}` });
    }
  };
};

module.exports = roleMiddleware;