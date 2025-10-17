import {
  IsString,
  IsUrl,
  IsNotEmpty,
  IsDate,
  IsOptional,
  IsMongoId,
} from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateStudentProjectDto {
  @ApiProperty({
    example: {
      az: 'Mobil Tətbiq Layihəsi',
      en: 'Mobile application project',
    },
    description: 'Project title in multiple languages (Azerbaijani, Russian)',
    type: 'object',
    additionalProperties: {
      type: 'string',
    },
  })
  @IsString()
  @IsNotEmpty({ message: 'Title cannot be empty' })
  title: Record<string, any>;

  @ApiProperty({
    example: {
      az: 'Tələbələrin davamiyyətini izləmək üçün mobil tətbiq',
      en: 'Mobile application for tracking student attendance',
    },
    description:
      'Project description in multiple languages (Azerbaijani, Russian)',
    type: 'object',
    additionalProperties: {
      type: 'string',
    },
  })
  @IsString()
  @IsNotEmpty({ message: 'Description cannot be empty' })
  description: Record<string, any>;

  @ApiProperty({
    example: 'https://example.com/project-image.jpg',
    description: 'URL of the project image',
    format: 'url',
  })
  @IsUrl({}, { message: 'Image URL must be a valid URL' })
  @IsNotEmpty({ message: 'Image URL cannot be empty' })
  imageUrl: string;

  @ApiProperty({
    example: 'https://github.com/username/project',
    description: 'URL to the project (e.g., GitHub repository, live demo)',
    format: 'url',
  })
  @IsUrl({}, { message: 'Project link must be a valid URL' })
  @IsNotEmpty({ message: 'Project link cannot be empty' })
  link: string;

  @ApiProperty({
    example: '2024-03-19T12:00:00Z',
    description: 'Project creation date',
    required: false,
    type: Date,
  })
  @IsDate()
  @IsOptional()
  createdAt: Date;

  @ApiProperty({
    example: '2024-03-19T12:00:00Z',
    description: 'Project last update date',
    required: false,
    type: Date,
  })
  @IsDate()
  @IsOptional()
  updatedAt: Date;

  @ApiProperty({
    example: '676353475146a7e83e13bc7b',
    description: 'MongoDB ObjectId of the project category',
    format: 'mongo-id',
  })
  @IsMongoId({ message: 'Category ID must be a valid MongoDB ObjectId' })
  @IsNotEmpty({ message: 'Category ID cannot be empty' })
  categoryId: string;
}
