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
  Request,
  UploadedFile,
  UseInterceptors,
  ParseIntPipe,
  ParseBoolPipe,
} from '@nestjs/common';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiBearerAuth,
  ApiBody,
  ApiConsumes,
} from '@nestjs/swagger';
import { JwtAuthGuard } from 'src/guards/jwt-auth.guard';
import { RoleGuard } from 'src/guards/role.guard';
import { Roles } from 'src/decorators/roles.decorator';
import { Role, PostType } from '@prisma/client';
import { FileInterceptor } from '@nestjs/platform-express';
import { SharpPipe } from 'src/pipes/sharp.pipe';
import { multerConfig } from 'src/multer/config';

@ApiTags('Posts')
@Controller('posts')
export class PostController {
  constructor(private readonly postService: PostService) {}

  @Post()
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(Role.ADMIN, Role.AUTHOR, Role.CONTENTMANAGER)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Create post',
    description: 'Creates a new post',
  })
  @ApiBody({
    type: CreatePostDto,
    description: 'Post creation payload',
  })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('image', multerConfig))
  @ApiResponse({
    status: 201,
    description: 'Post created successfully',
  })
  @ApiResponse({ status: 400, description: 'Bad request - Invalid data' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async create(
    @Body() createPostDto: CreatePostDto,
    @UploadedFile(new SharpPipe('post')) imageUrl: string,
    @Request() req,
  ) {
    return this.postService.create(
      {
        ...createPostDto,
        imageUrl,
      },
      req.user.id,
    );
  }

  @Get()
  @ApiOperation({
    summary: 'Get all posts',
    description: 'Retrieves a paginated list of all posts',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Page number for pagination',
    example: 1,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Number of items per page',
    example: 10,
  })
  @ApiQuery({
    name: 'includeUnpublished',
    required: false,
    type: Boolean,
    description:
      'Whether to include unpublished posts (requires admin/author role)',
    example: false,
  })
  @ApiQuery({
    name: 'includeBlogs',
    required: false,
    type: Boolean,
    description: 'Whether to include blog posts (requires admin/author role)',
    example: false,
  })
  @ApiResponse({
    status: 200,
    description: 'List of posts retrieved successfully',
  })
  async findAll(
    @Query('page', ParseIntPipe) page = 1,
    @Query('limit', ParseIntPipe) limit = 10,
    @Query('includeUnpublished', new ParseBoolPipe({ optional: true }))
    includeUnpublished = false,
    @Query('postType') postType = null,
    @Query('includeBlogs', new ParseBoolPipe({ optional: true }))
    includeBlogs = false,
  ) {
    return this.postService.findAll(
      page,
      limit,
      includeUnpublished,
      postType,
      includeBlogs,
    );
  }

  @Get('type/:type')
  @ApiOperation({
    summary: 'Get posts by type',
    description: 'Retrieves posts filtered by type (BLOG, NEWS, EVENT)',
  })
  @ApiParam({
    name: 'type',
    required: true,
    description: 'Type of posts to retrieve',
    enum: PostType,
  })
  @ApiQuery({
    name: 'page',
    required: false,
    type: Number,
    description: 'Page number for pagination',
    example: 1,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    type: Number,
    description: 'Number of items per page',
    example: 10,
  })
  @ApiQuery({
    name: 'includeUnpublished',
    required: false,
    type: Boolean,
    description:
      'Whether to include unpublished posts (requires admin/author role)',
    example: false,
  })
  @ApiResponse({
    status: 200,
    description: 'List of posts retrieved successfully',
  })
  async getPostsByType(
    @Param('type') type: PostType,
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Query('includeUnpublished') includeUnpublished = false,
  ) {
    return this.postService.getPostsByType(
      type,
      +page,
      +limit,
      includeUnpublished,
    );
  }

  @Get('slug/:slug')
  @ApiOperation({
    summary: 'Get post by slug',
    description: 'Retrieves a specific post by its slug',
  })
  @ApiParam({
    name: 'slug',
    required: true,
    description: 'Slug of the post to retrieve',
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: 'Post retrieved successfully',
  })
  @ApiResponse({ status: 404, description: 'Post not found' })
  async findBySlug(@Param('slug') slug: string) {
    return this.postService.findBySlug(slug);
  }

  @Get(':id')
  @ApiOperation({
    summary: 'Get post by ID',
    description: 'Retrieves a specific post by its ID',
  })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'ID of the post to retrieve',
    type: String,
  })
  @ApiResponse({
    status: 200,
    description: 'Post retrieved successfully',
  })
  @ApiResponse({ status: 404, description: 'Post not found' })
  async findOne(@Param('id') id: string) {
    return this.postService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(Role.ADMIN, Role.AUTHOR, Role.CONTENTMANAGER)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Update post',
    description: 'Updates a specific post',
  })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'ID of the post to update',
    type: String,
  })
  @ApiBody({
    type: UpdatePostDto,
    description: 'Post update payload',
  })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('image', multerConfig))
  @ApiResponse({
    status: 200,
    description: 'Post updated successfully',
  })
  @ApiResponse({ status: 400, description: 'Bad request - Invalid data' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 404, description: 'Post not found' })
  async update(
    @Param('id') id: string,
    @Body() updatePostDto: UpdatePostDto,
    @UploadedFile(new SharpPipe('post')) imageUrl?: string,
  ) {
    return this.postService.update(id, {
      ...updatePostDto,
      ...(imageUrl && { imageUrl }),
    });
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RoleGuard)
  @Roles(Role.ADMIN, Role.CONTENTMANAGER)
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Delete post',
    description: 'Deletes a specific post',
  })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'ID of the post to delete',
    type: String,
  })
  @ApiResponse({ status: 200, description: 'Post deleted successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({
    status: 403,
    description: 'Forbidden - Insufficient permissions',
  })
  @ApiResponse({ status: 404, description: 'Post not found' })
  async remove(@Param('id') id: string) {
    return this.postService.remove(id);
  }
}
