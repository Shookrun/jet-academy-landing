import { PartialType } from '@nestjs/swagger';
import { CreateGlossaryDto } from './create-glossary.dto';

export class UpdateGlossaryDto extends PartialType(CreateGlossaryDto) {}
