import * as dotenv from 'dotenv';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
async function bootstrap(): Promise<void> {
  dotenv.config(); // Load environment variables from .env file
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
}
bootstrap().catch(() => {
  console.log('Error in Server Creation');
});
