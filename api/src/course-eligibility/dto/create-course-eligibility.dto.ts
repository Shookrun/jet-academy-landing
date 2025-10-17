import { IsString, IsObject } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { Prisma } from '@prisma/client';

export class CreateCourseEligibilityDto {
  @IsObject()
  @ApiProperty({
    example: {
      az: 'Riyaziyyat biliyi',
      en: 'Knowledge of mathematics',
    },
  })
  title: Prisma.JsonValue;

  @IsObject()
  @ApiProperty({
    example: {
      az: 'Orta məktəb riyaziyyat bilikləri',
      en: 'Knowledge of high school mathematics',
    },
  })
  description: Prisma.JsonValue;

  @IsString()
  @ApiProperty({ example: 'calculator' })
  icon: string;
}
