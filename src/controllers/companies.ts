import { Request, Response } from 'express';
import { validationResult, matchedData } from 'express-validator';
import {
  registerCompany as newCompany,
  getCompanyByCompanyName,
} from '../models/companies';

export const registerCompany = async (req: Request, res: Response) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json(errors);
  }

  const data = matchedData(req);

  await newCompany(data.company_name, req.identity![0].user_id);

  const company = await getCompanyByCompanyName(data.company_name);

  return res.status(201).json(company[0]);
};
