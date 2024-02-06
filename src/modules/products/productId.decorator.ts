import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { Request } from 'express';

type RequestWithUser = Request & { productId: string };

export const GetProductId = createParamDecorator(
  (data, executionContext: ExecutionContext) => {
    const context = executionContext.switchToHttp();
    const request: RequestWithUser = context.getRequest<RequestWithUser>();
    const productId = request.params.productId;
    if (!productId) {
      throw Error('Product Id Not Found In productId Decoder');
    }
    return productId;
  },
);
