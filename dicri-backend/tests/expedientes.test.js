const request = require('supertest');
const jwt = require('jsonwebtoken');
const app = require('../src/app');
const db = require('../src/db');

// Mock de la Base de Datos
jest.mock('../src/db');

describe('Pruebas del Modulo de Expedientes (Rutas Protegidas)', () => {
  let token;

  // Generamos un token valido para un usuario tecnico
  beforeAll(() => {
    process.env.JWT_SECRET = 'testsecret';
    const userPayload = {
      id: 10,
      nombre: 'Juan Tecnico',
      rol: 'TECNICO',
      rolId: 1,
    };
    token = jwt.sign(userPayload, process.env.JWT_SECRET, { expiresIn: '1h' });
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('GET /expedientes deberia devolver 200 y lista de casos (Usuario Autenticado)', async () => {
    const mockExpedientes = [
      { id: 1, titulo: 'Caso Prueba 1', estado: 'BORRADOR' },
      { id: 2, titulo: 'Caso Prueba 2', estado: 'EN_REVISION' },
    ];

    const mockPool = {
      request: jest.fn().mockReturnThis(),
      input: jest.fn().mockReturnThis(),
      execute: jest.fn().mockResolvedValue({ recordset: mockExpedientes }),
    };
    db.getPool.mockResolvedValue(mockPool);

    const res = await request(app)
      .get('/expedientes')
      .set('Authorization', `Bearer ${token}`);

    expect(res.statusCode).toBe(200);
    expect(res.body.ok).toBe(true);
    expect(res.body.data).toHaveLength(2);
  });

  test('GET /expedientes deberia fallar con 401 si no hay token', async () => {
    const res = await request(app).get('/expedientes');
    expect(res.statusCode).toBe(401);
  });

  test('POST /expedientes deberia crear un caso exitosamente', async () => {
    const mockPool = {
      request: jest.fn().mockReturnThis(),
      input: jest.fn().mockReturnThis(),
      execute: jest.fn().mockResolvedValue({
        recordset: [{ id: 99, codigo: 'DICRI-2025-TEST' }],
      }),
    };
    db.getPool.mockResolvedValue(mockPool);

    const nuevoCaso = {
      titulo: 'Robo Test Unitario',
      descripcion: 'Prueba de Jest',
      idDependencia: 1,
    };

    const res = await request(app)
      .post('/expedientes')
      .set('Authorization', `Bearer ${token}`)
      .send(nuevoCaso);

    expect(res.statusCode).toBe(201);
    expect(res.body.ok).toBe(true);
    expect(res.body.message).toContain('Expediente creado');
  });
});
