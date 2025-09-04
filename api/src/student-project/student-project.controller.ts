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
import { StudentProjectService } from './student-project.service';
import { CreateStudentProjectDto } from './dto/create-student-project.dto';
import { UpdateStudentProjectDto } from './dto/update-student-project.dto';
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
import { Prisma, Role } from '@prisma/client';

@ApiTags('Student Projects')
@Controller('student-projects')
@ApiBearerAuth('JWT-auth')
export class StudentProjectController {
  constructor(private readonly studentProjectService: StudentProjectService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(Role.ADMIN, Role.STAFF, Role.CONTENTMANAGER)
  @ApiOperation({ summary: 'Create a new student project' })
  @ApiResponse({ status: 201, description: 'Project created successfully' })
  create(@Body() createStudentProjectDto: CreateStudentProjectDto) {
    return this.studentProjectService.create(createStudentProjectDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all student projects' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'order', required: false, enum: Prisma.SortOrder })
  findAll(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Query('order') order = 'asc',
  ) {
    return this.studentProjectService.findAll(+page, +limit, undefined, order);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @ApiOperation({ summary: 'Get a specific student project' })
  findOne(@Param('id') id: string) {
    return this.studentProjectService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(Role.ADMIN, Role.STAFF, Role.CONTENTMANAGER)
  @ApiOperation({ summary: 'Update a student project' })
  update(
    @Param('id') id: string,
    @Body() updateStudentProjectDto: UpdateStudentProjectDto,
  ) {
    return this.studentProjectService.update(id, updateStudentProjectDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(Role.ADMIN, Role.STAFF, Role.CONTENTMANAGER)
  @ApiOperation({ summary: 'Delete a student project' })
  remove(@Param('id') id: string) {
    return this.studentProjectService.remove(id);
  }
}
