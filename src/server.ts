import config from './config/config';
import { app } from './app';
import { checkPoolConnection } from './db/connection';

checkPoolConnection();

app.listen(config.server.port, () =>
  console.log(`Server listening on port ${config.server.port}...`)
);
