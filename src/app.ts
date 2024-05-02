import express from 'express';

import bodyParser from 'body-parser';
import compression from 'compression';
import apicache from 'apicache';
import cookieParser from 'cookie-parser';

const app = express();

app.use(bodyParser.json());
app.use(compression());
app.use(cookieParser());
app.use(apicache.middleware('5 minutes'));

export { app };
