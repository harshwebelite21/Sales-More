import { Body, Controller, Post, Req, Res } from '@nestjs/common';
import { Request, Response } from 'express';
import { SuccessMessageDTO, UserIdRole } from 'interfaces';
import { PaymentService } from './payment.service';
import { GetUserId } from '../user/userId.decorator';

@Controller('payment')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}
  @Post('paymentVerification')
  async paymentVerification(
    @GetUserId() userData: UserIdRole,
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<SuccessMessageDTO> {
    try {
      const { razorpay_signature, razorpay_order_id, razorpay_payment_id } =
        req.body;
      await this.paymentService.paymentVerification(
        razorpay_signature,
        razorpay_order_id,
        razorpay_payment_id,
      );
      res.redirect(
        `http://localhost:3000/payment-success?payment_id=${razorpay_payment_id}`,
      );
      return { success: true, message: 'Order Placed successfully' };
    } catch (error) {
      console.error('Error during Payment Verification:', error);
      throw error;
    }
  }

  @Post('/processPayment')
  async processPayment(
    @Req() req: Request,
    @Res() res: Response,
    @Body() body: { amount: number },
  ): Promise<void> {
    try {
      const { amount } = body;
      const order = await this.paymentService.processPayment(amount);

      res.send({ order });
    } catch (error) {
      console.error('Error during The Payment Process :', error);
      throw error;
    }
  }
}
