import { PartialType } from '@nestjs/swagger';
import { CreateCourseEligibilityDto } from './create-course-eligibility.dto';
export class UpdateCourseEligibilityDto extends PartialType(
  CreateCourseEligibilityDto,
) {}
