import { IsString, IsNotEmpty, IsObject, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateContactDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty({ message: 'Email cannot be empty' })
  email: string;

  @ApiProperty({ required: false })
  @IsObject()
  @IsOptional()
  address?: Record<string, any>;

  @ApiProperty({ required: false })
  @IsObject()
  @IsOptional()
  address2?: Record<string, any>;

  @ApiProperty()
  @IsString()
  @IsNotEmpty({ message: 'WhatsApp number cannot be empty' })
  whatsapp: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty({ message: 'Phone number cannot be empty' })
  phone: string;

  @ApiProperty({ required: false })
  @IsObject()
  @IsOptional()
  workingHours?: Record<string, any>;
}
