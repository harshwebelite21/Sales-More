import { ExecutionContext, createParamDecorator } from '@nestjs/common';
import { Request } from 'express';
import { Types } from 'mongoose';
import { RoleEnum } from './user.model';

type RequestWithUser = Request & { userId: Types.ObjectId; role: RoleEnum };

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
