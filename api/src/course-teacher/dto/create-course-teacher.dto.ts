import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsObject, IsOptional } from 'class-validator';
import { Prisma } from '@prisma/client';

export class CreateCourseTeacherDto {
  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty({ required: false })
  @IsObject()
  @IsOptional()
  description?: Prisma.InputJsonValue;
}
