import { ApiProperty } from '@nestjs/swagger';
import { Transform } from 'class-transformer';
import {
  IsString,
  IsBoolean,
  IsOptional,
  IsArray,
  IsMongoId,
} from 'class-validator';

export class CreateGlossaryDto {
  @ApiProperty({ example: 'Veb sayt' })
  @IsString()
  'term[az]': string;

  @ApiProperty({ example: 'Веб-сайт' })
  @IsString()
  'term[ru]': string;

  @ApiProperty({
    example:
      'İnternetdə yerləşdirilmiş, bir-biri ilə əlaqəli veb səhifələr toplusu.',
  })
  @IsString()
  'definition[az]': string;

  @ApiProperty({
    example: 'Набор связанных веб-страниц, размещенных в интернете.',
  })
  @IsString()
  'definition[ru]': string;

  @ApiProperty({ example: 'veb-sayt' })
  @IsString()
  'slug[az]': string;

  @ApiProperty({ example: 'veb-sayt' })
  @IsString()
  'slug[ru]': string;

  @ApiProperty({ example: '60d21b4667d0d8992e610c01', required: false })
  @IsOptional()
  @IsMongoId()
  categoryId?: string;

  @ApiProperty({
    example: ['web', 'internet', 'website'],
    required: false,
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @Transform(({ value }) =>
    typeof value === 'string'
      ? value.split(',').map((tag) => tag.trim())
      : value,
  )
  tags?: string[];

  @ApiProperty({
    example: ['60d21b4667d0d8992e610c02', '60d21b4667d0d8992e610c03'],
    required: false,
    type: [String],
  })
  @IsOptional()
  @IsArray()
  @IsMongoId({ each: true })
  relatedTerms?: string[];

  @ApiProperty({ required: false, default: false })
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => value === 'true')
  published?: boolean;
}
