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
import { AuthGuard } from './auth.guard';
import { Response } from 'express';
import { Public } from './decorators/public.decorator';
import { Prisma } from 'database';
import { UsersService } from '../users/users.service';
import { PrismaService } from 'src/prisma/prisma.service';

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
    const { access_token } = await this.authService.signIn(username, password);

    res
      .cookie('access_token', access_token, {
        httpOnly: true,
        secure: false,
        sameSite: 'lax',
        expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 15 /* 15 days*/),
      })
      .send({ status: 'ok' });
  }

  @Public()
  @HttpCode(HttpStatus.CREATED)
  @Post('signup')
  async signUp(
    @Body() body: Prisma.UserCreateInput,
    @Res({ passthrough: true }) res: Response,
  ) {
    const user = await this.prisma.user.findFirst({
      where: {
        OR: [
          {
            email: body.email,
          },
          {
            username: body.username,
          },
        ],
      },
    });
    if (user) {
      throw new HttpException(
        'User already exists',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
    const { password, username } = await this.usersService.create(body);
    const { access_token } = await this.authService.signIn(username, password);

    res
      .cookie('access_token', access_token, {
        httpOnly: true,
        secure: false,
        sameSite: 'lax',
        expires: new Date(Date.now() + 1000 * 60 * 60 * 24 * 15 /* 15 days*/),
      })
      .send({ status: 'ok' });
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
