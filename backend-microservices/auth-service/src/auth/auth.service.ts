import {
  ConflictException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ClientKafka } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    @Inject('USER_SERVICE') private readonly userClient: ClientKafka,
  ) {}

  async onModuleInit() {
    this.userClient.subscribeToResponseOf('user.get');
    this.userClient.subscribeToResponseOf('user.create');
    this.userClient.subscribeToResponseOf('user.checkPassword');
    await this.userClient.connect();
  }

  async register(createUserDto: {
    username: string;
    password: string;
  }): Promise<any> {
    try {
      const userExists = await firstValueFrom(
        this.userClient.send('user.get', createUserDto.username),
      );

      if (userExists) {
        throw new ConflictException('Account already exists.');
      }

      const createdUser = await firstValueFrom(
        this.userClient.send('user.create', createUserDto),
      );
      return { message: 'User successfully registered', user: createdUser };
    } catch (error) {
      console.error('Error during registration:', error);
      throw error;
    }
  }

  async login(loginUserDto: {
    username: string;
    password: string;
  }): Promise<{ access_token: string }> {
    try {
      const user = await firstValueFrom(
        this.userClient.send('user.get', loginUserDto.username),
      );

      const checkPassword = await firstValueFrom(
        this.userClient.send('user.checkPassword', loginUserDto),
      );

      if (typeof checkPassword === 'string') {
        const isPasswordValid = checkPassword.toLowerCase() === 'true';
        if (!isPasswordValid) {
          throw new UnauthorizedException('Invalid credentials.');
        }
      } else {
        console.warn(
          'Unexpected checkPassword result type:',
          typeof checkPassword,
        );
        throw new UnauthorizedException('Unable to verify credentials.');
      }

      const payload = { sub: user._id, username: user.username };
      return {
        access_token: await this.jwtService.signAsync(payload),
      };
    } catch (error) {
      console.error('Error during login:', error);
      throw error;
    }
  }

  async verify(token: string) {
    try {
      return this.jwtService.verify(token);
    } catch (e) {
      throw new UnauthorizedException('Invalid token.');
    }
  }
}
