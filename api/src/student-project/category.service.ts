import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateStudentProjectCategoryDto } from './dto/create-category.dto';
import { UpdateStudentProjectCategoryDto } from './dto/update-category.dto';
import { Prisma } from '@prisma/client';

@Injectable()
export class StudentProjectCategoryService {
  constructor(private prisma: PrismaService) {}

  async create(createCategoryDto: CreateStudentProjectCategoryDto) {
    try {
      return await this.prisma.studentProjectsCategory.create({
        data: createCategoryDto,
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new Error(`Failed to create category: ${error.message}`);
      }
      throw error;
    }
  }

  async findAll(page = 1, limit = 10) {
    try {
      const skip = (page - 1) * limit;

      const [total, items] = await Promise.all([
        this.prisma.studentProjectsCategory.count(),
        this.prisma.studentProjectsCategory.findMany({
          skip,
          take: limit,
          orderBy: { createdAt: 'desc' },
          include: {
            _count: {
              select: { projects: true },
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
      const category = await this.prisma.studentProjectsCategory.findUnique({
        where: { id },
        include: {
          projects: true,
          _count: {
            select: { projects: true },
          },
        },
      });

      if (!category) {
        throw new NotFoundException(`Category with ID ${id} not found`);
      }

      return category;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new Error(`Failed to fetch category: ${error.message}`);
      }
      throw error;
    }
  }

  async update(id: string, updateCategoryDto: UpdateStudentProjectCategoryDto) {
    try {
      await this.findOne(id);

      return await this.prisma.studentProjectsCategory.update({
        where: { id },
        data: updateCategoryDto,
        include: {
          _count: {
            select: { projects: true },
          },
        },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new Error(`Failed to update category: ${error.message}`);
      }
      throw error;
    }
  }

  async remove(id: string) {
    try {
      await this.findOne(id);

      return await this.prisma.studentProjectsCategory.delete({
        where: { id },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new Error(`Failed to delete category: ${error.message}`);
      }
      throw error;
    }
  }
}
