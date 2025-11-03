import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString } from 'class-validator';

export class CreateGalleryDto {
  @ApiProperty({
    example: {
      az: 'Mobil Tətbiq Layihəsi',
      en: 'Mobile application project',
    },
    description: 'Project title in multiple languages (Azerbaijani, Russian)',
    type: 'object',
    additionalProperties: {
      type: 'string',
    },
  })
  @IsString()
  @IsNotEmpty({ message: 'Title cannot be empty' })
  title: Record<string, any>;

  imageUrl?: string;
}
