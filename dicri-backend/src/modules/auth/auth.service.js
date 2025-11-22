const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const authRepo = require('./auth.repository');

// Helper para generar Access Token (corto tiempo de vida, ej. 15 min)
const generateAccessToken = (user) => {
  return jwt.sign(
    { 
      id: user.id_usuario || user.IdUsuario, // Soporta ambos casos
      nombre: user.nombre_completo || user.Nombre, 
      rol: user.rol_nombre || 'USUARIO'
    }, 
    process.env.JWT_SECRET, 
    { expiresIn: '15m' } // Token rápido
  );
};

// Helper para generar Refresh Token (largo tiempo de vida, ej. 7 días)
const generateRefreshToken = () => {
  // Creamos un string aleatorio firmado (o UUID)
  return jwt.sign({ type: 'refresh' }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

const login = async (correo, password) => {
  const user = await authRepo.getUserByEmail(correo);
  if (!user) throw new Error('Credenciales inválidas');

  const isMatch = await bcrypt.compare(password, user.hash_password);
  if (!isMatch) throw new Error('Credenciales inválidas');

  delete user.hash_password;

  // 1. Generar Tokens
  const accessToken = generateAccessToken(user);
  const refreshToken = generateRefreshToken();

  // 2. Calcular fecha expiración para BD (7 días desde hoy)
  const fechaExp = new Date();
  fechaExp.setDate(fechaExp.getDate() + 7);

  // 3. Guardar Refresh Token en BD
  await authRepo.saveRefreshToken(user.id_usuario, refreshToken, fechaExp);

  return { accessToken, refreshToken, user };
};

const refresh = async (token) => {
  // 1. Buscar token en BD
  const storedToken = await authRepo.getRefreshToken(token);
  if (!storedToken) throw new Error('Refresh token inválido');

  // 2. Verificar si está revocado
  if (storedToken.Revocado) throw new Error('Refresh token revocado');

  // 3. Verificar expiración (BD y JWT)
  try {
    jwt.verify(token, process.env.JWT_SECRET);
  } catch (e) {
    throw new Error('Refresh token expirado');
  }

  // 4. Si todo OK, generar NUEVO Access Token
  // Necesitamos recuperar datos básicos del usuario (podemos decodificar el viejo accessToken o volver a consultar BD. 
  // Por simplicidad usaremos el ID que guardamos en la tabla RefreshTokens).
  
  // NOTA: Para un sistema real, deberíamos volver a consultar los datos del usuario para asegurar que no haya cambiado de rol.
  // Aquí asumimos un objeto básico con el ID.
  const newAccessToken = jwt.sign(
    { id: storedToken.IdUsuario }, 
    process.env.JWT_SECRET, 
    { expiresIn: '15m' }
  );

  return { accessToken: newAccessToken };
};

const logout = async (token) => {
  await authRepo.revokeRefreshToken(token);
};

module.exports = { login, refresh, logout };
