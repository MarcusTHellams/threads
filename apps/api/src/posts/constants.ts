import { Prisma } from 'database';

export const postWithAll = Prisma.validator<Prisma.PostDefaultArgs>()({
  include: {
    likes: {
      include: {
        user: true,
      },
    },
    postedBy: true,
    replies: {
      include: {
        user: true,
      },
    },
  },
});

export type PostWithAll = Prisma.PostGetPayload<typeof postWithAll>;
