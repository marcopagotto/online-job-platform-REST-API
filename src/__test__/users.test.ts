import { app } from '../app';
import request from 'supertest';
import { generateRandomEmail } from '../utils/utils';
import { getUserByEmail, getUserBySessionToken } from '../models/users';

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

describe('POST user authentication', () => {
  it('Should return 400 if any field is missing', async () => {
    const user = {
      email: 'example@email.com',
    };
    const response = await request(app).post('/api/user/login').send(user);
    expect(response.status).toBe(400);
  });

  it('Should return 400 if no user with email provided is registered', async () => {
    const user = {
      email: 'example@email.com',
      password: 'password',
    };
    const response = await request(app).post('/api/user/login').send(user);
    expect(response.status).toBe(400);
  });

  it('Should return 403 if password is incorrect', async () => {
    const user = {
      email: 'example@email.com',
      psw: 'wrong_password',
    };
    const response = await request(app).post('/api/user/login').send(user);
    expect(response.status).toBe(403);
  });

  it('Should return 200 if request is sent correctly', async () => {
    const user = {
      email: 'example@email.com',
      psw: 'password',
    };
    const response = await request(app).post('/api/user/login').send(user);
    expect(response.status).toBe(200);
  });

  it("Should update user's previous session_token", async () => {
    const userEmail = 'example@email.com';

    const previousUser = await getUserByEmail(userEmail);
    const previousSessionToken = previousUser[0].session_token;

    const userAuthentication = {
      email: 'example@email.com',
      psw: 'password',
    };

    await request(app).post('/api/user/login').send(userAuthentication);

    const currentUser = await getUserByEmail(userEmail);
    const currentSessionToken = currentUser[0].session_token;

    expect(previousSessionToken !== currentSessionToken);
  });

  it('User should be retrievable via session_token', async () => {
    const userAuthentication = {
      email: 'example@email.com',
      psw: 'password',
    };

    const response = await request(app)
      .post('/api/user/login')
      .send(userAuthentication);

    const sessionToken = response.body[0].session_token;

    const user = await getUserBySessionToken(sessionToken);

    expect(user[0].email === userAuthentication.email);
  });

  it('Should attach an AUTH-LOGIN cookie to user', async () => {
    const userAuthentication = {
      email: 'example@email.com',
      psw: 'password',
    };

    const response = await request(app)
      .post('/api/user/login')
      .send(userAuthentication);

    expect(response.header['set-cookie'][0].startsWith('AUTH-LOGIN'));
  });
});

describe("PUT user's password", () => {
  it("Should return 401 if user isn't authenticated", async () => {
    const response = await request(app).put('/api/user/update-password');
    expect(response.status).toBe(401);
  });

  it('Should return 400 if user is authenticated but either oldPsw, newPsw or both are missing', async () => {
    const user = {
      email: 'example@email.com',
      psw: 'password',
    };

    const loginResponse = await request(app).post('/api/user/login').send(user);

    const cookie = loginResponse.header['set-cookie'][0];

    const changePassword = {};

    const response = await request(app)
      .put('/api/user/update-password')
      .set('Cookie', cookie)
      .send(changePassword);

    expect(response.status).toBe(400);
  });

  it('Should return 403 if old password is wrong', async () => {
    const user = {
      email: 'example@email.com',
      psw: 'password',
    };

    const loginResponse = await request(app).post('/api/user/login').send(user);

    const cookie = loginResponse.header['set-cookie'][0];

    const changePassword = {
      oldPsw: 'wrong_password',
      newPsw: 'new_password',
    };

    const response = await request(app)
      .put('/api/user/update-password')
      .set('Cookie', cookie)
      .send(changePassword);

    expect(response.status).toBe(403);
  });

  it('Should return 200 if password was updated correctly', async () => {
    const user = {
      email: 'example@email.com',
      psw: 'password',
    };

    const loginResponse = await request(app).post('/api/user/login').send(user);

    const cookie = loginResponse.header['set-cookie'][0];

    const changePassword = {
      oldPsw: 'password',
      newPsw: 'new_password',
    };

    const response = await request(app)
      .put('/api/user/update-password')
      .set('Cookie', cookie)
      .send(changePassword);

    expect(response.status).toBe(200);

    const resetPassword = {
      oldPsw: 'new_password',
      newPsw: 'password',
    };

    await request(app)
      .put('/api/user/update-password')
      .set('Cookie', cookie)
      .send(resetPassword);
  });
});

describe('DELETE user', () => {
  it("Should return 401 if user isn't authenticated", async () => {
    const response = await request(app).delete('/api/user');
    expect(response.status).toBe(401);
  });

  it('Should return 202 if user was deleted correctly', async () => {
    const email = generateRandomEmail();

    const userRegistration = {
      forename: 'forename',
      lastname: 'lastname',
      sex: 'F',
      birthdate: '2000-12-12',
      email: email,
      psw: 'password',
    };

    await request(app).post('/api/user').send(userRegistration);

    const userLogin = {
      email: email,
      psw: 'password',
    };

    const loginResponse = await request(app)
      .post('/api/user/login')
      .send(userLogin);

    const cookie = loginResponse.header['set-cookie'][0];

    const response = await request(app)
      .delete('/api/user')
      .set('Cookie', cookie);

    expect(response.status).toBe(202);
  });

  it('Should clear previous AUTH-LOGIN cookie', async () => {
    const email = generateRandomEmail();

    const userRegistration = {
      forename: 'forename',
      lastname: 'lastname',
      sex: 'F',
      birthdate: '2000-12-12',
      email: email,
      psw: 'password',
    };

    await request(app).post('/api/user').send(userRegistration);

    const userLogin = {
      email: email,
      psw: 'password',
    };

    const loginResponse = await request(app)
      .post('/api/user/login')
      .send(userLogin);

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
    const response = await request(app).get('/api/user/106');
    expect(response.status).toBe(401);
  });

  it("Should return 404 if user is logged in but a user with the provided id doesn't exist", async () => {
    const userLogin = {
      email: 'example@email.com',
      psw: 'password',
    };
    const loginResponse = await request(app)
      .post('/api/user/login')
      .send(userLogin);

    const cookie = loginResponse.header['set-cookie'][0];

    const response = await request(app)
      .get('/api/user/1')
      .set('Cookie', cookie);

    expect(response.status).toBe(404);
  });

  it('Should return 200 if user is logged in and a user with the provided id exists', async () => {
    const userLogin = {
      email: 'example@email.com',
      psw: 'password',
    };
    const loginResponse = await request(app)
      .post('/api/user/login')
      .send(userLogin);

    const cookie = loginResponse.header['set-cookie'][0];

    const response = await request(app)
      .get('/api/user/106')
      .set('Cookie', cookie);

    expect(response.status).toBe(200);
  });
});
