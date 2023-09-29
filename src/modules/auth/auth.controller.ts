import { Controller, Body, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from '@modules/auth/auth.service';
import { LoginRequestDto } from '@modules/auth/dto/login.request.dto';
import { Public } from '@shared/decorators/public.decorator';

/**
 * Controler to execute authorization
 * @param {AuthService} authService - auth service instance
 */
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('login')
  async login(@Body() dto: LoginRequestDto, @Res() res: Response) {
    res.send(await this.authService.login(dto, res));
  }

  @Post('logout')
  async logout(@Res() res: Response) {
    res.send(await this.authService.logout(res));
  }
}
