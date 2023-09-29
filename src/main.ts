import { AppModule } from './modules/app/app.module';
import cookieParser from 'cookie-parser';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { HttpExceptionsFilter } from './shared/filters/http-exceptions.filter';
import { RequestLoggerInterceptor } from './shared/interceptors/request-logger.interceptor';

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
