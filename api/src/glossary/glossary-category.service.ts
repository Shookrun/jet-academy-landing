import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { Prisma } from '@prisma/client';
import { CreateGlossaryCategoryDto } from './dto/create-glossary-category.dto';
import { UpdateGlossaryCategoryDto } from './dto/update-glossary-category.dto';

@Injectable()
export class GlossaryCategoryService {
  constructor(private prisma: PrismaService) {}

  private processMultilingualFields(dto: any) {
    const multilingualFields = ['name', 'description', 'slug'];
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

    return { ...processedData, ...result };
  }

  async create(createGlossaryCategoryDto: CreateGlossaryCategoryDto) {
    try {
      const processedData = this.processMultilingualFields(
        createGlossaryCategoryDto,
      );

      return await this.prisma.glossaryCategory.create({
        data: processedData,
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new Error(`Failed to create glossary category: ${error.message}`);
      }
      throw error;
    }
  }

  async findAll() {
    try {
      return await this.prisma.glossaryCategory.findMany({
        orderBy: {
          order: 'asc',
        },
        include: {
          _count: {
            select: {
              glossaryTerms: true,
            },
          },
        },
      });
    } catch (error) {
      console.error('Database query failed:', error);
      return [];
    }
  }

  async findOne(id: string) {
    const category = await this.prisma.glossaryCategory.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            glossaryTerms: true,
          },
        },
      },
    });

    if (!category) {
      throw new NotFoundException(`Glossary category with ID ${id} not found`);
    }

    return category;
  }

  async update(
    id: string,
    updateGlossaryCategoryDto: UpdateGlossaryCategoryDto,
  ) {
    try {
      const existingCategory = await this.findOne(id);
      const processedData = this.processMultilingualFields(
        updateGlossaryCategoryDto,
      );

      ['name', 'description', 'slug'].forEach((field) => {
        if (processedData[field]) {
          processedData[field] = {
            ...(existingCategory[field] as any),
            ...processedData[field],
          };
        }
      });

      return await this.prisma.glossaryCategory.update({
        where: { id },
        data: processedData,
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new Error(`Failed to update glossary category: ${error.message}`);
      }
      throw error;
    }
  }

  async remove(id: string) {
    try {
      const termCount = await this.prisma.glossary.count({
        where: {
          categoryId: id,
        },
      });

      if (termCount > 0) {
        throw new Error(
          `Cannot delete category: it is being used by ${termCount} glossary terms`,
        );
      }

      await this.findOne(id);
      await this.prisma.glossaryCategory.delete({ where: { id } });
      return { id };
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new Error(`Failed to delete glossary category: ${error.message}`);
      }
      throw error;
    }
  }

  async findBySlug(slug: string) {
    try {
      const category = await this.prisma.glossaryCategory.findFirst({
        where: {
          OR: [
            {
              slug: {
                is: {
                  az: {
                    equals: slug,
                  },
                },
              },
            },
            {
              slug: {
                is: {
                  en: {
                    equals: slug,
                  },
                },
              },
            },
          ],
        },
        include: {
          _count: {
            select: {
              glossaryTerms: true,
            },
          },
        },
      });

      if (!category) {
        throw new NotFoundException(
          `Glossary category with slug ${slug} not found`,
        );
      }

      return category;
    } catch (error) {
      throw error;
    }
  }
}
