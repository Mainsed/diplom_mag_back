import { Logger } from '@nestjs/common';
import { registerAs } from '@nestjs/config';
import * as Joi from 'joi';
import * as path from 'path';

export const cfgRaw = {
  addressMinLength: 2,
  addressMaxLength: 80,
} as const;

Logger.verbose('Validating ' + path.basename(__filename));
Joi.attempt(
  cfgRaw,
  Joi.object({
    addressMinLength: Joi.number().required(),
    addressMaxLength: Joi.number().required(),
  }).required(),
);

export const config = registerAs('module.store', () => cfgRaw);
