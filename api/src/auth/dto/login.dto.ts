import { IsEmail, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
  @ApiProperty({
    default: 'rufat845@gmail.com',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    default: 'xxxxx',
  })
  @IsString()
  @MinLength(8)
  password: string;
}
