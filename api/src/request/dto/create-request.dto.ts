import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsInt, IsEnum, IsOptional } from 'class-validator';
import { Language } from '@prisma/client';

export class CreateRequestDto {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiProperty()
  @IsString()
  surname: string;

  @ApiProperty()
  @IsString()
  number: string;

  @ApiProperty()
  @IsInt()
  childAge: number;

  @ApiProperty({ enum: Language, default: Language.AZ })
  @IsEnum(Language)
  childLanguage: Language;

  @ApiProperty({ required: false })
  @IsOptional()
  additionalInfo?: any;
}
