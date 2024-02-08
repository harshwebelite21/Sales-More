import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';
import { appConfig } from './config/appConfig';
import { GlobalExceptionFilter } from './filters/global-exception.filter';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);
  // Use the global exception filter
  app.useGlobalFilters(new GlobalExceptionFilter());
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Strips away any properties that do not have any decorators
      transform: true, // Automatically transforms payload to the DTO class instance
      forbidNonWhitelisted: true, // Throws an error if payload contains properties that are not defined in DTO class
      skipMissingProperties: false, // Throws an error if a DTO property is missing in the payload
    }),
  );
  await app.listen(appConfig.port);
}
bootstrap().catch((error) => {
  console.log('Error in Server Creation :- ', error);
});
