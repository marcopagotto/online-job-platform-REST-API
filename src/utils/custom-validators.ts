import { body } from 'express-validator';

const bodyDateValidator = (date: string, isBirthday = false) => {
  return body(date)
    .trim()
    .custom((value) => {
      const dateRegex =
        /^(?:0[1-9]|1[0-2])-(?:0[1-9]|[12][0-9]|3[01])-(?:19\d{2}|20[01]\d|202[01])$/;

      if (!dateRegex.test(value)) {
        throw new Error(
          `Invalid ${date} format. ${date} must be in MM-DD-YYYY format with a valid date range.`
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
    });
};

export { bodyDateValidator, bodySexValidator };
