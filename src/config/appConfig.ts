import { config } from 'dotenv';
config();
export const appConfig = {
  mongodbConnectionString: process.env.DATABASE_URL,
  port: process.env.PORT || 3000,
  jwtKey: process.env.SECRETKEY,
};
