import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CreateTokenDto } from './dto/create-token.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { Token } from './entities/token.entity';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { Request, Response } from 'express';

@Injectable()
export class TokenService {
  constructor(
    @InjectRepository(Token)
    private readonly tokenRepository: Repository<Token>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}
  private async tokenHandler(findUser: User, response: Response) {
    const refreshTokenTime = Math.floor(Date.now() + 86400000 * 7);
    const access: string = await jwt.sign(
      {
        data: {
          login: findUser.login,
          id: findUser.id,
        },
      },
      process.env.ACCESS_TOKEN,
      {
        expiresIn: '15m',
      },
    );
    const refresh: string = await jwt.sign(
      {
        data: {
          login: findUser.login,
          id: findUser.id,
        },
      },
      process.env.REFRESH_TOKEN,
      {
        expiresIn: '7d',
      },
    );
    await response.cookie('refreshToken', refresh, {
      expires: new Date(refreshTokenTime),
      sameSite: 'none',
      httpOnly: true,
      secure: true,
      path: '/',
    });
    return {
      refresh,
      access,
    };
  }
  async login(createTokenDto: CreateTokenDto, response: Response) {
    if (!createTokenDto.login || !createTokenDto.password) {
      throw new HttpException(
        '422 Unprocessable entity',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
    const findUser = await this.userRepository.findOneBy({
      login: createTokenDto.login,
    });
    if (!findUser) {
      throw new HttpException(
        '422 Unprocessable entity',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
    const result = await bcrypt.compare(
      createTokenDto.password,
      findUser.password,
    );
    if (!result) {
      throw new HttpException(
        '422 Unprocessable entity',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
    const { refresh, access } = await this.tokenHandler(findUser, response);
    const tokenSave = await this.tokenRepository.create({
      refresh,
      user: findUser,
    });
    await this.tokenRepository.save(tokenSave);
    return { access };
  }
  async update(response: Response, request: Request) {
    const findUser = await this.userRepository.findOneBy({
      id: request.body.data.id,
    });
    if (!findUser) {
      throw new HttpException('Token not valid', HttpStatus.UNAUTHORIZED);
    }
    const { refresh, access } = await this.tokenHandler(findUser, response);
    const tokenSave = await this.tokenRepository.create({
      refresh,
      user: findUser,
    });
    await this.tokenRepository.save(tokenSave);
    return { access };
  }
  async logout(response: Response) {
    await response.clearCookie('refreshToken', {
      path: '/',
      sameSite: 'none',
      secure: true,
    });
    response.status(204);
    return;
  }
}
