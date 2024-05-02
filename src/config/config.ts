import dotenv from 'dotenv';

dotenv.config();

const MYSQL_HOST = process.env.MYSQL_HOST;
const MYSQL_USER = process.env.MYSQL_USER;
const MYSQL_PASSWORD = process.env.MYSQL_PASSWORD;
const MYSQL_DATABASE_NAME = process.env.MYSQL_DATABASE_NAME;

const SERVER_PORT = process.env.SERVER_PORT || '8080';

const HASHING_ALGORITHM = process.env.HASHING_ALOGRITHM || 'sha256';
const SECRET_KEY = process.env.SECRET_KEY || '';

export default {
  mysql: {
    host: MYSQL_HOST,
    user: MYSQL_USER,
    password: MYSQL_PASSWORD,
    databaseName: MYSQL_DATABASE_NAME,
  },
  server: {
    port: SERVER_PORT,
  },
  crypto: {
    hashingAlgorithm: HASHING_ALGORITHM,
    secretKey: SECRET_KEY,
  },
};
