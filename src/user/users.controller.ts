import {
  Controller,
  Post,
  Body,
  Inject,
  OnApplicationBootstrap,
  HttpStatus,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { ClientProxy, EventPattern } from '@nestjs/microservices';
import { MailService } from 'src/mail/mail.service';
import { ErrorEx } from 'src/errorex/errorex';

@Controller('api/users')
export class UsersController implements OnApplicationBootstrap {
  constructor(
    private readonly userService: UserService,
    @Inject('USER_SERVICE') private client: ClientProxy,
    private mailService: MailService,
  ) {}

  async onApplicationBootstrap() {
    await this.client.connect();
  }

  @EventPattern('user_created')
  async handleUserCreated(data: Record<string, unknown>) {
    console.log('New user as following has been created.', data);
  }

  async publish(data) {
    this.client.emit<string>('user_created', data);
  }

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    try {
      const newUser = await this.userService.create(createUserDto);
      await this.publish(newUser.toJSON());
      return newUser.toJSON();
    } catch (err) {
      if (err instanceof ErrorEx) return err.toJSON();
      else {
        console.log(err);
        return new ErrorEx(
          'Error',
          HttpStatus.INTERNAL_SERVER_ERROR,
          'User add failed.',
          true,
        ).toJSON();
      }
    }
  }
}
