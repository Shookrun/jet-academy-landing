/* eslint-disable @typescript-eslint/no-unused-vars */
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateStudentProjectDto } from './dto/create-student-project.dto';
import { UpdateStudentProjectDto } from './dto/update-student-project.dto';
import { PrismaService } from 'src/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class StudentProjectService {
  constructor(private prisma: PrismaService) {}

  private parseYoutubeUrl(url: string): string {
    try {
      const urlObj = new URL(url);

      if (urlObj.hostname.includes('youtube.com')) {
        if (urlObj.pathname.startsWith('/shorts/')) {
          const videoId = urlObj.pathname.split('/shorts/')[1];
          return videoId.split('?')[0];
        }

        return urlObj.searchParams.get('v') || '';
      } else if (urlObj.hostname === 'youtu.be') {
        return urlObj.pathname.slice(1);
      }

      if (url.match(/^[a-zA-Z0-9_-]{11}$/)) {
        return url;
      }

      console.warn('Could not parse YouTube URL:', url);
      return '';
    } catch (error) {
      console.error('Failed to parse YouTube URL:', error, url);

      const watchMatch = url.match(/[?&]v=([a-zA-Z0-9_-]{11})/);
      if (watchMatch && watchMatch[1]) return watchMatch[1];

      const shortMatch = url.match(/\/shorts\/([a-zA-Z0-9_-]{11})/);
      if (shortMatch && shortMatch[1]) return shortMatch[1];

      const youtuBeMatch = url.match(/youtu\.be\/([a-zA-Z0-9_-]{11})/);
      if (youtuBeMatch && youtuBeMatch[1]) return youtuBeMatch[1];

      return '';
    }
  }

  private getYoutubeThumbnailUrl(videoId: string): string {
    return `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;
  }

  private normalizeYoutubeUrl(videoId: string): string {
    if (!videoId) return '';
    return `https://www.youtube.com/watch?v=${videoId}`;
  }

  private async validateCategory(categoryId: string) {
    const category = await this.prisma.studentProjectsCategory.findUnique({
      where: { id: categoryId },
    });

    if (!category) {
      throw new NotFoundException(`Category with ID ${categoryId} not found`);
    }

    return category;
  }

  async create(createStudentProjectDto: CreateStudentProjectDto) {
    try {
      await this.validateCategory(createStudentProjectDto.categoryId);

      const totalProjects = await this.prisma.studentProjects.count();
      const videoId = this.parseYoutubeUrl(createStudentProjectDto.link);
      const imageUrl = this.getYoutubeThumbnailUrl(videoId);
      const normalizedLink = this.normalizeYoutubeUrl(videoId);

      return await this.prisma.studentProjects.create({
        data: {
          ...createStudentProjectDto,
          link: normalizedLink || createStudentProjectDto.link,
          imageUrl,
          order: totalProjects,
        },
        include: {
          category: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new Error(`Failed to create student project: ${error.message}`);
      }
      throw error;
    }
  }

  async findAll(page = 1, limit = 10, categoryId?: string, order = 'asc') {
    try {
      const skip = (page - 1) * limit;
      const whereClause = categoryId ? { categoryId } : {};

      const [total, items] = await Promise.all([
        this.prisma.studentProjects.count({
          where: whereClause,
        }),
        this.prisma.studentProjects.findMany({
          where: whereClause,
          skip,
          take: limit,
          orderBy: { order: Prisma.SortOrder[order] },
          include: {
            category: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        }),
      ]);

      return {
        items,
        meta: {
          total,
          page,
          limit,
          totalPages: Math.ceil(total / limit),
        },
      };
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        console.error('Database query failed:', error);
      }
      return {
        items: [],
        meta: {
          total: 0,
          page,
          limit,
          totalPages: 0,
        },
      };
    }
  }

  async findOne(id: string) {
    try {
      const project = await this.prisma.studentProjects.findUnique({
        where: { id },
        include: {
          category: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });

      if (!project) {
        throw new NotFoundException(`Student project with ID ${id} not found`);
      }

      return project;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new Error(`Failed to fetch student project: ${error.message}`);
      }
      throw error;
    }
  }

  async update(id: string, updateStudentProjectDto: UpdateStudentProjectDto) {
    try {
      const existingProject = await this.findOne(id);

      const {
        id: _id,
        category,
        order,
        createdAt,
        updatedAt,
        ...updateData
      } = updateStudentProjectDto as any;


      if (updateData.categoryId) {
        await this.validateCategory(updateData.categoryId);
      }

      let imageUrl = undefined;
      let normalizedLink = undefined;

      if (updateData.link && updateData.link !== existingProject.link) {
        const videoId = this.parseYoutubeUrl(updateData.link);

        if (videoId) {
          imageUrl = this.getYoutubeThumbnailUrl(videoId);
          normalizedLink = this.normalizeYoutubeUrl(videoId);
        } else {
          console.warn('Failed to parse video ID, keeping original link');
        }
      }

      if (typeof order === 'number') {
      }

      const updateResult = await this.prisma.studentProjects.update({
        where: { id },
        data: {
          ...updateData,
          ...(normalizedLink && { link: normalizedLink }),
          ...(imageUrl && { imageUrl }),
        },
        include: {
          category: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });

      return updateResult;
    } catch (error) {
      console.error('Update error:', error);
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new Error(`Failed to update student project: ${error.message}`);
      }
      throw error;
    }
  }

  async remove(id: string) {
    try {
      const project = await this.findOne(id);

      await this.prisma.$transaction([
        this.prisma.studentProjects.delete({
          where: { id },
        }),

        this.prisma.studentProjects.updateMany({
          where: {
            order: {
              gt: project.order,
            },
          },
          data: {
            order: {
              decrement: 1,
            },
          },
        }),
      ]);

      const remainingProjects = await this.prisma.studentProjects.findMany({
        orderBy: { order: 'asc' },
      });

      const needsFix = remainingProjects.some((p, index) => p.order !== index);

      if (needsFix) {
        await this.prisma.$transaction(
          remainingProjects.map((p, index) =>
            this.prisma.studentProjects.update({
              where: { id: p.id },
              data: { order: index },
            }),
          ),
        );
      }

      return project;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new Error(`Failed to delete student project: ${error.message}`);
      }
      throw error;
    }
  }
}
