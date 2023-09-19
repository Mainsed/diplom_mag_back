import { registerAs } from '@nestjs/config';
import { Logger } from '@nestjs/common';
import * as path from 'path';
import * as Joi from 'joi';
import 'dotenv/config';

const cfgRaw = {
  url: process.env.MONGO_URL,
  dbName: process.env.MONGO_DB_NAME,
  connectTimeoutMS: parseInt(process.env.MONGO_CONNECT_TIMEOUT_MS || ''),
} as const;

Logger.verbose('Validating ' + path.basename(__filename));
Joi.attempt(
  cfgRaw,
  Joi.object({
    url: Joi.string().required(),
    dbName: Joi.string().required(),
    connectTimeoutMS: Joi.number()
      .integer()
      .min(1000)
      .required()
      .label('process.env.MONGO_CONNECT_TIMEOUT_MS'),
  }).required(),
);

export const config = registerAs('module.mongodb', () => cfgRaw);
