import { app } from '../app';
import request from 'supertest';
import { generateRandomEmail, generateRandomName } from '../utils/utils';
import { deleteUserByEmail } from '../models/users';
import { getCompanyByCompanyName } from '../models/companies';
import { getMostRecentListingByEmployerId } from '../models/listings';

describe('POST listing', () => {
  it("Should return 401 if user isn't logged in", async () => {
    const response = await request(app).post('/api/listing');
    expect(response.status).toBe(401);
  });

  it('Should return 400 if user is authenticated but is trying to post a not existing company', async () => {
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

    const listingBody = {
      employer_id: '999999',
      job_title: 'job_title',
      description: 'job_description',
      remote: true,
      annual_salary: '100000',
    };

    const response = await request(app)
      .post('/api/listing')
      .set('Cookie', cookie)
      .send(listingBody);

    expect(response.status).toBe(400);

    await deleteUserByEmail(email);
  });

  it("Should return 403 if user is authenticated but is trying to post another user's company", async () => {
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

    const companyId = (
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

    const listingBody = {
      employer_id: companyId,
      job_title: 'job_title',
      description: 'job_description',
      remote: true,
      annual_salary: '100000',
    };

    const response = await request(app)
      .post('/api/listing')
      .set('Cookie', cookie2)
      .send(listingBody);

    expect(response.status).toBe(403);

    await deleteUserByEmail(email1);
    await deleteUserByEmail(email2);
  });

  it("Should return 201 if user is authenticated and is the company's employer", async () => {
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

    const companyId = (
      await getCompanyByCompanyName(companyBody.company_name)
    )[0][0].company_id;

    const listingBody = {
      employer_id: companyId,
      job_title: 'job_title',
      description: 'job_description',
      remote: true,
      annual_salary: '100000',
    };

    const response = await request(app)
      .post('/api/listing')
      .set('Cookie', cookie)
      .send(listingBody);

    expect(response.status).toBe(201);

    await deleteUserByEmail(email);
  });
});

describe('GET listing by id', () => {
  it("Should return 401 if user isn't logged in", async () => {
    const response = await request(app).get('/api/listing/1');
    expect(response.status).toBe(401);
  });

  it('Should return 400 if user is authenticated but invalid listing_id was provided', async () => {
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
      .get('/api/listing/NaN')
      .set('Cookie', cookie);

    expect(response.status).toBe(400);

    await deleteUserByEmail(email);
  });

  it('Should return 404 if user is authenticated but no listing with the provided id was found', async () => {
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
      .get('/api/listing/999999')
      .set('Cookie', cookie);

    expect(response.status).toBe(404);

    await deleteUserByEmail(email);
  });

  it('Should return 200 if user is authenticated and valid listing_id was provided', async () => {
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

    const companyId = (
      await getCompanyByCompanyName(companyBody.company_name)
    )[0][0].company_id;

    const listingBody = {
      employer_id: companyId,
      job_title: 'job_title',
      description: 'job_description',
      remote: true,
      annual_salary: '100000',
    };

    await request(app)
      .post('/api/listing')
      .set('Cookie', cookie)
      .send(listingBody);

    const listingId = (await getMostRecentListingByEmployerId(companyId))[0][0]
      .listing_id;

    const response = await request(app)
      .get(`/api/listing/${listingId}`)
      .set('Cookie', cookie);

    expect(response.status).toBe(200);

    await deleteUserByEmail(email);
  });
});

describe('DELETE listing', () => {
  it("Should return 401 if user isn't logged in", async () => {
    const response = await request(app).delete('/api/listing/1');
    expect(response.status).toBe(401);
  });

  it('Should return 400 if user is authenticated but no listing with the provided id exists', async () => {
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
      .delete('/api/listing/999999')
      .set('Cookie', cookie);

    expect(response.status).toBe(400);

    await deleteUserByEmail(email);
  });

  it("Should return 403 if user is authenticated but is trying to delete a listing that they don't own", async () => {
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

    const authUserBody2 = {
      email: email2,
      psw: 'password',
    };

    const loginResponse1 = await request(app)
      .post('/api/user/login')
      .send(authUserBody1);

    const loginResponse2 = await request(app)
      .post('/api/user/login')
      .send(authUserBody2);

    const cookie1 = loginResponse1.header['set-cookie'][0];
    const cookie2 = loginResponse2.header['set-cookie'][0];

    const companyBody = { company_name: generateRandomName() };

    await request(app)
      .post('/api/company')
      .set('Cookie', cookie1)
      .send(companyBody);

    const companyId = (
      await getCompanyByCompanyName(companyBody.company_name)
    )[0][0].company_id;

    const listingBody = {
      employer_id: companyId,
      job_title: 'job_title',
      description: 'job_description',
      remote: true,
      annual_salary: '100000',
    };

    await request(app)
      .post('/api/listing')
      .set('Cookie', cookie1)
      .send(listingBody);

    const listingId = (await getMostRecentListingByEmployerId(companyId))[0][0]
      .listing_id;

    const response = await request(app)
      .delete(`/api/listing/${listingId}`)
      .set('Cookie', cookie2);

    expect(response.status).toBe(403);

    await deleteUserByEmail(email1);
    await deleteUserByEmail(email2);
  });

  it('Should return 201 if user is authenticated and is correctly deleting a listing of theirs', async () => {
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

    const companyId = (
      await getCompanyByCompanyName(companyBody.company_name)
    )[0][0].company_id;

    const listingBody = {
      employer_id: companyId,
      job_title: 'job_title',
      description: 'job_description',
      remote: true,
      annual_salary: '100000',
    };

    const postListingResponse = await request(app)
      .post('/api/listing')
      .set('Cookie', cookie)
      .send(listingBody);

    const listingId = postListingResponse.body[0].listing_id;

    const response = await request(app)
      .delete(`/api/listing/${listingId}`)
      .set('Cookie', cookie);

    expect(response.status).toBe(201);
  });
});
