import { app } from '../app';
import request from 'supertest';
import { generateRandomName } from '../utils/utils';
import { getCompanyByCompanyName } from '../models/companies';

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

describe('GET company by company id', () => {
  it("Should return 401 if user isn't logged in", async () => {
    const response = await request(app).get('/api/company/1');
    expect(response.status).toBe(401);
  });

  it("Should return 400 if id isn't a number", async () => {
    const userLogin = {
      email: 'example@email.com',
      psw: 'password',
    };
    const loginResponse = await request(app)
      .post('/api/user/login')
      .send(userLogin);

    const cookie = loginResponse.header['set-cookie'][0];

    const response = await request(app)
      .get('/api/company/NaN')
      .set('Cookie', cookie);

    expect(response.status).toBe(400);
  });

  it("Should return 404 if user is logged in but a company with the provided id doesn't exist", async () => {
    const userLogin = {
      email: 'example@email.com',
      psw: 'password',
    };
    const loginResponse = await request(app)
      .post('/api/user/login')
      .send(userLogin);

    const cookie = loginResponse.header['set-cookie'][0];

    const response = await request(app)
      .get('/api/company/10000000')
      .set('Cookie', cookie);

    expect(response.status).toBe(404);
  });

  it('Should return 200 if user is logged in and a company with the provided id exists', async () => {
    const userLogin = {
      email: 'example@email.com',
      psw: 'password',
    };
    const loginResponse = await request(app)
      .post('/api/user/login')
      .send(userLogin);

    const cookie = loginResponse.header['set-cookie'][0];

    const response = await request(app)
      .get('/api/company/1')
      .set('Cookie', cookie);

    expect(response.status).toBe(200);
  });
});

describe('DELETE company', () => {
  it("Should return 401 if user isn't logged in", async () => {
    const response = await request(app).delete('/api/company/4');
    expect(response.status).toBe(401);
  });

  it('Should return a 400 if user is correctly logged in but is trying to delete a non existing company', async () => {
    const userLogin = {
      email: 'example@email.com',
      psw: 'password',
    };

    const loginResponse = await request(app)
      .post('/api/user/login')
      .send(userLogin);

    const cookie = loginResponse.header['set-cookie'][0];

    const response = await request(app)
      .delete('/api/company/999999')
      .set('Cookie', cookie);

    expect(response.status).toBe(400);
  });

  it("Should return a 403 if user is correctly logged in but is trying to delete another user's company", async () => {
    const userLogin = {
      email: 'example@email.com',
      psw: 'password',
    };

    const loginResponse = await request(app)
      .post('/api/user/login')
      .send(userLogin);

    const cookie = loginResponse.header['set-cookie'][0];

    const response = await request(app)
      .delete('/api/company/3')
      .set('Cookie', cookie);

    expect(response.status).toBe(403);
  });

  it('Should return a 202 if user is correctly deleteing a company of theirs', async () => {
    const userLogin = {
      email: 'example@email.com',
      psw: 'password',
    };

    const loginResponse = await request(app)
      .post('/api/user/login')
      .send(userLogin);

    const cookie = loginResponse.header['set-cookie'][0];

    const comapnyBody = {
      company_name: generateRandomName(),
    };

    await request(app)
      .post('/api/company')
      .set('Cookie', cookie)
      .send(comapnyBody);

    const company = (
      await getCompanyByCompanyName(comapnyBody.company_name)
    )[0];
    
    const response = await request(app)
      .delete(`/api/company/${company[0].company_id}`)
      .set('Cookie', cookie);

    expect(response.status).toBe(202);
  });
});
