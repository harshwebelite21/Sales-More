import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { Request } from 'express';

type RequestWithUser = Request & { userId: string };

export const GetUserId = createParamDecorator(
  (data, executionContext: ExecutionContext) => {
    const context = executionContext.switchToHttp();
    const request: RequestWithUser = context.getRequest<RequestWithUser>();
    return request.userId;
  },
);
