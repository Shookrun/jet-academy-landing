import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { Prisma } from '@prisma/client';
import { CreateCourseDto } from './dto/create-course.dto';
import { UpdateCourseDto } from './dto/update-course.dto';

@Injectable()
export class CourseService {
  constructor(private prisma: PrismaService) {}

  private processMultilingualFields(dto: any) {
    const multilingualFields = [
      'title',
      'description',
      'shortDescription',
      'slug',
      'level',
      'newTags',
    ];
    const processedData: any = { ...dto };
    const result: any = {};

    multilingualFields.forEach((field) => {
      if (dto[`${field}[az]`] || dto[`${field}[en]`]) {
        result[field] = {
          az: dto[`${field}[az]`],
          en: dto[`${field}[en]`],
        };
        delete processedData[`${field}[az]`];
        delete processedData[`${field}[en]`];
      }
    });

    if (processedData.duration) {
      processedData.duration = parseInt(processedData.duration.toString(), 10);
    }

    if (processedData.published !== undefined) {
      processedData.published = processedData.published === 'true' || processedData.published === true;
    }

    return { ...processedData, ...result };
  }

  private readonly includeRelations = {
    modules: {
      include: {
        module: true,
      },
      orderBy: {
        order: Prisma.SortOrder.asc,
      },
    },
    teachers: {
      include: {
        teacher: true,
        courseTeacher: true,
      },
    },
    eligibility: {
      include: {
        eligibility: true,
      },
    },
  };

  async create(createCourseDto: CreateCourseDto) {
    try {
      const processedData = this.processMultilingualFields(createCourseDto);

      return await this.prisma.course.create({
        data: processedData,
        include: this.includeRelations,
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new Error(`Failed to create course: ${error.message}`);
      }
      throw error;
    }
  }

  async findAll(page = 1, limit = 10, includeUnpublished = false) {
    try {
      const skip = (page - 1) * limit;
      const whereClause = includeUnpublished ? {} : { published: true };

      const [total, items] = await Promise.all([
        this.prisma.course.count({
          where: whereClause,
        }),
        this.prisma.course.findMany({
          where: whereClause,
          skip,
          take: limit,
          include: this.includeRelations,
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
      console.error('Database query failed:', error);
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

  async findAllBrief(limit = 10, includeUnpublished = false, page = 1) {
    try {
      const skip = (page - 1) * limit;
      const whereClause = includeUnpublished ? {} : { published: true };

      const [total, items] = await Promise.all([
        this.prisma.course.count({
          where: whereClause,
        }),
        this.prisma.course.findMany({
          where: whereClause,
          skip,
          take: limit,
          select: {
            id: true,
            title: true,
            slug: true,
            level: true,
            duration: true,
            icon: true,
            published: true,
            imageUrl: true,
            ageRange: true,
            newTags: true,
            tag: true,

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
      console.error('Database query failed:', error);
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
    const course = await this.prisma.course.findUnique({
      where: { id },
      include: this.includeRelations,
    });

    if (!course) {
      throw new NotFoundException(`Course with ID ${id} not found`);
    }

    return course;
  }

  async update(id: string, updateCourseDto: UpdateCourseDto) {
    try {
      const existingCourse = await this.findOne(id);
      const processedData = this.processMultilingualFields(updateCourseDto);

      ['title', 'description', 'shortDescription', 'slug', 'level', 'newTags'].forEach((field) => {
        if (processedData[field]) {
          processedData[field] = {
            ...(existingCourse[field] as any),
            ...processedData[field],
          };
        }
      });

      return await this.prisma.course.update({
        where: { id },
        data: processedData,
        include: this.includeRelations,
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new Error(`Failed to update course: ${error.message}`);
      }
      throw error;
    }
  }

  async remove(id: string) {
    try {
      await this.findOne(id);
      await this.prisma.course.delete({ where: { id } });
      return { id };
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new Error(`Failed to delete course: ${error.message}`);
      }
      throw error;
    }
  }

  async findBySlug(slug: string) {
    try {
      const courses = await this.prisma.course.findMany({
        where: {
          published: true,
        },
        include: this.includeRelations,
      });

      const course = courses.find((course) => {
        const slugData = course.slug as any;
        return slugData?.az === slug || slugData?.en === slug;
      });

      if (!course) {
        throw new NotFoundException(`Course with slug ${slug} not found`);
      }

      return course;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      throw new Error(`Failed to find course by slug: ${error.message}`);
    }
  }
}