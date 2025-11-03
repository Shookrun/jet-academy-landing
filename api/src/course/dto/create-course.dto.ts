import { ApiProperty } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { IsString, IsBoolean, IsOptional, IsNumber, IsArray } from 'class-validator';

export class CreateCourseDto {
  @ApiProperty({ example: 'IT və Kompüter Mühəndisliyi' })
  @IsString()
  'title[az]': string;

  @ApiProperty({ example: 'IT and computer engineering' })
  @IsString()
  'title[en]': string;

  @ApiProperty({ example: 'Tam stack veb proqramlaşdırma kursu' })
  @IsString()
  'description[az]': string;

  @ApiProperty({ example: 'Full Stack Web Development Course' })
  @IsString()
  'description[en]': string;

  @ApiProperty({ example: 'computer-icon.png', required: false })
  @IsOptional()
  @IsString()
  icon?: string;

  @ApiProperty({ example: 'full-stack-development' })
  @IsString()
  'slug[az]': string;

  @ApiProperty({ example: 'full-stack-development' })
  @IsString()
  'slug[en]': string;

  @ApiProperty({ example: 12, description: 'Duration in months' })
  @Type(() => Number)
  @Transform(({ value }) => parseInt(value))
  duration: number;

  @ApiProperty({ example: 'Başlanğıc' })
  @IsString()
  'level[az]': string;

  @ApiProperty({ example: 'Beginner' })
  @IsString()
  'level[en]': string;

  @ApiProperty({ example: ['Scratch', 'HTML', 'JavaScript'], required: false })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  'newTags[az]'?: string[];

  @ApiProperty({ example: ['Scratch', 'HTML', 'JavaScript'], required: false })
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  'newTags[en]'?: string[];

  @ApiProperty({ required: false, default: false })
  @IsOptional()
  @IsBoolean()
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      return value === 'true';
    }
    return Boolean(value);
  })
  published?: boolean;

  @ApiProperty({ example: '9-15', description: 'Age range' })
  @IsOptional()
  @IsString()
  ageRange?: string;

  @ApiProperty({
    type: 'string',
    format: 'binary',
    required: false,
    description: 'Course image file',
  })
  @IsOptional()
  image?: any;

  @IsOptional()
  @IsString()
  imageUrl?: string;
}