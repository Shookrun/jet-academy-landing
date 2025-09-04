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
import { CourseModuleService } from './course-module.service';
import { CreateCourseModuleDto } from './dto/create-course-module.dto';
import {
  AssignModuleDto,
  UpdateCourseModuleDto,
} from './dto/update-course-module.dto';
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

@ApiTags('Course Modules')
@Controller('course-modules')
@ApiBearerAuth('JWT-auth')
export class CourseModuleController {
  constructor(private readonly courseModuleService: CourseModuleService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(Role.ADMIN, Role.STAFF, Role.CONTENTMANAGER)
  @ApiOperation({ summary: 'Create a new course module' })
  @ApiResponse({
    status: 201,
    description: 'Course module created successfully',
  })
  create(@Body() createCourseModuleDto: CreateCourseModuleDto) {
    return this.courseModuleService.create(createCourseModuleDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all course modules' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  findAll(@Query('page') page = 1, @Query('limit') limit = 10) {
    return this.courseModuleService.findAll(+page, +limit);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific course module' })
  findOne(@Param('id') id: string) {
    return this.courseModuleService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(Role.ADMIN, Role.STAFF, Role.CONTENTMANAGER)
  @ApiOperation({ summary: 'Update a course module' })
  update(
    @Param('id') id: string,
    @Body() updateCourseModuleDto: UpdateCourseModuleDto,
  ) {
    return this.courseModuleService.update(id, updateCourseModuleDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(Role.ADMIN, Role.STAFF, Role.CONTENTMANAGER)
  @ApiOperation({ summary: 'Delete a course module' })
  remove(@Param('id') id: string) {
    return this.courseModuleService.remove(id);
  }

  @Post('assign/:courseId')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(Role.ADMIN, Role.STAFF, Role.CONTENTMANAGER)
  @ApiOperation({ summary: 'Assign a module to a course' })
  @ApiResponse({
    status: 201,
    description: 'Module assigned to course successfully',
  })
  assignToCourse(
    @Param('courseId') courseId: string,
    @Body() assignModuleDto: AssignModuleDto,
  ) {
    return this.courseModuleService.assignToCourse(courseId, assignModuleDto);
  }

  @Delete('assign/:courseId/:moduleId')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(Role.ADMIN, Role.STAFF, Role.CONTENTMANAGER)
  @ApiOperation({ summary: 'Remove a module from a course' })
  removeFromCourse(
    @Param('courseId') courseId: string,
    @Param('moduleId') moduleId: string,
  ) {
    return this.courseModuleService.removeFromCourse(courseId, moduleId);
  }

  @Patch('assign/:courseId/:moduleId/order/:order')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(Role.ADMIN, Role.STAFF, Role.CONTENTMANAGER)
  @ApiOperation({ summary: 'Update module order in a course' })
  updateModuleOrder(
    @Param('courseId') courseId: string,
    @Param('moduleId') moduleId: string,
    @Param('order') order: string,
  ) {
    return this.courseModuleService.updateModuleOrder(
      courseId,
      moduleId,
      +order,
    );
  }
}
