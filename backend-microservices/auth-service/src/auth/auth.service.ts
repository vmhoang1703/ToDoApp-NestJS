import {
  ConflictException,
  Inject,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ClientKafka } from '@nestjs/microservices';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    @Inject('USER_SERVICE') private readonly userClient: ClientKafka,
  ) {}

  async onModuleInit() {
    this.userClient.subscribeToResponseOf('user.getProfile');
    this.userClient.subscribeToResponseOf('user.create');
    await this.userClient.connect();
  }

  async login(data: { username: string; password: string }): Promise<any> {
    this.userClient
      .send('user.getProfile', data.username)
      .subscribe(async (user) => {
        const isMatch = await bcrypt.compare(data.password, user.password);
        if (!isMatch) {
          throw new UnauthorizedException();
        }
        const payload = { sub: user.userId, username: user.username };
        return {
          access_token: await this.jwtService.signAsync(payload),
        };
      });
  }

  async register(data: { username: string; password: string }) {
    const saltOrRounds = 10;
    this.userClient
      .send('user.getProfile', data.username)
      .subscribe(async (user) => {
        if (user) {
          throw new ConflictException('Account already exists.');
        } else {
          const passwordHashed = await bcrypt.hash(data.password, saltOrRounds);
          this.userClient
            .send('user.create', {
              username: data.username,
              password: passwordHashed,
            })
            .subscribe(async (userCreated) => {
              console.log(userCreated);
              return {
                message:
                  'Congratulation! Account has been created successfully.',
              };
            });
        }
      });
  }

  async verify(token: string) {
    try {
      return this.jwtService.verify(token);
    } catch {
      throw new Error('Invalid token');
    }
  }
}
