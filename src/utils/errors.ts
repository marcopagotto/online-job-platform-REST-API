import { Request, Response, NextFunction } from "express";

export class ApiError extends Error {
  statusCode;

  constructor(message: string, status = 500) {
    super(message);
    Error.captureStackTrace(this, this.constructor);
    this.statusCode = status;
  }
}

type CustomError = Error | (new (...args: any[]) => Error);

export const errorHandler = (
  err: CustomError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  console.log(`Error middleware: ${err}`);

  if (err instanceof ApiError) {
    return res.status(err.statusCode).json(err.message);
  }

  return res.status(500).json('Internal server error');
};