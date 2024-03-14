import { Injectable } from '@nestjs/common';
import { UpdatePostDto } from './dto/update-post.dto';
import { Prisma, User } from 'database';
import { PrismaService } from 'src/prisma/prisma.service';

import { postWithAll } from './constants';

@Injectable()
export class PostsService {
  constructor(private readonly prisma: PrismaService) {}
  async create(createPostDto: Prisma.PostCreateInput) {
    const post = await this.prisma.post.create({
      data: createPostDto,
      ...postWithAll,
    });
    delete post.postedBy.password;
    return post;
  }

  async findAll() {
    const posts = await this.prisma.post.findMany({
      ...postWithAll,
    });
    return posts.map((post) => {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { password, ...result } = post.postedBy;
      post.postedBy = result as User;
      return post;
    });
  }

  findOne(id: number) {
    return `This action returns a #${id} post`;
  }

  update(id: number, updatePostDto: UpdatePostDto) {
    return `This action updates a #${id} post`;
  }

  remove(id: number) {
    return `This action removes a #${id} post`;
  }
}
