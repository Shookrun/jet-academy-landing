import { ApiProperty, PartialType } from '@nestjs/swagger';

import { IsNumber, IsString } from 'class-validator';
import { CreateCourseModuleDto } from './create-course-module.dto';
export class AssignModuleDto {
  @IsString()
  @ApiProperty()
  moduleId: string;

  @IsNumber()
  @ApiProperty()
  order: number;
}

export class UpdateCourseModuleDto extends PartialType(CreateCourseModuleDto) {}
