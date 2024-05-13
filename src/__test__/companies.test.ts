import { app } from '../app';
import request from 'supertest';
import { generateRandomName } from '../utils/utils';

describe('POST new company', () => {
  it("Should return 401 if user isn't logged in", async () => {
    const response = await request(app).post('/api/company');
    expect(response.status).toBe(401);
  });

  it('Should return 400 if user is authenticated and a company with company_name provided already exists', async () => {
    const userLogin = {
      email: 'example@email.com',
      psw: 'password',
    };

    const loginResponse = await request(app)
      .post('/api/user/login')
      .send(userLogin);

    const cookie = loginResponse.header['set-cookie'][0];

    const company_name = { company_name: 'Microsoft' };

    const response = await request(app)
      .post('/api/company')
      .set('Cookie', cookie)
      .send(company_name);

    expect(response.status).toBe(400);
  });

  it('Should return 201 if user is authenticated and company_name provided is correct', async () => {
    const userLogin = {
      email: 'example@email.com',
      psw: 'password',
    };

    const loginResponse = await request(app)
      .post('/api/user/login')
      .send(userLogin);

    const cookie = loginResponse.header['set-cookie'][0];

    const company_name = { company_name: generateRandomName() };

    const response = await request(app)
      .post('/api/company')
      .set('Cookie', cookie)
      .send(company_name);

    expect(response.status).toBe(201);
  });
});
