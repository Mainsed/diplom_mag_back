export class LoginResponsetDto {
  isAuthorized: boolean;
  name?: string;
  error?: string;
  accessToken?: string;
}
