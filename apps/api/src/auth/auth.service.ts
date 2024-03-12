import {
  Inject,
  Injectable,
  UnauthorizedException,
  forwardRef,
} from '@nestjs/common';
import * as argon2 from 'argon2';
import { JwtService } from '@nestjs/jwt';

import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
  constructor(
    @Inject(forwardRef(() => UsersService))
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async signIn(username: string, password: string) {
    const user = await this.usersService.findOneByUsername(username);

    const isAMatch = await argon2.verify(user?.password, password);

    if (!isAMatch) {
      throw new UnauthorizedException();
    }
    const payload = { id: user.id, username: user.username };

    return { access_token: await this.jwtService.signAsync(payload) };
  }
}
