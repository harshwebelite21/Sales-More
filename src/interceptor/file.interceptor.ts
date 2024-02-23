// pdf-file.interceptor.ts
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  BadRequestException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import * as mimeTypes from 'mime-types';

@Injectable()
export class AvatarValidationInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<void> {
    const request = context.switchToHttp().getRequest();
    const file = request.file;

    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    const mimeType = mimeTypes.lookup(file.originalname);

    if (!['image/jpeg', 'image/png'].includes(mimeType)) {
      throw new BadRequestException('File must be a JPG or PNG image');
    }

    if (file.size > 2 * 1024 * 1024) {
      // 2 MB limit
      throw new BadRequestException('File size must be less than 2MB');
    }

    return next.handle();
  }
}

export class MultipleFileValidator implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<void> {
    const request = context.switchToHttp().getRequest();
    const files = request.files;
    if (!files) {
      throw new BadRequestException('No file uploaded');
    }
    files.forEach((file) => {
      const mimeType = mimeTypes.lookup(file.originalname);

      if (mimeType !== 'application/pdf') {
        throw new BadRequestException('File must be a PDF');
      }

      if (file.size > 2 * 1024 * 1024) {
        // 2 MB limit
        throw new BadRequestException('File size must be less than 2MB');
      }
    });

    return next.handle();
  }
}
