import { Injectable, CanActivate, ExecutionContext, HttpException, HttpStatus } from '@nestjs/common';
import { Observable } from 'rxjs';
import * as jwt from 'jsonwebtoken';
import { Request } from 'express';

@Injectable()
export class TokenGuard implements CanActivate {
  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const refreshToken = request.cookies['refreshToken'];
    try {
      if (!refreshToken) {
        throw new HttpException('Token not valid', HttpStatus.UNAUTHORIZED);
      }
      const { data } = jwt.verify(refreshToken, process.env.REFRESH_TOKEN)
      context.switchToHttp().getRequest<Request>().body.data = data;
      return true;
    } catch {
      throw new HttpException('Token not valid', HttpStatus.UNAUTHORIZED);
    }
  }
}
