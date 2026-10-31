const request = require('supertest');
const app = require('../src/app');

beforeEach(() => app.resetStudents());

describe('Student Management API', () => {
  test('GET /api/students returns the student list', async () => {
    const response = await request(app).get('/api/students');
    expect(response.statusCode).toBe(200);
    expect(response.body).toHaveLength(2);
    expect(response.body[0].name).toBe('Asha');
  });

  test('POST /api/students creates a student', async () => {
    const response = await request(app)
      .post('/api/students')
      .send({ name: 'Meera', course: 'Data Science', year: 1 });

    expect(response.statusCode).toBe(201);
    expect(response.body).toMatchObject({
      id: 3, name: 'Meera', course: 'Data Science', year: 1
    });
  });

  test('POST /api/students rejects invalid input', async () => {
    const response = await request(app)
      .post('/api/students')
      .send({ name: 'Meera', course: 'Data Science', year: 0 });

    expect(response.statusCode).toBe(400);
  });

  test('GET /api/students/999 returns 404 for an unknown student', async () => {
    const response = await request(app).get('/api/students/999');
    expect(response.statusCode).toBe(404);
  });
});
