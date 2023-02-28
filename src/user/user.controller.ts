import { Controller, Get, Param, Delete, HttpStatus } from '@nestjs/common';
import * as fs from 'fs';
import { UserService } from './user.service';
import { ErrorEx } from 'src/errorex/errorex';

@Controller('api/user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.userService.findOne(id);
  }

  @Get(':id/avatar')
  async findAvatar(@Param('id') id: string) {
    try {
      const user = await this.userService.findOne(id);
      const response = await this.userService.getAvatarImageURL(
        id,
        user.data.avatar,
      );
      return response;
    } catch (error) {
      return error.toJSON();
    }
  }

  @Delete(':id/avatar')
  async remove(@Param('id') id: string) {
    fs.unlink(`/avatars/${id}.jpg`, (err) => {
      return new ErrorEx(
        'Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
        'File Delete error',
        true,
      ).toJSON();
    });
    return await this.userService.update(id, { avatar: null });
  }
}
