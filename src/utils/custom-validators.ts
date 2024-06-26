import { body, param, query } from 'express-validator';
import { getUserByEmail } from '../models/users';
import { getCompanyByCompanyName, getCompanyById } from '../models/companies';
import { ApiError } from './errors';
import { getListingById } from '../models/listings';

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
        throw new Error("User with email provided doesn't exists.");
      }

      return true;
    });
};

const existingCompanyByNameValidator = (company_name: string) => {
  return body(company_name)
    .trim()
    .custom(async (value) => {
      const company = await getCompanyByCompanyName(value);

      if (company[0][0]) {
        throw new ApiError(
          `${value} company is already registered. Please choose a different name and try again.`,
          403
        );
      }

      return true;
    });
};

const existingCompanyByIdParamValidator = (company_id: string) => {
  return param(company_id)
    .isInt()
    .bail()
    .withMessage('Value must be a number')
    .trim()
    .custom(async (value) => {
      const company = await getCompanyById(value);

      if (!company[0][0]) {
        throw new ApiError(
          `Company with id ${value} doesn't exist. Please check your input and try again.`,
          403
        );
      }

      return true;
    });
};

const existingCompanyByIdBodyValidator = (company_id: string) => {
  return body(company_id)
    .isInt()
    .bail()
    .withMessage('Value must be a number')
    .trim()
    .custom(async (value) => {
      const company = await getCompanyById(value);
      if (!company[0][0]) {
        throw new ApiError(
          `Company with id ${value} doesn't exist. Please check your input and try again.`,
          403
        );
      }

      return true;
    });
};

const existingListingByIdParamValidator = (listing_id: string) => {
  return param(listing_id)
    .isInt()
    .bail()
    .withMessage('Value must be a number')
    .trim()
    .custom(async (value) => {
      const listing = await getListingById(value);
      if (!listing[0][0]) {
        throw new ApiError(
          `Listing with id ${value} doesn't exist. Please check your input and try again.`,
          403
        );
      }

      return true;
    });
};

const queryAmountValidator = (amount: string) => {
  return query(amount)
    .optional()
    .trim()
    .notEmpty()
    .bail()
    .withMessage('Field must not be empty.')
    .isInt()
    .bail()
    .withMessage('Value must be a number')
    .custom((value) => {
      if (Number(value) <= 0) {
        throw new ApiError(
          'Value must be <= 0. Please check your input and try again.',
          400
        );
      }

      return true;
    });
};

const queryNewFirstValidator = (newFirst: string) => {
  return query(newFirst)
    .optional()
    .trim()
    .notEmpty()
    .bail()
    .withMessage('Field must not be empty.')
    .bail()
    .custom((value) => {
      if (Number(value) !== 0 && Number(value) !== 1) {
        throw new ApiError(
          'Value must be boolean (1,0). Please check your input and try again.',
          400
        );
      }

      return true;
    });
};

export {
  bodyDateValidator,
  bodySexValidator,
  bodyPasswordWhiteSpacesValidator,
  existingEmailValidator,
  notExistingEmailValidator,
  existingCompanyByNameValidator,
  existingCompanyByIdParamValidator,
  existingCompanyByIdBodyValidator,
  existingListingByIdParamValidator,
  queryAmountValidator,
  queryNewFirstValidator
};
