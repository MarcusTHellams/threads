import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { Prisma } from 'database';
import { Request } from 'express';
import { usersWithOutPasswords } from './constants';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}
  create(createUserDto: Prisma.UserCreateInput) {
    return this.prisma.user.create({
      data: createUserDto,
    });
  }

  async findAll() {
    const users = await this.prisma.user.findMany({
      include: {
        following: true,
        followedBy: true,
        conversations: true,
        replies: true,
      },
    });
    return usersWithOutPasswords(users);
  }

  findOneByUsername(username: string) {
    return this.prisma.user.findUnique({
      where: {
        username,
      },
    });
  }

  findOne(userId: string) {
    return this.prisma.user.findFirst({
      where: {
        userId,
      },
    });
  }

  update(id: string, updateUserDto: Prisma.UserUpdateInput) {
    return this.prisma.user.update({
      where: { userId: id },
      data: updateUserDto,
      include: {
        conversations: true,
        messages: true,
        followedBy: true,
        following: true,
        likes: true,
        posts: true,
        replies: true,
      },
    });
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }

  async followUnFollow(id: string, req: Request) {
    if (req['user'].id === id) {
      throw new HttpException(
        "You can't follow or un-follow yourself",
        HttpStatus.BAD_REQUEST,
      );
    }
    const userToModify = await this.findOne(id);
    const currentUser = await this.prisma.user.findUnique({
      where: {
        userId: req['user'].id,
      },
      include: {
        following: true,
      },
    });
    console.log('userToModify: ', userToModify);
    console.log('currentUser: ', currentUser);

    if (!userToModify || !currentUser) {
      throw new HttpException('User not Found', HttpStatus.NOT_FOUND);
    }

    const isFollowing = currentUser.following.map((f) => f.userId).includes(id);

    if (isFollowing) {
      //unfollow user
      await this.prisma.user.update({
        where: { userId: currentUser.userId },
        data: {
          following: {
            disconnect: {
              userId: userToModify.userId,
            },
          },
        },
      });
      return 'unfollow';
    } else {
      // follow user
      await this.prisma.user.update({
        data: {
          following: {
            connect: {
              userId: userToModify.userId,
            },
          },
        },
        where: { userId: currentUser.userId },
      });
      return 'follow';
    }
  }
}
