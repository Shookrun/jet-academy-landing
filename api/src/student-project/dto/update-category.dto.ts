import { PartialType } from '@nestjs/swagger';
import { CreateStudentProjectCategoryDto } from './create-category.dto';
export class UpdateStudentProjectCategoryDto extends PartialType(
  CreateStudentProjectCategoryDto,
) {}
