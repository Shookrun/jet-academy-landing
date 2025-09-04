import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { Prisma } from '@prisma/client';
import { CreateCourseModuleDto } from './dto/create-course-module.dto';
import {
  AssignModuleDto,
  UpdateCourseModuleDto,
} from './dto/update-course-module.dto';

@Injectable()
export class CourseModuleService {
  constructor(private prisma: PrismaService) {}

  async create(createCourseModuleDto: CreateCourseModuleDto) {
    try {
      const { title, description, content } = createCourseModuleDto;

      return await this.prisma.courseModule.create({
        data: {
          title,
          description,
          content,
        },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new Error(`Failed to create course module: ${error.message}`);
      }
      throw error;
    }
  }

  async findAll(page = 1, limit = 10) {
    try {
      const skip = (page - 1) * limit;

      const [total, items] = await Promise.all([
        this.prisma.courseModule.count(),
        this.prisma.courseModule.findMany({
          skip,
          take: limit,
          include: {
            courses: {
              include: {
                course: {
                  select: {
                    id: true,
                    title: true,
                  },
                },
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
      const module = await this.prisma.courseModule.findUnique({
        where: { id },
        include: {
          courses: {
            include: {
              course: {
                select: {
                  id: true,
                  title: true,
                },
              },
            },
          },
        },
      });

      if (!module) {
        throw new NotFoundException(`Course module with ID ${id} not found`);
      }

      return module;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new Error(`Failed to fetch course module: ${error.message}`);
      }
      throw error;
    }
  }

  async update(id: string, updateCourseModuleDto: UpdateCourseModuleDto) {
    try {
      await this.findOne(id);

      return await this.prisma.courseModule.update({
        where: { id },
        data: updateCourseModuleDto,
        include: {
          courses: {
            include: {
              course: {
                select: {
                  id: true,
                  title: true,
                },
              },
            },
          },
        },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new Error(`Failed to update course module: ${error.message}`);
      }
      throw error;
    }
  }

  async remove(id: string) {
    try {
      const module = await this.findOne(id);

      await this.prisma.courseModule.delete({
        where: { id },
      });

      return module;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new Error(`Failed to delete course module: ${error.message}`);
      }
      throw error;
    }
  }

  async assignToCourse(courseId: string, { moduleId, order }: AssignModuleDto) {
    try {
      const [course, module] = await Promise.all([
        this.prisma.course.findUnique({ where: { id: courseId } }),
        this.prisma.courseModule.findUnique({ where: { id: moduleId } }),
      ]);

      if (!course) {
        throw new NotFoundException(`Course with ID ${courseId} not found`);
      }

      if (!module) {
        throw new NotFoundException(`Module with ID ${moduleId} not found`);
      }

      await this.prisma.$transaction(async (prisma) => {
        await prisma.courseToModule.updateMany({
          where: {
            courseId,
            order: {
              gte: order,
            },
          },
          data: {
            order: {
              increment: 1,
            },
          },
        });

        return await prisma.courseToModule.create({
          data: {
            courseId,
            moduleId,
            order,
          },
        });
      });

      return this.findOne(moduleId);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new Error('This module is already assigned to the course');
        }
        throw new Error(`Failed to assign module to course: ${error.message}`);
      }
      throw error;
    }
  }

  async removeFromCourse(courseId: string, moduleId: string) {
    try {
      const assignment = await this.prisma.courseToModule.findUnique({
        where: {
          courseId_moduleId: {
            courseId,
            moduleId,
          },
        },
      });

      if (!assignment) {
        throw new NotFoundException(`Module assignment not found`);
      }

      await this.prisma.$transaction([
        this.prisma.courseToModule.delete({
          where: {
            courseId_moduleId: {
              courseId,
              moduleId,
            },
          },
        }),
        this.prisma.courseToModule.updateMany({
          where: {
            courseId,
            order: {
              gt: assignment.order,
            },
          },
          data: {
            order: {
              decrement: 1,
            },
          },
        }),
      ]);

      return this.findOne(moduleId);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new Error(
          `Failed to remove module from course: ${error.message}`,
        );
      }
      throw error;
    }
  }

  async updateModuleOrder(
    courseId: string,
    moduleId: string,
    newOrder: number,
  ) {
    try {
      const assignment = await this.prisma.courseToModule.findUnique({
        where: {
          courseId_moduleId: {
            courseId,
            moduleId,
          },
        },
      });

      if (!assignment) {
        throw new NotFoundException(`Module assignment not found`);
      }

      if (assignment.order === newOrder) {
        return this.findOne(moduleId);
      }

      await this.prisma.$transaction(async (prisma) => {
        if (newOrder > assignment.order) {
          await prisma.courseToModule.updateMany({
            where: {
              courseId,
              order: {
                gt: assignment.order,
                lte: newOrder,
              },
            },
            data: {
              order: {
                decrement: 1,
              },
            },
          });
        } else {
          await prisma.courseToModule.updateMany({
            where: {
              courseId,
              order: {
                gte: newOrder,
                lt: assignment.order,
              },
            },
            data: {
              order: {
                increment: 1,
              },
            },
          });
        }

        await prisma.courseToModule.update({
          where: {
            courseId_moduleId: {
              courseId,
              moduleId,
            },
          },
          data: {
            order: newOrder,
          },
        });
      });

      return this.findOne(moduleId);
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new Error(`Failed to update module order: ${error.message}`);
      }
      throw error;
    }
  }
}
