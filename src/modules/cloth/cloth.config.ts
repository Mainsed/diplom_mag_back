import { Logger } from '@nestjs/common';
import { registerAs } from '@nestjs/config';
import * as Joi from 'joi';
import * as path from 'path';

export const cfgRaw = {
  nameMinLength: 2,
  nameMaxLength: 80,
  descMinLength: 2,
  descMaxLength: 80,
} as const;

Logger.verbose('Validating ' + path.basename(__filename));
Joi.attempt(
  cfgRaw,
  Joi.object({
    nameMinLength: Joi.number().required(),
    nameMaxLength: Joi.number().required(),
    descMinLength: Joi.number().required(),
    descMaxLength: Joi.number().required(),
  }).required(),
);

export const config = registerAs('module.client', () => cfgRaw);
