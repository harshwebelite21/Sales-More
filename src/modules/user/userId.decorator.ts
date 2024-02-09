import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { Request } from 'express';

type RequestWithUser = Request & { userId: string; role: number };

export const GetUserId = createParamDecorator(
  (data, executionContext: ExecutionContext) => {
    const context = executionContext.switchToHttp();
    const request: RequestWithUser = context.getRequest<RequestWithUser>();
    const { userId, role } = request;

    if (!userId && !role) {
      throw Error('User Id Not Found In UserId Decoder');
    }
    return { userId, role };
  },
);
