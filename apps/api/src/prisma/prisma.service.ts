import { Injectable } from '@nestjs/common';
import { PrismaClient } from 'database';
import * as argon2 from 'argon2';

@Injectable()
export class PrismaService extends PrismaClient {
  constructor() {
    super({
      log: ['error', 'info', 'query', 'warn'],
    });
  }
}
