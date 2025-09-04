import { PartialType } from '@nestjs/swagger';
import { CreateStudentProjectDto } from './create-student-project.dto';

export class UpdateStudentProjectDto extends PartialType(
  CreateStudentProjectDto,
) {}
