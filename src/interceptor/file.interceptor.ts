// pdf-file.interceptor.ts
import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
  BadRequestException,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { lookup } from 'mime-types';

@Injectable()
export class AvatarValidationInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<void> {
    const request = context.switchToHttp().getRequest();
    const file = request.file;

    if (!file) {
      throw new BadRequestException('No file uploaded');
    }

    const mimeType = lookup(file.originalname);

    const allowedMimeTypes = [
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/svg+xml',
      'image/webp',
      'image/heic',
    ];

    if (!allowedMimeTypes.includes(mimeType)) {
      throw new BadRequestException(
        'File must be a JPEG, PNG, GIF, SVG, WEBP, HEIC image',
      );
    }

    if (file.size > 1 * 1024 * 1024) {
      // 1 MB limit
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
      const mimeType = lookup(file.originalname);

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
