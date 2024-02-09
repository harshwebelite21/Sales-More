import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable, map } from 'rxjs';

@Injectable()
export class UserInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const request = context.switchToHttp().getRequest();

    // Update the request body
    if (request.body) {
      const { name, password, age, birthdate } = request.body;
      request.body = { name, password, age, birthdate };
    }

    return next.handle().pipe(
      map(() => {
        return `${request.body.name} User Data Updated Successfully`;
      }),
    );
  }
}

export class UserSignupInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<unknown> {
    const request = context.switchToHttp().getRequest();

    // Update the request body
    if (request.body) {
      const { name, email, password, age, birthdate } = request.body;
      request.body = { name, email, password, age, birthdate };
    }

    return next.handle().pipe(
      map(() => {
        return `${request.body.name} User Data Added Successfully`;
      }),
    );
  }
}
