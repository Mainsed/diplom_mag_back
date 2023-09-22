import { Logger } from '@nestjs/common';
import { registerAs } from '@nestjs/config';
import * as Joi from 'joi';
import * as path from 'path';

export const cfgRaw = {
  nameMinLength: 2,
  emailMinLength: 2,
  phoneNumberMinLength: 2,
  nameMaxLength: 80,
  emailMaxLength: 80,
  phoneNumberMaxLength: 80,
} as const;

Logger.verbose('Validating ' + path.basename(__filename));
Joi.attempt(
  cfgRaw,
  Joi.object({
    nameMinLength: Joi.number().required(),
    emailMinLength: Joi.number().required(),
    phoneNumberMinLength: Joi.number().required(),
    nameMaxLength: Joi.number().required(),
    emailMaxLength: Joi.number().required(),
    phoneNumberMaxLength: Joi.number().required(),
  }).required(),
);

export const config = registerAs('module.client', () => cfgRaw);
