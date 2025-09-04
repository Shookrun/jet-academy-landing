import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  UseInterceptors,
  UploadedFile,
  Req,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { CourseService } from './course.service';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';
import { ApiTags, ApiOperation, ApiConsumes, ApiBody } from '@nestjs/swagger';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { RoleGuard } from '../guards/role.guard';
import { Roles } from '../decorators/roles.decorator';
import { Role } from '@prisma/client';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { Request } from 'express';

@ApiTags('Courses')
@Controller('courses')
export class CourseController {
  constructor(private readonly courseService: CourseService) {}

  private generateImageUrl(filename: string, request: Request): string {
    const baseUrl = process.env.APP_URL || `${request.protocol}://${request.get('host')}`;
    return `${baseUrl}/uploads/courses/${filename}`;
  }

  @Post()
@UseGuards(JwtAuthGuard, RoleGuard)
@Roles(Role.ADMIN, Role.STAFF, Role.CONTENTMANAGER)
@UseInterceptors(
  FileInterceptor('image', {
    storage: diskStorage({
      destination: './uploads/courses',
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, `course-${uniqueSuffix}${extname(file.originalname)}`);
      },
    }),
    fileFilter: (req, file, cb) => {
      if (!file.originalname.match(/\.(jpg|jpeg|png|gif|webp)$/)) {
        return cb(new Error('Only image files are allowed!'), false);
      }
      cb(null, true);
    },
    limits: {
      fileSize: 10 * 1024 * 1024, // 10MB
    },
  }),
)
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Create a new course' })
  @ApiBody({
    description: 'Course creation data with file upload',
    schema: {
      type: 'object',
      properties: {
        'title[az]': { type: 'string', example: 'IT və Kompüter Mühəndisliyi' },
        'title[ru]': { type: 'string', example: 'ИТ и компьютерная инженерия' },
        'description[az]': { type: 'string', example: 'Tam stack veb proqramlaşdırma kursu' },
        'description[ru]': { type: 'string', example: 'Курс веб-разработки полного стека' },
        'slug[az]': { type: 'string', example: 'full-stack-development' },
        'slug[ru]': { type: 'string', example: 'razrabotka-full-stack' },
        duration: { type: 'number', example: 12 },
        'level[az]': { type: 'string', example: 'Başlanğıc' },
        'level[ru]': { type: 'string', example: 'Начальный' },
        ageRange: { type: 'string', example: '9-15' },
        icon: { type: 'string', example: 'computer-icon.png' },
        'newTags[az]': { type: 'array', items: { type: 'string' }, example: ['Scratch', 'HTML'] },
        'newTags[ru]': { type: 'array', items: { type: 'string' }, example: ['Scratch', 'HTML'] },
        published: { type: 'boolean', example: false },
        image: { type: 'string', format: 'binary', description: 'Course image file' },
      },
    },
  })
  create(
    @Body() createCourseDto: CreateCourseDto,
    @UploadedFile() image?: Express.Multer.File,
    @Req() request?: Request,
  ) {
    if (image) {
      createCourseDto.imageUrl = this.generateImageUrl(image.filename, request);
    }
    return this.courseService.create(createCourseDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all courses' })
  findAll(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Query('includeUnpublished') includeUnpublished = false,
  ) {
    return this.courseService.findAll(+page, +limit, includeUnpublished);
  }

  @Get('brief')
  @ApiOperation({ summary: 'Get all courses with brief information' })
  findAllBrief(
    @Query('limit') limit = 10,
    @Query('includeUnpublished') includeUnpublished = false,
    @Query('page') page = 1,
  ) {
    return this.courseService.findAllBrief(+limit, includeUnpublished, +page);
  }

  @Get('slug/:slug')
  @ApiOperation({ summary: 'Get course by slug' })
  findBySlug(@Param('slug') slug: string) {
    return this.courseService.findBySlug(slug);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @ApiOperation({ summary: 'Get a specific course' })
  findOne(@Param('id') id: string) {
    return this.courseService.findOne(id);
  }

  @Patch(':id')
@UseGuards(JwtAuthGuard, RoleGuard)
@Roles(Role.ADMIN, Role.STAFF, Role.CONTENTMANAGER)
@UseInterceptors(
  FileInterceptor('image', {
    storage: diskStorage({
      destination: './uploads/courses',
      filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, `course-${uniqueSuffix}${extname(file.originalname)}`);
      },
    }),
    fileFilter: (req, file, cb) => {
      if (!file.originalname.match(/\.(jpg|jpeg|png|gif|webp)$/)) {
        return cb(new Error('Only image files are allowed!'), false);
      }
      cb(null, true);
    },
    limits: {
      fileSize: 10 * 1024 * 1024, // 10MB
    },
  }),
)
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Update a course' })
  @ApiBody({
    description: 'Course update data with file upload',
    schema: {
      type: 'object',
      properties: {
        'title[az]': { type: 'string', example: 'IT və Kompüter Mühəndisliyi' },
        'title[ru]': { type: 'string', example: 'ИТ и компьютерная инженерия' },
        'description[az]': { type: 'string', example: 'Tam stack veb proqramlaşdırma kursu' },
        'description[ru]': { type: 'string', example: 'Курс веб-разработки полного стека' },
        'slug[az]': { type: 'string', example: 'full-stack-development' },
        'slug[ru]': { type: 'string', example: 'razrabotka-full-stack' },
        duration: { type: 'number', example: 12 },
        'level[az]': { type: 'string', example: 'Başlanğıc' },
        'level[ru]': { type: 'string', example: 'Начальный' },
        ageRange: { type: 'string', example: '9-15' },
        icon: { type: 'string', example: 'computer-icon.png' },
        'newTags[az]': { type: 'array', items: { type: 'string' }, example: ['Scratch', 'HTML'] },
        'newTags[ru]': { type: 'array', items: { type: 'string' }, example: ['Scratch', 'HTML'] },
        published: { type: 'boolean', example: false },
        image: { type: 'string', format: 'binary', description: 'Course image file' },
      },
    },
  })
  update(
    @Param('id') id: string,
    @Body() updateCourseDto: UpdateCourseDto,
    @UploadedFile() image?: Express.Multer.File,
    @Req() request?: Request,
  ) {
    if (image) {
      updateCourseDto.imageUrl = this.generateImageUrl(image.filename, request);
    }
    return this.courseService.update(id, updateCourseDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(Role.ADMIN, Role.STAFF, Role.CONTENTMANAGER)
  @ApiOperation({ summary: 'Delete a course' })
  remove(@Param('id') id: string) {
    return this.courseService.remove(id);
  }
}