import { HttpService } from '@nestjs/axios';
import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { catchError, firstValueFrom } from 'rxjs';
import { ErrorEx } from 'src/errorex/errorex';
import { UpdateUserDto } from 'src/user/dto/update-user.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { User, UserDocument } from './user.schema';
import * as fs from 'fs';
import axios from 'axios';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<UserDocument>,
    private readonly httpService: HttpService,
  ) {}

  async create(createUserDto: CreateUserDto): Promise<UserDocument> {
    const userdata = await this.userModel.find({ id: createUserDto.id }).exec();
    if (userdata.length > 0)
      throw new ErrorEx(
        'Duplicate ID',
        HttpStatus.PRECONDITION_FAILED,
        'Already Existing',
        true,
      );

    const user = new this.userModel(createUserDto);
    return user.save();
  }

  async getUserById(id: string): Promise<UserDocument> {
    const userdata = await this.userModel.find({ id: id }).exec();
    return userdata[0];
  }

  async findOne(id: string) {
    const { data } = await firstValueFrom(
      this.httpService.get(`https://reqres.in/api/users/${id}`).pipe(
        catchError((error) => {
          throw new ErrorEx(
            'Error',
            HttpStatus.NOT_FOUND,
            'User fetch failed.',
            true,
          );
        }),
      ),
    );
    return data;
  }

  async update(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<UserDocument> {
    try {
      return this.userModel.findOneAndUpdate({ id: id }, updateUserDto);
    } catch (error) {
      throw new ErrorEx(
        'Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
        'Database error',
        true,
      );
    }
  }

  async remove(id: string) {
    try {
      return this.userModel.findOneAndDelete({ id: id });
    } catch (error) {
      throw new ErrorEx(
        'Error',
        HttpStatus.INTERNAL_SERVER_ERROR,
        'Database error',
        true,
      );
    }
  }

  async getAvatarImageURL(id: string, avatar_url: string) {
    const userdata = await this.userModel.find({ id: id }).exec();
    if (userdata.length == 0) {
      throw new ErrorEx('Error', HttpStatus.NOT_FOUND, 'User not found', true);
    }

    if (userdata[0].avatar === null || userdata[0].avatar.length === 0) {
      const image = await axios.get(avatar_url, {
        responseType: 'arraybuffer',
      });
      const encoded = Buffer.from(image.data).toString('base64');
      if (!fs.existsSync(`/avatars`)) {
        fs.mkdirSync(`/avatars`);
      }
      const writer = fs.createWriteStream(`/avatars/${id}.jpg`);
      writer.write(image.data);
      this.update(id, { avatar: encoded });
      return encoded;
    } else {
      return userdata[0].avatar;
    }
  }
}
