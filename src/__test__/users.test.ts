import { app } from '../app';
import request from 'supertest';
import { generateRandomEmail } from '../utils/utils';

describe('POST new user', () => {
  it('Should return 400 if all fields are missing', async () => {
    const user = {};

    const response = await request(app).post('/api/user').send(user);
    expect(response.status).toBe(400);
  });

  it('Should return 400 if any field is missing', async () => {
    const user = {
      lastname: 'lastname',
      sex: 'F',
      birthdate: '2000-12-12',
      email: 'example@email.com',
      psw: 'password',
    };

    const response = await request(app).post('/api/user').send(user);
    expect(response.status).toBe(400);
  });

  it('Should return 400 if birthdate field is not provided in the right format', async () => {
    const user = {
      forename: 'name',
      lastname: 'lastname',
      sex: 'F',
      birthdate: '12-12-2020',
      email: 'example@email.com',
      psw: 'password',
    };

    const response = await request(app).post('/api/user').send(user);
    expect(response.status).toBe(400);
  });

  it('Should return 400 if birthdate is in the future', async () => {
    const user = {
      lastname: 'lastname',
      sex: 'F',
      birthdate: '3000-12-12',
      email: 'example@email.com',
      psw: 'password',
    };

    const response = await request(app).post('/api/user').send(user);
    expect(response.status).toBe(400);
  });

  it('Should return 400 if a user with the provided email is already registered', async () => {
    const user = {
      forename: 'forename',
      lastname: 'lastname',
      sex: 'F',
      birthdate: '2000-12-12',
      email: 'example@email.com',
      psw: 'password',
    };

    const response = await request(app).post('/api/user').send(user);
    expect(response.status).toBe(400);
  });

  it('Should return 201 if request is sent correctly', async () => {
    const user = {
      forename: 'forename',
      lastname: 'lastname',
      sex: 'F',
      birthdate: '2000-12-12',
      email: generateRandomEmail(),
      psw: 'password',
    };
    const response = await request(app).post('/api/user').send(user);
    expect(response.status).toBe(201);
  });
});
