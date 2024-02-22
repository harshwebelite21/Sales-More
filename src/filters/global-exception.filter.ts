import { ExceptionFilter, Catch, ArgumentsHost } from '@nestjs/common';
import { Response } from 'express';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: Error, host: ArgumentsHost): void {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = 500;
    const message = exception.message || 'Internal Server Error';
    console.log('🚀 ~ GlobalExceptionFilter ~ error:', exception);

    response.status(status).json({
      statusCode: status,
      message,
      error: exception,
    });
  }
}
