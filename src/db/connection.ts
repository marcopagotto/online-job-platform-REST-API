import mysql from 'mysql2';
import config from '../config/config';

export const pool = mysql
  .createPool({
    host: config.mysql.host,
    user: config.mysql.user,
    password: config.mysql.password,
    database: config.mysql.databaseName,
  })
  .promise();

export const checkPoolConnection = async () =>
  await pool
    .getConnection()
    .then((connection) => {
      console.log('Connection acquired from the pool');
      connection.release();
    })
    .catch((err) => {
      console.error(
        'Error while acquiring connection from the pool:',
        err.code
      );
      throw new Error(err.code);
    });

