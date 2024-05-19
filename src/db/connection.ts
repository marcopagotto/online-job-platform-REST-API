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

export const initTablesIfNotExisting = async () => {
  try {
    const [tables]: Array<any> = await pool.query('SHOW TABLES');

    const tables_in_db = `Tables_in_${config.mysql.databaseName}`;
    
    const tableNames = tables.map((table: any) => table.tables_in_db);

    if (!tableNames.includes('users')) {
      await pool.query(`
        CREATE TABLE users (
          user_id INT PRIMARY KEY AUTO_INCREMENT,
          forename VARCHAR(50) NOT NULL,
          lastname VARCHAR(50) NOT NULL,
          birthdate DATE NOT NULL,
          sex VARCHAR(1) NOT NULL,
          email VARCHAR(255) NOT NULL,
          psw CHAR(64) NOT NULL,
          salt CHAR(255) NOT NULL,
          session_token CHAR(64)
        )
      `);
    }

    if (!tableNames.includes('company')) {
      await pool.query(`
        CREATE TABLE company (
          company_id INT PRIMARY KEY AUTO_INCREMENT,
          company_name VARCHAR(50) UNIQUE NOT NULL,
          company_owner INT NOT NULL,
          FOREIGN KEY (company_owner) REFERENCES users(user_id) ON DELETE CASCADE
        )
      `);
    }

    if (!tableNames.includes('listing')) {
      await pool.query(`
        CREATE TABLE listing (
          listing_id INT PRIMARY KEY AUTO_INCREMENT,
          employer_id INT NOT NULL,
          job_title VARCHAR(100) NOT NULL,
          description VARCHAR(1000) NOT NULL,
          posted_date TIMESTAMP NOT NULL DEFAULT NOW(),
          annual_salary INT NOT NULL,
          remote VARCHAR(4) NOT NULL,
          FOREIGN KEY (employer_id) REFERENCES company(company_id) ON DELETE CASCADE
        )
      `);
    }

    console.log('Tables have been initialized.');
  } catch (error) {
    console.error('Error creating tables:', error);
  }
};
