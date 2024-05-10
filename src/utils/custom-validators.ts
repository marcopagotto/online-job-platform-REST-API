import { body } from 'express-validator';
import { getUserByEmail } from '../models/users';

const bodyDateValidator = (date: string, isBirthday = false) => {
  return body(date)
    .trim()
    .custom((value) => {
      const dateRegex =
        /^(?:19\d{2}|20[01]\d|202[01])-(?:0[1-9]|1[0-2])-(?:0[1-9]|[12][0-9]|3[01])$/;

      if (!dateRegex.test(value)) {
        throw new Error(
          `Invalid ${date} format. ${date} must be in YYYY-MM-DD format with a valid date range.`
        );
      }

      if (isBirthday) {
        const birthdayDate = new Date(value);
        const currentDate = new Date();

        if (birthdayDate >= currentDate) {
          throw new Error(`${date} cannot be in the future.`);
        }
      }

      return true;
    });
};

const bodySexValidator = (sex: string) => {
  return body(sex)
    .trim()
    .custom((value) => {
      if (value.length !== 1) {
        throw new Error('Field must be exactly 1 character long.');
      }

      const allowedValues = ['M', 'F', 'O'];

      if (!allowedValues.includes(value)) {
        throw new Error('Field must be either M, F, or O.');
      }

      return true;
    });
};

const bodyPasswordWhiteSpacesValidator = (psw: string) => {
  return body(psw).custom((value) => {
    if (/\s/.test(value)) {
      throw new Error('Field cannot contain whitespaces.');
    }
    return true;
  });
};

const existingEmailValidator = (email: string) => {
  return body(email)
    .trim()
    .custom(async (value) => {
      const user = await getUserByEmail(value);

      if (user[0]) {
        console.log(user);
        throw new Error('User with email provided already exists.');
      }

      return true;
    });
};

const notExistingEmailValidator = (email: string) => {
  return body(email)
    .trim()
    .custom(async (value) => {
      const user = await getUserByEmail(value);

      if (!user[0]) {
        console.log(user);
        throw new Error("User with email provided doesn't exists.");
      }

      return true;
    });
};

export {
  bodyDateValidator,
  bodySexValidator,
  bodyPasswordWhiteSpacesValidator,
  existingEmailValidator,
  notExistingEmailValidator
};
