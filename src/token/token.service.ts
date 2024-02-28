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
  private async tokenHandler(find_user: User, response: Response) {
    const refresh_token_time = Math.floor(Date.now() + (86400000 * 7));
    const access: string = await jwt.sign({
      data: {
        login: find_user.login,
        id: find_user.id,
      }
    }, process.env.ACCESS_TOKEN, {
      expiresIn: '15m',
    });
    const refresh: string = await jwt.sign({data: {
      login: find_user.login,
      id: find_user.id,
    }}, process.env.REFRESH_TOKEN,{
      expiresIn: '7d',
    });
    await response.cookie('refresh_token', refresh, {
      expires: new Date(refresh_token_time),
      sameSite: 'none',
      httpOnly: true,
      secure: true,
      path: '/',
    });
    return {
      refresh,
      access,
    }
  }
  async login(createTokenDto: CreateTokenDto, response: Response) {
    if(!createTokenDto.login || !createTokenDto.password) {
      throw new HttpException('422 Unprocessable emtity', HttpStatus.UNPROCESSABLE_ENTITY);
    }
    const find_user = await this.userRepository.findOneBy({
      login: createTokenDto.login,
    });
    if(!find_user) {
      throw new HttpException('422 Unprocessable emtity', HttpStatus.UNPROCESSABLE_ENTITY);
    }
    const result = await bcrypt.compare(createTokenDto.password, find_user.password);
    if(!result) {
      throw new HttpException('422 Unprocessable emtity', HttpStatus.UNPROCESSABLE_ENTITY);
    }
    const { refresh, access } = await this.tokenHandler(find_user, response);
    const token_save = await this.tokenRepository.create({
      refresh,
      user: find_user,
    });
    await this.tokenRepository.save(token_save);
    return { access };
  }
  async update(response: Response, request: Request) {
    const refresh_token = request.cookies["refresh_token"];
    if(!refresh_token) {
      throw new HttpException('Token not valid', HttpStatus.UNAUTHORIZED);
    }
    const { id } = jwt.verify(refresh_token, process.env.REFRESH_TOKEN);
    const find_user = await this.userRepository.findOneBy({
      id,
    });
    if(!find_user) {
      throw new HttpException('Token not valid', HttpStatus.UNAUTHORIZED);
    }
    const { refresh, access } = await this.tokenHandler(find_user, response);
    const token_save = await this.tokenRepository.create({
      refresh,
      user: find_user,
    });
    await this.tokenRepository.save(token_save);
    return { access };
  }
  async logout(response: Response) {
    await response.clearCookie("refresh_token", {
			path: "/",
			sameSite: "none",
			secure: true,
		});
    response.status(204);
		return;
  }
}
