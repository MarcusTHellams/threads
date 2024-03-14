import { type User, Prisma } from 'database';

// Exclude keys from user
export function exclude<User, Key extends keyof User>(
  user: User,
  keys: Key[],
): Omit<User, Key> {
  return Object.fromEntries(
    Object.entries(user).filter(([key]) => !keys.includes(key as Key)),
  ) as Omit<User, Key>;
}

export function usersWithOutPasswords<T>(users: User[]) {
  return users.map((user) => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...result } = user;
    return result;
  });
}

export type UsersWithOutPasswords = ReturnType<typeof usersWithOutPasswords>;

export const userWithAll = Prisma.validator<Prisma.UserDefaultArgs>()({
  include: {
    likes: {
      include: {
        post: true,
      },
    },
    conversations: true,
    messages: true,
    replies: true,
    followedBy: true,
    following: true,
    posts: true,
  },
});

export type UserWithAll = Prisma.PostGetPayload<typeof userWithAll>;
