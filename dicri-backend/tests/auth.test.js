const request = require('supertest');
const app = require('../src/app');
const db = require('../src/db'); // Importamos para mockearlo
const bcrypt = require('bcryptjs');

// Mockeamos la conexión a la BD para no depender de SQL Server real
jest.mock('../src/db');

describe('Pruebas del Módulo de Autenticación', () => {
  
  // Datos de prueba
  const mockUser = {
    id_usuario: 1,
    nombre_completo: 'Test User',
    correo: 'test@dicri.gob.gt',
    hash_password: '$2a$10$FakeHashForTestingPurposeOnly...', // Hash falso
    id_rol: 1,
    rol_nombre: 'ADMIN'
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('POST /auth/login debería devolver token si las credenciales son correctas', async () => {
    // 1. Simulamos que la BD encuentra al usuario
    const mockPool = {
      request: jest.fn().mockReturnThis(),
      input: jest.fn().mockReturnThis(),
      execute: jest.fn().mockResolvedValue({
        recordset: [mockUser] // La BD devuelve nuestro usuario fake
      })
    };
    db.getPool.mockResolvedValue(mockPool);

    // 2. Simulamos que bcrypt dice "la contraseña es correcta"
    // (Hackeamos bcrypt para este test específico)
    jest.spyOn(bcrypt, 'compare').mockResolvedValue(true);

    // 3. Hacemos la petición a la API
    const res = await request(app)
      .post('/auth/login')
      .send({
        correo: 'test@dicri.gob.gt',
        password: 'password123'
      });

    // 4. Verificaciones (Assertions)
    expect(res.statusCode).toBe(200);
    expect(res.body.ok).toBe(true);
    expect(res.body).toHaveProperty('accessToken'); // Debe devolver token
    expect(res.body.user).toHaveProperty('nombre_completo', 'Test User');
  });

  test('POST /auth/login debería fallar con contraseña incorrecta', async () => {
    // 1. Simulamos que la BD encuentra al usuario
    const mockPool = {
      request: jest.fn().mockReturnThis(),
      input: jest.fn().mockReturnThis(),
      execute: jest.fn().mockResolvedValue({
        recordset: [mockUser]
      })
    };
    db.getPool.mockResolvedValue(mockPool);

    // 2. Simulamos que bcrypt dice "contraseña INCORRECTA"
    jest.spyOn(bcrypt, 'compare').mockResolvedValue(false);

    // 3. Petición
    const res = await request(app)
      .post('/auth/login')
      .send({
        correo: 'test@dicri.gob.gt',
        password: 'wrongpassword'
      });

    // 4. Verificaciones
    expect(res.statusCode).toBe(401); // No autorizado
    expect(res.body.ok).toBe(false);
  });
});