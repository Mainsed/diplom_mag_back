import { IsString, Length, Matches, IsEmail } from 'class-validator';
import { cfgRaw } from 'src/modules/staff/staff.config';

export class LoginRequestDto {
  @IsString()
  @IsEmail()
  @Length(cfgRaw.emailMinLength, cfgRaw.emailMaxLength)
  email: string;

  @IsString()
  @Matches(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/, {
    message:
      'password must be minimum eight characters, at least one letter and one number',
  })
  password: string;
}
