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
import { GlossaryService } from './glossary.service';
import { CreateGlossaryDto } from './dto/create-glossary.dto';
import { UpdateGlossaryDto } from './dto/update-glossary.dto';
import { ApiTags, ApiOperation, ApiParam } from '@nestjs/swagger';
import { JwtAuthGuard } from '../guards/jwt-auth.guard';
import { RoleGuard } from '../guards/role.guard';
import { Roles } from '../decorators/roles.decorator';
import { Role } from '@prisma/client';

@ApiTags('Glossary')
@Controller('glossary')
export class GlossaryController {
  constructor(private readonly glossaryService: GlossaryService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(Role.ADMIN, Role.STAFF, Role.CONTENTMANAGER)
  @ApiOperation({ summary: 'Create a new glossary term' })
  create(@Body() createGlossaryDto: CreateGlossaryDto) {
    return this.glossaryService.create(createGlossaryDto);
  }

  @Get()
  @ApiOperation({ summary: 'Get all glossary terms' })
  @ApiParam({
    name: 'letter',
    required: false,
    description: 'Filter glossary terms by the first letter',
  })
  findAll(
    @Query('letter') letter: string,
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Query('includeUnpublished') includeUnpublished = false,
  ) {
    return this.glossaryService.findAll(
      +page,
      +limit,
      includeUnpublished,
      letter,
    );
  }
  @Get('brief')
  @ApiOperation({ summary: 'Get all glossary terms with brief information' })
  findAllBrief(
    @Query('limit') limit = 10,
    @Query('includeUnpublished') includeUnpublished = false,
    @Query('page') page = 1,
  ) {
    return this.glossaryService.findAllBrief(+limit, includeUnpublished, +page);
  }

  @Get('search')
  @ApiOperation({ summary: 'Search glossary terms' })
  search(
    @Query('q') query: string,
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ) {
    return this.glossaryService.searchGlossary(query, +page, +limit);
  }

  @Get('category/:categoryId')
  @ApiOperation({ summary: 'Get glossary terms by category' })
  findByCategory(
    @Param('categoryId') categoryId: string,
    @Query('page') page = 1,
    @Query('limit') limit = 10,
  ) {
    return this.glossaryService.findByCategory(categoryId, +page, +limit);
  }

  @Get('slug/:slug')
  @ApiOperation({ summary: 'Get glossary term by slug' })
  findBySlug(@Param('slug') slug: string) {
    return this.glossaryService.findBySlug(slug);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @ApiOperation({ summary: 'Get a specific glossary term' })
  findOne(@Param('id') id: string) {
    return this.glossaryService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(Role.ADMIN, Role.STAFF, Role.CONTENTMANAGER)
  @ApiOperation({ summary: 'Update a glossary term' })
  update(
    @Param('id') id: string,
    @Body() updateGlossaryDto: UpdateGlossaryDto,
  ) {
    return this.glossaryService.update(id, updateGlossaryDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(Role.ADMIN, Role.STAFF, Role.CONTENTMANAGER)
  @ApiOperation({ summary: 'Delete a glossary term' })
  remove(@Param('id') id: string) {
    return this.glossaryService.remove(id);
  }
}
