import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNumber, IsOptional } from 'class-validator';

export class UpdateGlossaryCategoryDto {
  @ApiProperty({ example: 'Veb', required: false })
  @IsOptional()
  @IsString()
  'name[az]'?: string;

  @ApiProperty({ example: 'Веб', required: false })
  @IsOptional()
  @IsString()
  'name[ru]'?: string;

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

  @ApiProperty({ example: 'veb', required: false })
  @IsOptional()
  @IsString()
  'slug[az]'?: string;

  @ApiProperty({ example: 'veb', required: false })
  @IsOptional()
  @IsString()
  'slug[ru]'?: string;

  @ApiProperty({ example: 1, required: false })
  @IsOptional()
  @IsNumber()
  order?: number;
}
