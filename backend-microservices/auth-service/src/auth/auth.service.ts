import {
  ConflictException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ClientKafka } from '@nestjs/microservices';
import * as bcrypt from 'bcrypt';
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
    await this.userClient.connect();
  }

  async register(createUserDto: {
    username: string;
    password: string;
  }): Promise<any> {
    const saltOrRounds = 10;

    try {
      const userExists = await firstValueFrom(
        this.userClient.send('user.get', createUserDto.username),
      );
      if (userExists) {
        throw new ConflictException('Account already exists.');
      }

      // Hash password and create user
      const passwordHashed = await bcrypt.hash(
        createUserDto.password,
        saltOrRounds,
      );
      const userToCreate = { ...createUserDto, password: passwordHashed };
      const createdUser = await firstValueFrom(
        this.userClient.send('user.create', userToCreate),
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
  }): Promise<any> {
    try {
      const user = await firstValueFrom(
        this.userClient.send('user.get', loginUserDto.username),
      );

      if (!user) {
        throw new UnauthorizedException('Invalid credentials.');
      }

      const isMatch = await bcrypt.compare(
        loginUserDto.password,
        user.password,
      );

      console.debug('Password match result:', isMatch);

      if (!isMatch) {
        throw new UnauthorizedException('Invalid credentials.');
      }

      // Generate JWT token
      const payload = { sub: user.userId, username: user.username };
      return {
        success: true,
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
