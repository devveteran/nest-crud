import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UserService } from './user.service';

describe('UsersController', () => {
    let usersController: UsersController;

    beforeEach(async () => {
        const app: TestingModule = await Test.createTestingModule({
            controllers: [UsersController],
            providers: [UserService],
        }).compile();

        usersController = app.get<UsersController>(UsersController);
    });

    it('should be defined', () => {
        expect(usersController).toBeDefined();
    });
});
