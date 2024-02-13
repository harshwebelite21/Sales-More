import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { appConfig } from 'config/appConfig';

@Module({
  imports: [
    MongooseModule.forRootAsync({
      inject: [], // Inject the ConfigService to access configuration settings
      useFactory: async () => ({
        uri: appConfig.mongodbConnectionString, // Use the actual key from your .env file to get the MongoDB URI
      }),
    }),
  ],
  exports: [MongooseModule], // Export the MongooseModule to make it available for other modules
})
export class DatabaseModule {}
