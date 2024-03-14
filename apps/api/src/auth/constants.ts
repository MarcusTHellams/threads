import { Response } from 'express';
import { type User } from 'database';
import { JwtService } from '@nestjs/jwt';

export const time = new Date(
  Date.now() + 1000 * 60 * 60 * 24 * 15 /* 15 days*/,
);

export const createAuthCookie = (access_token: string, resp: Response) => {
  resp
    .cookie('access_token', access_token, {
      httpOnly: true,
      secure: false,
      sameSite: 'lax',
      expires: time,
    })
    .send({ status: 'ok' });
};

export const getJwtToken = (user: User, jwtService: JwtService) => {
  const payload = { id: user.userId, username: user.username };
  return jwtService.signAsync(payload);
};
