import { NestFactory } from '@nestjs/core';
import { AppModule } from 'src/modules/app/app.module';
import * as cookieParser from 'cookie-parser';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { RequestLoggerInterceptor } from 'src/shared/interceptors/request-logger.interceptor';
import { HttpExceptionsFilter } from 'src/shared/filters/http-exceptions.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  const configService = app.get<ConfigService>(ConfigService);

  app.use(cookieParser(configService.getOrThrow('module.app.cookieSecret')));

  app.useGlobalInterceptors(new RequestLoggerInterceptor());

  app.enableCors({
    origin: true,
    credentials: true,
  });

  app.useGlobalFilters(new HttpExceptionsFilter());

  app.useGlobalPipes(
    new ValidationPipe({
      disableErrorMessages: false,
      dismissDefaultMessages: false,
      transform: true,
    }),
  );

  await app.listen(3001);
}
bootstrap();
