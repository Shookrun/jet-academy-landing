import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsOptional } from 'class-validator';

export class CreateGlossaryCategoryDto {
  @ApiProperty({ example: 'Veb' })
  @IsString()
  'name[az]': string;

  @ApiProperty({ example: 'Web' })
  @IsString()
  'name[en]': string;

  @ApiProperty({
    example: 'Veb texnologiyaları və veb inkişafı ilə bağlı əsas anlayışlar',
    required: false,
  })
  @IsOptional()
  @IsString()
  'description[az]'?: string;

  @ApiProperty({
    example: 'Key concepts of web technologies and web development',
    required: false,
  })
  @IsOptional()
  @IsString()
  'description[en]'?: string;

  @ApiProperty({ example: 'veb' })
  @IsString()
  'slug[az]': string;

  @ApiProperty({ example: 'web' })
  @IsString()
  'slug[en]': string;

  @ApiProperty({ example: 1, required: false, default: 0 })
  @IsOptional()
  @IsNumber()
  order?: number;
}
