import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

@Module({
  // Make the configuration module global for the entire application
  imports: [ConfigModule.forRoot({ isGlobal: true })],
})
export class AppConfigModule {}
