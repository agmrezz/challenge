import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { LoginDto } from './dto/login-dto';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
  ) {}

  async validateUser(username: string, pass: string): Promise<any> {
    const user = await this.usersService.findOne(username);
    if (user && user.password === pass) {
      const { password: _, ...result } = user;
      return result;
    }
    return null;
  }

  login(loginDto: LoginDto) {
    const payload = { username: loginDto.username };
    return {
      access_token: this.jwtService.sign(payload, {
        secret: process.env.AUTH_SECRET,
      }),
    };
  }
}
