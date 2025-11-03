import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { Prisma } from '@prisma/client';
import { CreateGlossaryDto } from './dto/create-glossary.dto';
import { UpdateGlossaryDto } from './dto/update-glossary.dto';

@Injectable()
export class GlossaryService {
  constructor(private prisma: PrismaService) {}

  private processMultilingualFields(dto: any) {
    const multilingualFields = ['term', 'definition', 'slug'];
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

  private readonly includeRelations = {
    category: true,
  };

  async create(createGlossaryDto: CreateGlossaryDto) {
    try {
      const processedData = this.processMultilingualFields(createGlossaryDto);

      if (typeof processedData.tags === 'string') {
        processedData.tags = processedData.tags
          .split(',')
          .map((tag) => tag.trim());
      }

      return await this.prisma.glossary.create({
        data: processedData,
        include: this.includeRelations,
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new Error(`Failed to create glossary term: ${error.message}`);
      }
      throw error;
    }
  }

  async findAll(page = 1, limit = 10, includeUnpublished = false, letter = '') {
    try {
      const skip = (page - 1) * limit;

      const allItems = await this.prisma.glossary.findMany({
        where: includeUnpublished ? {} : { published: true },
        include: this.includeRelations,
      });

      const filteredItems = letter
        ? allItems.filter((item) =>
            item.term?.az?.toLowerCase().startsWith(letter.toLowerCase()),
          )
        : allItems;

      const sorted = filteredItems.sort(
        (a, b) => a.term?.az?.localeCompare(b.term?.az || '') || 0,
      );

      const paginated = sorted.slice(skip, skip + limit);

      return {
        items: paginated,
        meta: {
          total: filteredItems.length,
          page,
          limit,
          totalPages: Math.ceil(filteredItems.length / limit),
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
        this.prisma.glossary.count({
          where: whereClause,
        }),
        this.prisma.glossary.findMany({
          where: whereClause,
          skip,
          take: limit,
          select: {
            id: true,
            term: true,
            slug: true,
            categoryId: true,
            published: true,
            category: {
              select: {
                name: true,
              },
            },
          },
          orderBy: {
            term: {
              az: 'asc',
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
    const glossaryTerm = await this.prisma.glossary.findUnique({
      where: { id },
      include: this.includeRelations,
    });

    if (!glossaryTerm) {
      throw new NotFoundException(`Glossary term with ID ${id} not found`);
    }

    return glossaryTerm;
  }

  async update(id: string, updateGlossaryDto: UpdateGlossaryDto) {
    try {
      const existingTerm = await this.findOne(id);
      const processedData = this.processMultilingualFields(updateGlossaryDto);

      ['term', 'definition', 'slug'].forEach((field) => {
        if (processedData[field]) {
          processedData[field] = {
            ...(existingTerm[field] as any),
            ...processedData[field],
          };
        }
      });

      if (typeof processedData.tags === 'string') {
        processedData.tags = processedData.tags
          .split(',')
          .map((tag) => tag.trim());
      }

      return await this.prisma.glossary.update({
        where: { id },
        data: processedData,
        include: this.includeRelations,
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new Error(`Failed to update glossary term: ${error.message}`);
      }
      throw error;
    }
  }

  async remove(id: string) {
    try {
      await this.findOne(id);
      await this.prisma.glossary.delete({ where: { id } });
      return { id };
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new Error(`Failed to delete glossary term: ${error.message}`);
      }
      throw error;
    }
  }

  async findBySlug(slug: string) {
    try {
      const glossaryTerm = await this.prisma.glossary.findFirst({
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
          published: true,
        },
        include: this.includeRelations,
      });

      if (!glossaryTerm) {
        throw new NotFoundException(
          `Glossary term with slug ${slug} not found`,
        );
      }

      if (glossaryTerm.relatedTerms && glossaryTerm.relatedTerms.length > 0) {
        const relatedTermsData = await this.prisma.glossary.findMany({
          where: {
            id: {
              in: glossaryTerm.relatedTerms as string[],
            },
            published: true,
          },
          select: {
            id: true,
            term: true,
            slug: true,
          },
        });

        return {
          ...glossaryTerm,
          relatedTermsData: relatedTermsData,
        };
      }

      return {
        ...glossaryTerm,
        relatedTermsData: [],
      };
    } catch (error) {
      throw error;
    }
  }

  async findByCategory(categoryId: string, page = 1, limit = 10) {
    try {
      const skip = (page - 1) * limit;
      const whereClause = {
        categoryId,
        published: true,
      };

      const [total, items] = await Promise.all([
        this.prisma.glossary.count({
          where: whereClause,
        }),
        this.prisma.glossary.findMany({
          where: whereClause,
          skip,
          take: limit,
          include: this.includeRelations,
          orderBy: {
            term: {
              az: 'asc',
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

  async searchGlossary(query: string, page = 1, limit = 10) {
    try {
      const skip = (page - 1) * limit;
      const lowerQuery = query.toLowerCase();

      const allPublished = await this.prisma.glossary.findMany({
        where: { published: true },
        include: this.includeRelations,
      });

      const filtered = allPublished.filter((item) => {
        const termAz = item.term?.az?.toLowerCase() || '';
        const termRu = item.term?.en?.toLowerCase() || '';
        const defAz = item.definition?.az?.toLowerCase() || '';
        const defEn = item.definition?.en?.toLowerCase() || '';
        const tags = item.tags || [];

        return (
          termAz.includes(lowerQuery) ||
          termRu.includes(lowerQuery) ||
          defAz.includes(lowerQuery) ||
          defEn.includes(lowerQuery) ||
          tags.some((tag) => tag.toLowerCase().includes(lowerQuery))
        );
      });

      const paginated = filtered.slice(skip, skip + limit);

      return {
        items: paginated,
        meta: {
          total: filtered.length,
          page,
          limit,
          totalPages: Math.ceil(filtered.length / limit),
        },
      };
    } catch (error) {
      console.error('Search query failed:', error);
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
}
