import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsOptional } from 'class-validator';

export class CreateGlossaryCategoryDto {
  @ApiProperty({ example: 'Veb' })
  @IsString()
  'name[az]': string;

  @ApiProperty({ example: 'Веб' })
  @IsString()
  'name[ru]': string;

  @ApiProperty({
    example: 'Veb texnologiyaları və veb inkişafı ilə bağlı əsas anlayışlar',
    required: false,
  })
  @IsOptional()
  @IsString()
  'description[az]'?: string;

  @ApiProperty({
    example: 'Ключевые концепции веб-технологий и веб-разработки',
    required: false,
  })
  @IsOptional()
  @IsString()
  'description[ru]'?: string;

  @ApiProperty({ example: 'veb' })
  @IsString()
  'slug[az]': string;

  @ApiProperty({ example: 'veb' })
  @IsString()
  'slug[ru]': string;

  @ApiProperty({ example: 1, required: false, default: 0 })
  @IsOptional()
  @IsNumber()
  order?: number;
}
