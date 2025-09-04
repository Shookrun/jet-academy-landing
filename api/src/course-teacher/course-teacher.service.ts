import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { Prisma } from '@prisma/client';
import { CreateCourseTeacherDto } from './dto/create-course-teacher.dto';
import { UpdateCourseTeacherDto } from './dto/update-course-teacher.dto';

@Injectable()
export class CourseTeacherService {
  constructor(private prisma: PrismaService) {}

  async validateTeam(teamId: string) {
    const team = await this.prisma.team.findUnique({
      where: { id: teamId },
    });

    if (!team) {
      throw new NotFoundException(`Team member with ID ${teamId} not found`);
    }

    return team;
  }

  async create(createCourseTeacherDto: CreateCourseTeacherDto) {
    try {
      return await this.prisma.courseTeacher.create({
        data: createCourseTeacherDto,
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new Error(
          `Failed to create course teacher role: ${error.message}`,
        );
      }
      throw error;
    }
  }

  async findAll(page = 1, limit = 10) {
    try {
      const skip = (page - 1) * limit;

      const [total, items] = await Promise.all([
        this.prisma.courseTeacher.count(),
        this.prisma.courseTeacher.findMany({
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
                teacher: {
                  select: {
                    id: true,
                    fullName: true,
                    imageUrl: true,
                    bio: true,
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
      const courseTeacher = await this.prisma.courseTeacher.findUnique({
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
              teacher: {
                select: {
                  id: true,
                  fullName: true,
                  imageUrl: true,
                  bio: true,
                },
              },
            },
          },
        },
      });

      if (!courseTeacher) {
        throw new NotFoundException(
          `Course teacher role with ID ${id} not found`,
        );
      }

      return courseTeacher;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new Error(
          `Failed to fetch course teacher role: ${error.message}`,
        );
      }
      throw error;
    }
  }

  async update(id: string, updateCourseTeacherDto: UpdateCourseTeacherDto) {
    try {
      await this.findOne(id);

      return await this.prisma.courseTeacher.update({
        where: { id },
        data: updateCourseTeacherDto,
        include: {
          courses: {
            include: {
              course: {
                select: {
                  id: true,
                  title: true,
                },
              },
              teacher: {
                select: {
                  id: true,
                  fullName: true,
                  imageUrl: true,
                  bio: true,
                },
              },
            },
          },
        },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new Error(
          `Failed to update course teacher role: ${error.message}`,
        );
      }
      throw error;
    }
  }

  async remove(id: string) {
    try {
      const courseTeacher = await this.findOne(id);

      await this.prisma.courseTeacher.delete({
        where: { id },
      });

      return courseTeacher;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new Error(
          `Failed to delete course teacher role: ${error.message}`,
        );
      }
      throw error;
    }
  }

  async assignTeacherToCourse(
    courseTeacherId: string,
    courseId: string,
    teamId: string,
    position?: string,
  ) {
    try {
      await this.validateTeam(teamId);

      return await this.prisma.courseToTeacher.create({
        data: {
          courseId,
          teacherId: teamId,
          courseTeacherId,
          position,
        },
        include: {
          course: {
            select: {
              id: true,
              title: true,
            },
          },
          teacher: {
            select: {
              id: true,
              fullName: true,
              imageUrl: true,
              bio: true,
            },
          },
          courseTeacher: true,
        },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        if (error.code === 'P2002') {
          throw new Error(
            'This team member is already assigned to the course with this role',
          );
        }
        throw new Error(
          `Failed to assign team member to course: ${error.message}`,
        );
      }
      throw error;
    }
  }

  async removeTeacherFromCourse(
    courseTeacherId: string,
    courseId: string,
    teamId: string,
  ) {
    try {
      return await this.prisma.courseToTeacher.delete({
        where: {
          courseId_teacherId_courseTeacherId: {
            courseId,
            teacherId: teamId,
            courseTeacherId,
          },
        },
        include: {
          course: {
            select: {
              id: true,
              title: true,
            },
          },
          teacher: {
            select: {
              id: true,
              fullName: true,
              imageUrl: true,
              bio: true,
            },
          },
          courseTeacher: true,
        },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new Error(
          `Failed to remove team member from course: ${error.message}`,
        );
      }
      throw error;
    }
  }
}
