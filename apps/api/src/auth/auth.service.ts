import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  UnauthorizedException,
  forwardRef,
} from '@nestjs/common';
import * as argon2 from 'argon2';
import { JwtService } from '@nestjs/jwt';

import { UsersService } from 'src/users/users.service';
import { Prisma } from 'database';
import { Response } from 'express';
import { createAuthCookie, getJwtToken, time } from './constants';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
  ) {}

  async signIn(username: string, password: string) {
    const user = await this.usersService.findOneByUsername(username);

    const isAMatch = await argon2.verify(user?.password, password);
    console.log('isAMatch: ', isAMatch);

    if (!isAMatch) {
      throw new UnauthorizedException();
    }

    return getJwtToken(user, this.jwtService);
  }

  async signUp(body: Prisma.UserCreateInput) {
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
    const createdUser = await this.usersService.create(body);

    return getJwtToken(createdUser, this.jwtService);
  }
}
