import { PartialType } from '@nestjs/swagger';
import { CreateCourseTeacherDto } from './create-course-teacher.dto';

export class UpdateCourseTeacherDto extends PartialType(
  CreateCourseTeacherDto,
) {}
