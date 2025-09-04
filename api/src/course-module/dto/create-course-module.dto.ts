import { ApiProperty } from '@nestjs/swagger';
import { Prisma } from '@prisma/client';
import { IsObject, IsOptional } from 'class-validator';

export class CreateCourseModuleDto {
  @IsObject()
  @ApiProperty({
    example: {
      az: 'JavaScript Basics',
      ru: 'Основы JavaScript',
    },
  })
  title: Prisma.JsonValue;

  @IsObject()
  @IsOptional()
  @ApiProperty({
    required: false,
    example: {
      az: 'JavaScript fundamentals and core concepts',
      ru: 'Основы JavaScript и основные концепции',
    },
  })
  description?: Prisma.JsonValue;

  @IsObject()
  @ApiProperty({
    example: {
      az: 'Learn about JavaScript variables and data types',
      ru: 'Изучите переменные и типы данных JavaScript',
    },
  })
  content: Prisma.JsonValue;
}
