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
      request.body = {
        name: request.body.name,
        password: request.body.password,
        age: request.body.age,
        birthdate: request.body.birthdate,
      };
    }

    return next.handle().pipe(
      map(() => {
        return `${request.body.name} User Data Updated Successfully`;
      }),
    );
  }
}