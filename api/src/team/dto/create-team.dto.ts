import { IsNotEmpty, IsObject, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTeamDto {
  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsNotEmpty()
  @IsString()
  surname: string;

  @ApiProperty({ type: 'string', format: 'binary', required: false })
  image?: any;

  @ApiProperty()
  @IsNotEmpty()
  @IsObject()
  bio: any;

  imageUrl?: string;
}
