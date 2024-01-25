// database.module.ts

import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

@Module({
  imports: [
    MongooseModule.forRoot(
      'mongodb+srv://harsh:harsh@demoproject.eij1cj6.mongodb.net/',
    ),
  ],
  exports: [MongooseModule],
})
export class DatabaseModule {}
