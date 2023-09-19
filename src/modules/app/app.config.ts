import { Logger } from '@nestjs/common';
import { registerAs } from '@nestjs/config';
import * as Joi from 'joi';
import * as path from 'path';

const cfgRaw = {
  port: parseInt(process.env.PORT),
  jwtSecret: process.env.JWT_SECRET,
  cookieSecret: process.env.COOKIE_SECRET,
} as const;

Logger.verbose('Validating ' + path.basename(__filename));
Joi.attempt(
  cfgRaw,
  Joi.object({
    port: Joi.number().required(),
    jwtSecret: Joi.string().required(),
    cookieSecret: Joi.string().required(),
  }).required(),
);

export const config = registerAs('module.app', () => cfgRaw);
