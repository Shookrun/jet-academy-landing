import { ApiProperty } from '@nestjs/swagger';
import {
  IsString,
  IsOptional,
  IsBoolean,
  IsArray,
  IsEnum,
  IsDateString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { PostType, EventStatus } from '@prisma/client';

class MultilingualField {
  @ApiProperty({
    description: 'Text in Azerbaijani',
    example: 'Post başlığı',
  })
  @IsString()
  az: string;

  @ApiProperty({
    description: 'Text in Russian',
    example: 'Заголовок поста',
  })
  @IsString()
  ru: string;
}

export class CreatePostDto {
  @ApiProperty({
    description: 'Title of the post (multilingual)',
    type: MultilingualField,
  })
  @ValidateNested()
  @Type(() => MultilingualField)
  title: MultilingualField;

  @ApiProperty({
    description: 'Content of the post (multilingual)',
    type: MultilingualField,
  })
  @ValidateNested()
  @Type(() => MultilingualField)
  content: MultilingualField;

  @ApiProperty({
    description: 'Slug of the post (multilingual)',
    type: MultilingualField,
  })
  @ValidateNested()
  @Type(() => MultilingualField)
  slug: MultilingualField;

  @ApiProperty({
    description: 'Whether the post is published',
    required: false,
    default: false,
    type: Boolean,
  })
  @IsBoolean()
  @IsOptional()
  published?: boolean;

  @ApiProperty({
    description: 'URL of the post image',
    required: false,
    type: String,
  })
  @ApiProperty({ type: 'string', format: 'binary', required: false })
  image?: any;

  @IsString()
  @IsOptional()
  imageUrl?: string;

  @ApiProperty({
    description: 'Tags for the post',
    required: false,
    type: [String],
    default: [],
  })
  @IsArray()
  @IsOptional()
  tags?: MultilingualField[];

  @ApiProperty({
    description: 'Type of the post',
    required: false,
    enum: PostType,
    default: PostType.BLOG,
  })
  @IsEnum(PostType)
  @IsOptional()
  postType?: PostType;

  @ApiProperty({
    description: 'Event date (only for EVENT post type)',
    required: false,
    type: String,
    format: 'date-time',
  })
  @IsDateString()
  @IsOptional()
  eventDate?: string;

  @ApiProperty({
    description: 'Event status (only for EVENT post type)',
    required: false,
    enum: EventStatus,
  })
  @IsEnum(EventStatus)
  @IsOptional()
  eventStatus?: EventStatus;

  @ApiProperty({
    description: 'Offer start date (only for OFFERS post type)',
    required: false,
    type: String,
    format: 'date-time',
  })
  @IsDateString()
  @IsOptional()
  offerStartDate?: string;

  @ApiProperty({
    description: 'Offer end date (only for OFFERS post type)',
    required: false,
    type: String,
    format: 'date-time',
  })
  @IsDateString()
  @IsOptional()
  offerEndDate?: string;
}
