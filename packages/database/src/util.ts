import { PrismaClient } from '@prisma/client';
import * as argon2 from 'argon2';

const client = new PrismaClient({
  log: ['error', 'info', 'query', 'warn'],
});
