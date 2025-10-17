import { ApiProperty } from '@nestjs/swagger';
import { Prisma } from '@prisma/client';
import { IsObject, IsOptional } from 'class-validator';

export class CreateCourseModuleDto {
  @IsObject()
  @ApiProperty({
    example: {
      az: 'JavaScript Basics',
      en: 'JavaScript Basics',
    },
  })
  title: Prisma.JsonValue;

  @IsObject()
  @IsOptional()
  @ApiProperty({
    required: false,
    example: {
      az: 'JavaScript fundamentals and core concepts',
      en: 'JavaScript fundamentals and core concepts',
    },
  })
  description?: Prisma.JsonValue;

  @IsObject()
  @ApiProperty({
    example: {
      az: 'Learn about JavaScript variables and data types',
      en: 'Learn about JavaScript variables and data types',
    },
  })
  content: Prisma.JsonValue;
}
