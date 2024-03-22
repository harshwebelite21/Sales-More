import { config } from 'dotenv';
config();

export const appConfig = {
  mongodbConnectionString: process.env.DATABASE_URL,
  port: process.env.PORT || 3000,
  jwtKey: process.env.SECRETKEY,
  imageServerUrl: process.env.SERVER_URL,
  key_id: process.env.RAZORPAY_API_KEY,
  key_secret: process.env.RAZORPAY_API_SECRET,
};
