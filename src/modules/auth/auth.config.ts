import { Logger } from '@nestjs/common';
import { registerAs } from '@nestjs/config';
import * as Joi from 'joi';
import * as path from 'path';

export const cfgRaw = {
  nameMinLength: 2,
  emailMinLength: 2,
  passwordMinLength: 2,
  positionMinLength: 2,
  nameMaxLength: 80,
  emailMaxLength: 80,
  passwordMaxLength: 80,
  positionMaxLength: 80,
} as const;

Logger.verbose('Validating ' + path.basename(__filename));
Joi.attempt(
  cfgRaw,
  Joi.object({
    nameMinLength: Joi.number().required(),
    emailMinLength: Joi.number().required(),
    passwordMinLength: Joi.number().required(),
    positionMinLength: Joi.number().required(),
    nameMaxLength: Joi.number().required(),
    emailMaxLength: Joi.number().required(),
    passwordMaxLength: Joi.number().required(),
    positionMaxLength: Joi.number().required(),
  }).required(),
);

export const config = registerAs('module.auth', () => cfgRaw);
