import { app } from '../app';
import request from 'supertest';
import { generateRandomEmail } from '../utils/utils';
import {
  deleteUserByEmail,
  getUserByEmail,
  getUserBySessionToken,
} from '../models/users';

describe('POST new user', () => {
  it('Should return 400 if all fields are missing', async () => {
    const userBody = {};

    const response = await request(app).post('/api/user').send(userBody);

    expect(response.status).toBe(400);
  });

  it('Should return 400 if any field is missing', async () => {
    const userBody = {
      lastname: 'lastname',
      sex: 'F',
      birthdate: '2000-12-12',
      email: 'example@email.com',
      psw: 'password',
    };

    const response = await request(app).post('/api/user').send(userBody);

    expect(response.status).toBe(400);
  });

  it('Should return 400 if birthdate field is not provided in the right format', async () => {
    const userBody = {
      forename: 'name',
      lastname: 'lastname',
      sex: 'F',
      birthdate: '12-12-2020',
      email: 'example@email.com',
      psw: 'password',
    };

    const response = await request(app).post('/api/user').send(userBody);

    expect(response.status).toBe(400);
  });

  it('Should return 400 if birthdate is in the future', async () => {
    const userBody = {
      lastname: 'lastname',
      sex: 'F',
      birthdate: '3000-12-12',
      email: 'example@email.com',
      psw: 'password',
    };

    const response = await request(app).post('/api/user').send(userBody);

    expect(response.status).toBe(400);
  });

  it('Should return 400 if a user with the provided email is already registered', async () => {
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

    const response = await request(app).post('/api/user').send(userBody);

    expect(response.status).toBe(400);

    await deleteUserByEmail(email);
  });

  it('Should return 201 if request is sent correctly', async () => {
    const email = generateRandomEmail();

    const userBody = {
      forename: 'forename',
      lastname: 'lastname',
      sex: 'F',
      birthdate: '2000-12-12',
      email: email,
      psw: 'password',
    };

    const response = await request(app).post('/api/user').send(userBody);

    expect(response.status).toBe(201);

    await deleteUserByEmail(email);
  });
});

describe('POST user authentication', () => {
  it('Should return 400 if any field is missing', async () => {
    const userBody = {};

    const response = await request(app).post('/api/user/login').send(userBody);

    expect(response.status).toBe(400);
  });

  it('Should return 400 if no user with email provided is registered', async () => {
    const userBody = {
      email: generateRandomEmail(),
      password: 'password',
    };

    const response = await request(app).post('/api/user/login').send(userBody);

    expect(response.status).toBe(400);
  });

  it('Should return 403 if password is incorrect', async () => {
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

    const wrongAuthUserBody = {
      email: email,
      psw: 'wrong_password',
    };

    const response = await request(app)
      .post('/api/user/login')
      .send(wrongAuthUserBody);

    expect(response.status).toBe(403);

    await deleteUserByEmail(email);
  });

  it('Should return 200 if request is sent correctly', async () => {
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

    const response = await request(app)
      .post('/api/user/login')
      .send(authUserBody);

    expect(response.status).toBe(200);

    await deleteUserByEmail(email);
  });

  it("Should update user's previous session_token", async () => {
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

    const previousSessionToken = (
      await request(app).post('/api/user/login').send(authUserBody)
    ).body[0].session_token;

    const currentSessionToken = (
      await request(app).post('/api/user/login').send(authUserBody)
    ).body[0].session_token;

    expect(previousSessionToken !== currentSessionToken);

    await deleteUserByEmail(email);
  });

  it('User should be retrievable via session_token', async () => {
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

    const sessionToken = (
      await request(app).post('/api/user/login').send(authUserBody)
    ).body[0].session_token;

    const retrievedUser = await getUserBySessionToken(sessionToken);

    expect(retrievedUser[0].email === userBody.email);

    await deleteUserByEmail(email);
  });

  it('Should attach an AUTH-LOGIN cookie to user', async () => {
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

    const response = await request(app)
      .post('/api/user/login')
      .send(authUserBody);

    expect(response.header['set-cookie'][0].startsWith('AUTH-LOGIN'));

    await deleteUserByEmail(email);
  });
});

describe("PATCH user's password", () => {
  it("Should return 401 if user isn't authenticated", async () => {
    const response = await request(app).patch('/api/user/update-password');

    expect(response.status).toBe(401);
  });

  it('Should return 400 if user is authenticated but either oldPsw, newPsw or both are missing', async () => {
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

    const changePassword = {};

    const response = await request(app)
      .patch('/api/user/update-password')
      .set('Cookie', cookie)
      .send(changePassword);

    expect(response.status).toBe(400);

    await deleteUserByEmail(email);
  });

  it('Should return 403 if old password is wrong', async () => {
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

    const changePasswordBody = {
      oldPsw: 'wrong_password',
      newPsw: 'new_password',
    };

    const response = await request(app)
      .patch('/api/user/update-password')
      .set('Cookie', cookie)
      .send(changePasswordBody);

    expect(response.status).toBe(403);

    await deleteUserByEmail(email);
  });

  it('Should return 200 if password was updated correctly', async () => {
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

    const changePasswordBody = {
      oldPsw: 'password',
      newPsw: 'new_password',
    };

    const response = await request(app)
      .patch('/api/user/update-password')
      .set('Cookie', cookie)
      .send(changePasswordBody);

    expect(response.status).toBe(200);

    await deleteUserByEmail(email);
  });
});

describe('DELETE user', () => {
  it("Should return 401 if user isn't authenticated", async () => {
    const response = await request(app).delete('/api/user');

    expect(response.status).toBe(401);
  });

  it('Should return 202 if user was deleted correctly', async () => {
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
      .delete('/api/user')
      .set('Cookie', cookie);

    expect(response.status).toBe(202);
  });

  it('Should clear previous AUTH-LOGIN cookie', async () => {
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
      .delete('/api/user')
      .set('Cookie', cookie);

    const authLoginCookieCleared = response.header['set-cookie'][0];

    expect(authLoginCookieCleared.startsWith('AUTH-LOGIN=;')).toBe(true);
  });
});

describe('GET user by id', () => {
  it("Should return 401 if user isn't logged in", async () => {
    const response = await request(app).get('/api/user/1');

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
      .get('/api/user/NaN')
      .set('Cookie', cookie);

    expect(response.status).toBe(400);

    await deleteUserByEmail(email);
  });

  it("Should return 404 if user is logged in but a user with the provided id doesn't exist", async () => {
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
      .get('/api/user/999999')
      .set('Cookie', cookie);

    expect(response.status).toBe(404);

    await deleteUserByEmail(email);
  });

  it('Should return 200 if user is logged in and a user with the provided id exists', async () => {
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

    const id = loginResponse.body[0].user_id;
    const cookie = loginResponse.header['set-cookie'][0];

    const response = await request(app)
      .get(`/api/user/${id}`)
      .set('Cookie', cookie);

    expect(response.status).toBe(200);

    await deleteUserByEmail(email);
  });
});

describe('PATCH user', () => {
  it("Should return 401 if user isn't logged in", async () => {
    const response = await request(app).patch('/api/user');

    expect(response.status).toBe(401);
  });

  it('Should return 400 if user is authenticated but is providing a body violating the schema', async () => {
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

    const invalidUpdateUserBody = {
      forename: '',
      lastname: '',
      sex: 'L',
      birthdate: '20-12-12',
    };

    const respone = await request(app)
      .patch('/api/user')
      .set('Cookie', cookie)
      .send(invalidUpdateUserBody);

    expect(respone.status).toBe(400);

    await deleteUserByEmail(email);
  });

  it('Should return 200 if user is authenticated and is providing a valid body', async () => {
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

    const validUpdateUserBody = {
      forename: 'new_forename',
      lastname: 'new_lastname',
    };

    const respone = await request(app)
      .patch('/api/user')
      .set('Cookie', cookie)
      .send(validUpdateUserBody);

    expect(respone.status).toBe(200);

    await deleteUserByEmail(email);
  });
});
