import express from 'express';

import bodyParser from 'body-parser';
import compression from 'compression';
import apicache from 'apicache';
import cookieParser from 'cookie-parser';

import 'express-async-errors';

import { errorHandler } from './utils/errors';

const app = express();

app.use(bodyParser.json());
app.use(compression());
app.use(cookieParser());
app.use(apicache.middleware('5 minutes'));
app.use(errorHandler);

export { app };
