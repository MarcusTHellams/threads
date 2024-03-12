import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Request,
  HttpException,
  Res,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response } from 'express';
import { Public } from './decorators/public.decorator';
import { Prisma } from 'database';
import { UsersService } from '../users/users.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { createAuthCookie, time } from './constants';

const sleep = (ms = 0) => new Promise((resolve) => setTimeout(resolve, ms));

@Controller('auth')
export class AuthController {
  constructor(
    private readonly authService: AuthService,
    private readonly usersService: UsersService,
    private readonly prisma: PrismaService,
  ) {}

  @Public()
  @HttpCode(HttpStatus.OK)
  @Post('login')
  async signIn(
    @Body() { password, username }: { username: string; password: string },
    @Res({ passthrough: true }) res: Response,
  ) {
    const token = await this.authService.signIn(username, password, res);
    createAuthCookie(token, res);
  }

  @Public()
  @HttpCode(HttpStatus.CREATED)
  @Post('signup')
  async signUp(
    @Body() body: Prisma.UserCreateInput,
    @Res({ passthrough: true }) res: Response,
  ) {
    const token = await this.authService.signUp(body, res);
    createAuthCookie(token, res);
  }

  @HttpCode(HttpStatus.OK)
  @Get('logout')
  async logOut(@Res({ passthrough: true }) res: Response) {
    res
      .clearCookie('access_token', {
        httpOnly: true,
        secure: false,
        sameSite: 'lax',
      })
      .send({ message: 'successfully logged out' });
  }

  @Get('profile')
  getProfile(@Request() req) {
    return req.user;
  }
}
