import { Controller, Post, Body, Res, Req, UseGuards } from '@nestjs/common';
import { TokenService } from './token.service';
import { CreateTokenDto } from './dto/create-token.dto';
import { Response, Request } from 'express';
import { TokenGuard } from './token.guard';

@Controller('token')
export class TokenController {
  constructor(private readonly tokenService: TokenService) {}
  @Post('login')
  login(
    @Body() createTokenDto: CreateTokenDto,
    @Res({ passthrough: true }) response: Response,
  ) {
    return this.tokenService.login(createTokenDto, response);
  }
  @UseGuards(TokenGuard)
  @Post('refresh')
  update(
    @Res({ passthrough: true }) response: Response,
    @Req() request: Request,
  ) {
    return this.tokenService.update(response, request);
  }
  @UseGuards(TokenGuard)
  @Post('logout')
  logout(@Res({ passthrough: true }) response: Response) {
    return this.tokenService.logout(response);
  }
}
