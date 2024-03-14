import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Patch,
  Post,
  Req,
} from '@nestjs/common';
import { Prisma } from 'database';
import { UsersService } from './users.service';
import { Request } from 'express';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  create(@Body() createUserDto: Prisma.UserCreateInput) {
    return this.usersService.create(createUserDto);
  }
  @Get('follow/:id')
  async followUnfollowUser(@Param('id') id: string, @Req() req: Request) {
    try {
      const follow =
        (await this.usersService.followUnFollow(id, req)) === 'follow';

      if (follow) {
        return { message: 'User followed successfully' };
      }
      return { message: 'User unfollowed successfully' };
    } catch (error) {
      throw new HttpException(
        (error as Error).message,
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  @Get()
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.usersService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() updateUserDto: Prisma.UserUpdateInput,
  ) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.usersService.remove(+id);
  }
}
