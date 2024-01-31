import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { appConfig } from './config/appConfig';
import { GlobalExceptionFilter } from './filters/global-exception.filter';
async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
  // Use the global exception filter
  app.useGlobalFilters(new GlobalExceptionFilter());

  await app.listen(appConfig.port);
}
bootstrap().catch(() => {
  console.log('Error in Server Creation');
});
