import { Injectable } from '@nestjs/common';
import { UpdatePostDto } from './dto/update-post.dto';
import { Prisma } from 'database';
import { PrismaService } from 'src/prisma/prisma.service';

import { postWithAll, PostWithAll } from './constants';

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

  findAll() {
    return `This action returns all posts`;
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
