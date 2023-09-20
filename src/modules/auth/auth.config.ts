import { Logger } from '@nestjs/common';
import { registerAs } from '@nestjs/config';
import * as Joi from 'joi';
import * as path from 'path';

export const cfgRaw = {} as const;

Logger.verbose('Validating ' + path.basename(__filename));
Joi.attempt(cfgRaw, Joi.object({}).required());

export const config = registerAs('module.auth', () => cfgRaw);
