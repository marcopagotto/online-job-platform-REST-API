import { app } from '../app';
import request from 'supertest';
import { generateRandomEmail, generateRandomName } from '../utils/utils';
import { getCompanyByCompanyName } from '../models/companies';
import { deleteUserByEmail } from '../models/users';

describe('POST new company', () => {
  it("Should return 401 if user isn't logged in", async () => {
    const response = await request(app).post('/api/company');

    expect(response.status).toBe(401);
  });

  it('Should return 400 if user is authenticated and a company with company_name provided already exists', async () => {
    const email = generateRandomEmail();

    const userBody = {
      forename: 'forename',
      lastname: 'lastname',
      sex: 'F',
      birthdate: '2000-12-12',
      email: email,
      psw: 'password',
    };

    await request(app).post('/api/user').send(userBody);

    const authUserBody = {
      email: email,
      psw: 'password',
    };

    const loginResponse = await request(app)
      .post('/api/user/login')
      .send(authUserBody);

    const cookie = loginResponse.header['set-cookie'][0];

    const companyBody = { company_name: generateRandomName() };

    await request(app)
      .post('/api/company')
      .set('Cookie', cookie)
      .send(companyBody);

    const response = await request(app)
      .post('/api/company')
      .set('Cookie', cookie)
      .send(companyBody);

    expect(response.status).toBe(400);

    await deleteUserByEmail(email);
  });

  it('Should return 201 if user is authenticated and company_name provided is correct', async () => {
    const email = generateRandomEmail();

    const userBody = {
      forename: 'forename',
      lastname: 'lastname',
      sex: 'F',
      birthdate: '2000-12-12',
      email: email,
      psw: 'password',
    };

    await request(app).post('/api/user').send(userBody);

    const authUserBody = {
      email: email,
      psw: 'password',
    };

    const loginResponse = await request(app)
      .post('/api/user/login')
      .send(authUserBody);

    const cookie = loginResponse.header['set-cookie'][0];

    const companyBody = { company_name: generateRandomName() };

    const response = await request(app)
      .post('/api/company')
      .set('Cookie', cookie)
      .send(companyBody);

    expect(response.status).toBe(201);

    await deleteUserByEmail(email);
  });
});

describe('GET company by company id', () => {
  it("Should return 401 if user isn't logged in", async () => {
    const response = await request(app).get('/api/company/1');

    expect(response.status).toBe(401);
  });

  it("Should return 400 if id isn't a number", async () => {
    const email = generateRandomEmail();

    const userBody = {
      forename: 'forename',
      lastname: 'lastname',
      sex: 'F',
      birthdate: '2000-12-12',
      email: email,
      psw: 'password',
    };

    await request(app).post('/api/user').send(userBody);

    const authUserBody = {
      email: email,
      psw: 'password',
    };

    const loginResponse = await request(app)
      .post('/api/user/login')
      .send(authUserBody);

    const cookie = loginResponse.header['set-cookie'][0];

    const response = await request(app)
      .get('/api/company/NaN')
      .set('Cookie', cookie);

    expect(response.status).toBe(400);

    await deleteUserByEmail(email);
  });

  it("Should return 404 if user is logged in but a company with the provided id doesn't exist", async () => {
    const email = generateRandomEmail();

    const userBody = {
      forename: 'forename',
      lastname: 'lastname',
      sex: 'F',
      birthdate: '2000-12-12',
      email: email,
      psw: 'password',
    };

    await request(app).post('/api/user').send(userBody);

    const authUserBody = {
      email: email,
      psw: 'password',
    };

    const loginResponse = await request(app)
      .post('/api/user/login')
      .send(authUserBody);

    const cookie = loginResponse.header['set-cookie'][0];

    const response = await request(app)
      .get('/api/company/999999')
      .set('Cookie', cookie);

    expect(response.status).toBe(404);

    await deleteUserByEmail(email);
  });

  it('Should return 200 if user is logged in and a company with the provided id exists', async () => {
    const email = generateRandomEmail();

    const userBody = {
      forename: 'forename',
      lastname: 'lastname',
      sex: 'F',
      birthdate: '2000-12-12',
      email: email,
      psw: 'password',
    };

    await request(app).post('/api/user').send(userBody);

    const authUserBody = {
      email: email,
      psw: 'password',
    };

    const loginResponse = await request(app)
      .post('/api/user/login')
      .send(authUserBody);

    const cookie = loginResponse.header['set-cookie'][0];

    const companyBody = { company_name: generateRandomName() };

    await request(app)
      .post('/api/company')
      .set('Cookie', cookie)
      .send(companyBody);

    const comapnyId = (
      await getCompanyByCompanyName(companyBody.company_name)
    )[0][0].company_id;

    const response = await request(app)
      .get(`/api/company/${comapnyId}`)
      .set('Cookie', cookie);

    expect(response.status).toBe(200);

    await deleteUserByEmail(email);
  });
});

describe('DELETE company', () => {
  it("Should return 401 if user isn't logged in", async () => {
    const response = await request(app).delete('/api/company/1');

    expect(response.status).toBe(401);
  });

  it('Should return a 400 if user is correctly logged in but is trying to delete a non existing company', async () => {
    const email = generateRandomEmail();

    const userBody = {
      forename: 'forename',
      lastname: 'lastname',
      sex: 'F',
      birthdate: '2000-12-12',
      email: email,
      psw: 'password',
    };

    await request(app).post('/api/user').send(userBody);

    const authUserBody = {
      email: email,
      psw: 'password',
    };

    const loginResponse = await request(app)
      .post('/api/user/login')
      .send(authUserBody);

    const cookie = loginResponse.header['set-cookie'][0];

    const response = await request(app)
      .delete('/api/company/999999')
      .set('Cookie', cookie);

    expect(response.status).toBe(400);

    await deleteUserByEmail(email);
  });

  it("Should return a 403 if user is correctly logged in but is trying to delete another user's company", async () => {
    const email1 = generateRandomEmail();
    const email2 = generateRandomEmail();

    const userBody1 = {
      forename: 'forename',
      lastname: 'lastname',
      sex: 'F',
      birthdate: '2000-12-12',
      email: email1,
      psw: 'password',
    };

    const userBody2 = {
      forename: 'forename',
      lastname: 'lastname',
      sex: 'F',
      birthdate: '2000-12-12',
      email: email2,
      psw: 'password',
    };

    await request(app).post('/api/user').send(userBody1);

    await request(app).post('/api/user').send(userBody2);

    const authUserBody1 = {
      email: email1,
      psw: 'password',
    };

    const loginResponse1 = await request(app)
      .post('/api/user/login')
      .send(authUserBody1);

    const cookie1 = loginResponse1.header['set-cookie'][0];

    const companyBody = { company_name: generateRandomName() };

    await request(app)
      .post('/api/company')
      .set('Cookie', cookie1)
      .send(companyBody);

    const comapnyId = (
      await getCompanyByCompanyName(companyBody.company_name)
    )[0][0].company_id;

    const authUserBody2 = {
      email: email2,
      psw: 'password',
    };

    const loginResponse2 = await request(app)
      .post('/api/user/login')
      .send(authUserBody2);

    const cookie2 = loginResponse2.header['set-cookie'][0];

    const response = await request(app)
      .delete(`/api/company/${comapnyId}`)
      .set('Cookie', cookie2);

    expect(response.status).toBe(403);

    await deleteUserByEmail(email1);
    await deleteUserByEmail(email2);
  });

  it('Should return a 202 if user is correctly deleteing a company of theirs', async () => {
    const email = generateRandomEmail();

    const userBody = {
      forename: 'forename',
      lastname: 'lastname',
      sex: 'F',
      birthdate: '2000-12-12',
      email: email,
      psw: 'password',
    };

    await request(app).post('/api/user').send(userBody);

    const authUserBody = {
      email: email,
      psw: 'password',
    };

    const loginResponse = await request(app)
      .post('/api/user/login')
      .send(authUserBody);

    const cookie = loginResponse.header['set-cookie'][0];

    const comapnyBody = {
      company_name: generateRandomName(),
    };

    await request(app)
      .post('/api/company')
      .set('Cookie', cookie)
      .send(comapnyBody);

    const companyId = (
      await getCompanyByCompanyName(comapnyBody.company_name)
    )[0][0].company_id;

    const response = await request(app)
      .delete(`/api/company/${companyId}`)
      .set('Cookie', cookie);

    expect(response.status).toBe(202);

    await deleteUserByEmail(email);
  });
});
