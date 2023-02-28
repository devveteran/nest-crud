import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';

describe('MailService', () => {
  let service: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserService],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  describe('create', () => {
    it ('should create user', () => {
        // Arrange
        const payload = {
            id: '999',
            name: 'John',
            email: 'john@gmail.com',
            avatar: ''
        };

        // Act
        const user = service.create(payload);

        // Assert
        expect(user).toBe(payload);
    });

    it ('should inform if the given id is already registered.', () => {
        // Arrange
        const payload = {
            id: '6',
            name: 'John',
            email: 'john@gmail.com',
            avatar: ''
        };

        // Act
        const user = service.create(payload);

        // Assert
        expect(user).toThrowError();
    });
  })

  describe ('findOne', () => {
    it ('should be return user data', () => {
        // Arrange
        const id = '6';

        // Act
        const user = service.findOne(id);

        // Assert
        expect(user).toHaveLength(1);
    });

    it ('should fail if the user of given id not exists', () => {
        // Arrange
        const id = '1000';

        // Act
        const user = service.findOne(id);

        // Assert
        expect(user).toThrowError();
    });
  });

});
