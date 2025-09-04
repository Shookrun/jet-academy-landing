import { IsString, IsObject } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Prisma } from '@prisma/client';

export class CreateCourseEligibilityDto {
  @IsObject()
  @ApiProperty({
    example: {
      az: 'Riyaziyyat biliyi',
      ru: 'Знание математики',
    },
  })
  title: Prisma.JsonValue;

  @IsObject()
  @ApiProperty({
    example: {
      az: 'Orta məktəb riyaziyyat bilikləri',
      ru: 'Знания математики средней школы',
    },
  })
  description: Prisma.JsonValue;

  @IsString()
  @ApiProperty({ example: 'calculator' })
  icon: string;
}
