import { PrismaClient, User } from '@prisma/client';
import * as argon2 from 'argon2';

const client = new PrismaClient({
  log: ['error', 'info', 'query', 'warn'],
});

(async () => {
  const users = await client.user.findMany();
  await Promise.all(
    users.map(async (user) => {
      return client.user.update({
        data: {
          followedBy: {
            set: [],
          },
          following: {
            set: [],
          },
        },
        where: {
          userId: user.userId,
        },
      });
    })
  );
})();
