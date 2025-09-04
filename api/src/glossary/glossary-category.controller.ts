import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { GlossaryCategoryService } from './glossary-category.service';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { RoleGuard } from '../guards/role.guard';
import { Roles } from '../decorators/roles.decorator';
import { Role } from '@prisma/client';
import { CreateGlossaryCategoryDto } from './dto/create-glossary-category.dto';
import { UpdateGlossaryCategoryDto } from './dto/update-glossary-category.dto';

@ApiTags('Glossary Categories')
@Controller('glossary-categories')
export class GlossaryCategoryController {
  constructor(
    private readonly glossaryCategoryService: GlossaryCategoryService,
  ) {}

  @Post()
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(Role.ADMIN, Role.STAFF, Role.CONTENTMANAGER)
  @ApiOperation({ summary: 'Create a new glossary category' })
  create(@Body() createGlossaryCategoryDto: CreateGlossaryCategoryDto) {
    return this.glossaryCategoryService.create(createGlossaryCategoryDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all glossary categories' })
  findAll() {
    return this.glossaryCategoryService.findAll();
  }

  @Get('slug/:slug')
  @ApiOperation({ summary: 'Get glossary category by slug' })
  findBySlug(@Param('slug') slug: string) {
    return this.glossaryCategoryService.findBySlug(slug);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a specific glossary category' })
  findOne(@Param('id') id: string) {
    return this.glossaryCategoryService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(Role.ADMIN, Role.STAFF, Role.CONTENTMANAGER)
  @ApiOperation({ summary: 'Update a glossary category' })
  update(
    @Param('id') id: string,
    @Body() updateGlossaryCategoryDto: UpdateGlossaryCategoryDto,
  ) {
    return this.glossaryCategoryService.update(id, updateGlossaryCategoryDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(Role.ADMIN, Role.STAFF, Role.CONTENTMANAGER)
  @ApiOperation({ summary: 'Delete a glossary category' })
  remove(@Param('id') id: string) {
    return this.glossaryCategoryService.remove(id);
  }
}
