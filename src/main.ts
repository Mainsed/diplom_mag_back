import { NestFactory } from '@nestjs/core';
import { AppModule } from 'src/modules/app/app.module';
import * as cookieParser from 'cookie-parser';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get<ConfigService>(ConfigService);

  app.use(cookieParser(configService.getOrThrow('module.app.cookieSecret')));

  app.useGlobalPipes(
    new ValidationPipe({
      disableErrorMessages: false,
      dismissDefaultMessages: false,
    }),
  );

  await app.listen(3001);
}
bootstrap();
