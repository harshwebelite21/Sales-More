import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { AppConfigModule } from 'src/config/appConfig.module';

@Module({
  imports: [
    AppConfigModule, // Import the AppConfigModule to access configuration settings
    MongooseModule.forRootAsync({
      inject: [ConfigService], // Inject the ConfigService to access configuration settings
      useFactory: async (configService: ConfigService) => ({
        uri: configService.get<string>('DATABASE_URL'), // Use the actual key from your .env file to get the MongoDB URI
      }),
    }),
  ],
  exports: [MongooseModule], // Export the MongooseModule to make it available for other modules
})
export class DatabaseModule {}
