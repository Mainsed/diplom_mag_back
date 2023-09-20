import { Controller, Body, Post, Res } from '@nestjs/common';
import { Response } from 'express';
import { AuthService } from 'src/modules/auth/auth.service';
import { LoginRequestDto } from 'src/modules/auth/dto/login.request.dto';
import { Public } from 'src/shared/decorators/public.decorator';

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
