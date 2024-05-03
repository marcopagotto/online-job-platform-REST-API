import crypto from 'crypto';
import config from '../config/config';

export const random = () => crypto.randomBytes(128).toString('base64');

export const authentication = (salt: string, password: string) => {
  return crypto
    .createHmac(config.crypto.hashingAlgorithm, [salt, password].join('/'))
    .update(config.crypto.secretKey)
    .digest('hex');
};
