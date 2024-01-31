import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { appConfig } from './config/appConfig';
import { GlobalExceptionFilter } from './filters/global-exception.filter';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);
  // Use the global exception filter
  app.useGlobalFilters(new GlobalExceptionFilter());

  await app.listen(appConfig.port);
}
bootstrap().catch((error) => {
  console.log('Error in Server Creation :- ', error);
});
