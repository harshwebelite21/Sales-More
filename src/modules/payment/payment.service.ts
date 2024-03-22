import { Model } from 'mongoose';
import { PaymentOrderDto } from 'modules/payment/dto/payment-order.dto';
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { appConfig } from 'config/appConfig';
import { Exception } from 'handlebars';
import { validatePaymentVerification } from 'razorpay/dist/utils/razorpay-utils';
import Razorpay from 'razorpay';
import { Payment } from './payment.model';

const instance = new Razorpay({
  key_id: appConfig.key_id ?? '',
  key_secret: appConfig.key_secret,
});
@Injectable()
export class PaymentService {
  constructor(
    @InjectModel('Payment') private readonly paymentModel: Model<Payment>,
  ) {}
  async processPayment(amount: number): Promise<PaymentOrderDto> {
    const options = {
      amount: Number(amount * 100),
      currency: 'INR',
    };

    const order = await instance.orders.create(options);

    return order;
  }

  async paymentVerification(
    razorpay_signature: string,
    razorpay_order_id: string,
    razorpay_payment_id: string,
  ): Promise<void> {
    if (!appConfig.key_secret) {
      throw new Exception('Razor Pay Secret key Not found');
    }
    await validatePaymentVerification(
      { order_id: razorpay_order_id, payment_id: razorpay_payment_id },
      razorpay_signature,
      appConfig.key_secret,
    );
    await this.paymentModel.create({
      razorpay_signature,
      razorpay_order_id,
      razorpay_payment_id,
    });
  }
}
