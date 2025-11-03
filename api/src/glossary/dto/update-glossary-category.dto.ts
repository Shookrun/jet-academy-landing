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
  'name[en]'?: string;

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

  @ApiProperty({ example: 'veb', required: false })
  @IsOptional()
  @IsString()
  'slug[az]'?: string;

  @ApiProperty({ example: 'web', required: false })
  @IsOptional()
  @IsString()
  'slug[en]'?: string;

  @ApiProperty({ example: 1, required: false })
  @IsOptional()
  @IsNumber()
  order?: number;
}
