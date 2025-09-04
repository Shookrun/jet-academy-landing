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
} from '@nestjs/common';
import { CourseTeacherService } from './course-teacher.service';
import { CreateCourseTeacherDto } from './dto/create-course-teacher.dto';
import { UpdateCourseTeacherDto } from './dto/update-course-teacher.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { RoleGuard } from '../guards/role.guard';
import { Roles } from '../decorators/roles.decorator';
import { Role } from '@prisma/client';

@ApiTags('Course Teacher')
@Controller('course-teacher')
@ApiBearerAuth('JWT-auth')
export class CourseTeacherController {
  constructor(private readonly courseTeacherService: CourseTeacherService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(Role.ADMIN, Role.STAFF, Role.CONTENTMANAGER)
  @ApiOperation({ summary: 'Create a new course teacher role' })
  @ApiResponse({
    status: 201,
    description: 'Course teacher role created successfully',
  })
  create(@Body() createCourseTeacherDto: CreateCourseTeacherDto) {
    return this.courseTeacherService.create(createCourseTeacherDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all course teacher roles' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  findAll(@Query('page') page = 1, @Query('limit') limit = 10) {
    return this.courseTeacherService.findAll(+page, +limit);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific course teacher role' })
  findOne(@Param('id') id: string) {
    return this.courseTeacherService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(Role.ADMIN, Role.STAFF, Role.CONTENTMANAGER)
  @ApiOperation({ summary: 'Update a course teacher role' })
  update(
    @Param('id') id: string,
    @Body() updateCourseTeacherDto: UpdateCourseTeacherDto,
  ) {
    return this.courseTeacherService.update(id, updateCourseTeacherDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(Role.ADMIN, Role.STAFF, Role.CONTENTMANAGER)
  @ApiOperation({ summary: 'Delete a course teacher role' })
  remove(@Param('id') id: string) {
    return this.courseTeacherService.remove(id);
  }

  @Post(':id/courses/:courseId/team/:teamId')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(Role.ADMIN, Role.STAFF, Role.CONTENTMANAGER)
  @ApiOperation({
    summary: 'Assign a team member to a course with a specific role',
  })
  assignTeacherToCourse(
    @Param('id') id: string,
    @Param('courseId') courseId: string,
    @Param('teamId') teamId: string,
    @Body('position') position?: string,
  ) {
    return this.courseTeacherService.assignTeacherToCourse(
      id,
      courseId,
      teamId,
      position,
    );
  }

  @Delete(':id/courses/:courseId/team/:teamId')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(Role.ADMIN, Role.STAFF, Role.CONTENTMANAGER)
  @ApiOperation({ summary: 'Remove a team member from a course role' })
  removeTeacherFromCourse(
    @Param('id') id: string,
    @Param('courseId') courseId: string,
    @Param('teamId') teamId: string,
  ) {
    return this.courseTeacherService.removeTeacherFromCourse(
      id,
      courseId,
      teamId,
    );
  }
}
