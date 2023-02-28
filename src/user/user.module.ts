import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { User, UserSchema } from './user.schema';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersController } from './users.controller';
import { ClientsModule } from '@nestjs/microservices/module';
import { Transport } from '@nestjs/microservices';
import { MailModule } from 'src/mail/mail.module';
import { HttpModule } from '@nestjs/axios';

@Module({
  imports: [
    MongooseModule.forFeature([
      {
        name: User.name,
        schema: UserSchema,
      },
    ]),
    ClientsModule.register([
      {
        name: 'USER_SERVICE',
        transport: Transport.RMQ,
        options: {
          urls: ['amqp://localhost:5672'],
          queue: 'andrei',
          queueOptions: {
            durable: false,
          },
        },
      },
    ]),
    MailModule,
    HttpModule,
  ],
  controllers: [UserController, UsersController],
  providers: [UserService],
})
export class UserModule {}
