import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';
import { User } from './../user/user.entity';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  async sendUserMail(user: User) {
    await this.mailerService.sendMail({
      to: user.email,
      subject: 'Welcome to Payever!',
      template: './user_created',
      context: {
        name: user.name,
      },
    });
  }
}
