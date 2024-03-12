import { Injectable } from '@nestjs/common';
import { PrismaClient } from 'database';
import * as argon2 from 'argon2';

const prisma = new PrismaClient({
  log: ['error', 'info', 'query', 'warn'],
});

function extendedClient() {
  const extendClient = () =>
    prisma.$extends({
      query: {
        user: {
          async create({ args, query }) {
            const hashedPassword = await argon2.hash(args.data.password);
            args.data.password = hashedPassword;
            return query(args);
          },
        },
      },
    });

  // https://github.com/prisma/prisma/issues/18628#issuecomment-1601958220
  return new Proxy(class {}, {
    construct(target, args, newTarget) {
      return Object.assign(
        Reflect.construct(target, args, newTarget),
        extendClient(),
      );
    },
  }) as new () => ReturnType<typeof extendClient>;
}

@Injectable()
export class PrismaService extends extendedClient() {}
