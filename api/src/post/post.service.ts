import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { Prisma, PostType, EventStatus } from '@prisma/client';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';
import * as path from 'path';

@Injectable()
export class PostService {
  private readonly uploadDir = 'uploads';
  private readonly teamImageDir = 'post';

  private getRelativeImagePath(filename: string | null): string | null {
    return filename ? path.join(this.teamImageDir, filename) : null;
  }

  private getAbsoluteImagePath(filename: string): string {
    return path.join(
      process.cwd(),
      this.uploadDir,
      this.teamImageDir,
      filename,
    );
  }

  private processMultilingualFields(dto: any) {
    const multilingualFields = ['title', 'content', 'slug'];
    const processedData: any = { ...dto };
    const result: any = {};

    multilingualFields.forEach((field) => {
      if (dto[`${field}[az]`] || dto[`${field}[ru]`]) {
        result[field] = {
          az: dto[`${field}[az]`],
          ru: dto[`${field}[ru]`],
        };
        delete processedData[`${field}[az]`];
        delete processedData[`${field}[ru]`];
      }
    });

    return { ...processedData, ...result };
  }

  /**
   * Determines the EventStatus based on the offer dates
   * For offers, we consider:
   * - No offerEndDate means it's ONGOING indefinitely
   * - If offerEndDate is in the future, it's UPCOMING
   * - If offerEndDate is today or later (and offerStartDate has passed or is today), it's ONGOING
   * - If offerEndDate has passed, it's PAST
   */
  private determineOfferStatus(
    offerStartDate?: Date | null,
    offerEndDate?: Date | null,
  ): EventStatus {
    const now = new Date();
    now.setHours(0, 0, 0, 0);

    if (!offerEndDate) {
      return EventStatus.ONGOING;
    }

    const endDate = new Date(offerEndDate);
    endDate.setHours(0, 0, 0, 0);

    if (offerStartDate) {
      const startDate = new Date(offerStartDate);
      startDate.setHours(0, 0, 0, 0);

      if (startDate > now) {
        return EventStatus.UPCOMING;
      } else if (endDate >= now) {
        return EventStatus.ONGOING;
      } else {
        return EventStatus.PAST;
      }
    } else {
      if (endDate >= now) {
        return EventStatus.ONGOING;
      } else {
        return EventStatus.PAST;
      }
    }
  }

  constructor(private prisma: PrismaService) {}

  async create(
    createPostDto: CreatePostDto & { imageUrl: string },
    authorId: string,
  ) {
    try {
      const imageUrl = this.getRelativeImagePath(createPostDto.imageUrl);
      const processedData = this.processMultilingualFields(createPostDto);

      let eventStatus = undefined;
      if (createPostDto.postType === PostType.OFFERS) {
        eventStatus = this.determineOfferStatus(
          createPostDto.offerStartDate as any,
          createPostDto.offerEndDate as any,
        );
      }

      return await this.prisma.post.create({
        data: {
          ...processedData,
          imageUrl,
          published: Boolean(createPostDto.published),
          eventStatus: eventStatus,
          author: {
            connect: { id: authorId },
          },
        },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new Error(`Failed to create post: ${error.message}`);
      }
      throw error;
    }
  }

  async findAll(
    page = 1,
    limit = 10,
    includeUnpublished = false,
    postType?: PostType,
    includeBlogs = false,
  ) {
    try {
      const skip = (page - 1) * limit;
      let whereClause: any = includeUnpublished ? {} : { published: true };

      if (postType !== null && postType !== undefined) {
        whereClause = { ...whereClause, postType };
      } else if (!Boolean(includeBlogs)) {
        whereClause = { ...whereClause, postType: { not: PostType.BLOG } };
      }

      await this.updateOfferStatuses();

      const [total, items] = await Promise.all([
        this.prisma.post.count({
          where: whereClause,
        }),
        this.prisma.post.findMany({
          where: whereClause,
          skip,
          take: +limit,
          orderBy: {
            createdAt: 'desc',
          },
          include: {
            author: {
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
    await this.updateOfferStatus(id);

    const post = await this.prisma.post.findUnique({
      where: { id },
      include: {
        author: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    if (!post) {
      throw new NotFoundException(`Post with ID ${id} not found`);
    }

    return post;
  }

  async update(id: string, updatePostDto: UpdatePostDto) {
    try {
      const existingPost = await this.findOne(id);
      const processedData = this.processMultilingualFields(updatePostDto);

      ['title', 'content', 'slug'].forEach((field) => {
        if (processedData[field]) {
          processedData[field] = {
            ...(existingPost[field] as any),
            ...processedData[field],
          };
        }
      });

      let imageData = {};
      if (updatePostDto.imageUrl) {
        const imageUrl = this.getRelativeImagePath(updatePostDto.imageUrl);
        imageData = { imageUrl };
      }

      let eventStatus = undefined;
      const postType = updatePostDto.postType || existingPost.postType;

      if (postType === PostType.OFFERS) {
        const offerEndDate =
          updatePostDto.offerEndDate || existingPost.offerEndDate;
        const offerStartDate =
          updatePostDto.offerStartDate || existingPost.offerStartDate;
        eventStatus = this.determineOfferStatus(
          offerStartDate as any,
          offerEndDate as any,
        );
      }

      return await this.prisma.post.update({
        where: { id },
        data: {
          ...processedData,
          ...imageData,
          published: Boolean(updatePostDto.published),
          eventStatus: eventStatus,
        },
        include: {
          author: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new Error(`Failed to update post: ${error.message}`);
      }
      throw error;
    }
  }

  async remove(id: string) {
    try {
      await this.findOne(id);
      await this.prisma.post.delete({ where: { id } });
      return { id };
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new Error(`Failed to delete post: ${error.message}`);
      }
      throw error;
    }
  }

  async findBySlug(slug: string) {
    try {
      await this.updateOfferStatuses();

      const post = await this.prisma.post.findFirst({
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
                  ru: {
                    equals: slug,
                  },
                },
              },
            },
          ],
          published: true,
        },
        include: {
          author: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      });

      if (!post) {
        throw new NotFoundException(`Post with slug ${slug} not found`);
      }

      return post;
    } catch (error) {
      throw error;
    }
  }

  async getPostsByType(
    type: PostType,
    page = 1,
    limit = 10,
    includeUnpublished = false,
  ) {
    if (type === PostType.OFFERS) {
      await this.updateOfferStatuses();
    }

    return this.findAll(page, limit, includeUnpublished, type);
  }

  /**
   * Updates the status of a specific offer post
   */
  async updateOfferStatus(postId: string): Promise<void> {
    try {
      const post = await this.prisma.post.findUnique({
        where: { id: postId },
        select: {
          postType: true,
          offerStartDate: true,
          offerEndDate: true,
          eventStatus: true,
        },
      });

      if (!post || post.postType !== PostType.OFFERS) {
        return;
      }

      const newStatus = this.determineOfferStatus(
        post.offerStartDate,
        post.offerEndDate,
      );

      if (post.eventStatus !== newStatus) {
        await this.prisma.post.update({
          where: { id: postId },
          data: { eventStatus: newStatus },
        });
      }
    } catch (error) {
      console.error(`Failed to update offer status for post ${postId}:`, error);
    }
  }

  /**
   * Updates the status of all offer posts
   * This is used when querying posts to ensure statuses are current
   */
  async updateOfferStatuses(): Promise<void> {
    try {
      const offerPosts = await this.prisma.post.findMany({
        where: {
          postType: PostType.OFFERS,
          published: true,
        },
        select: {
          id: true,
          offerStartDate: true,
          offerEndDate: true,
          eventStatus: true,
        },
      });

      const updates = offerPosts.map((post) => {
        const newStatus = this.determineOfferStatus(
          post.offerStartDate,
          post.offerEndDate,
        );

        if (post.eventStatus !== newStatus) {
          return this.prisma.post.update({
            where: { id: post.id },
            data: { eventStatus: newStatus, published: false },
          });
        }
        return Promise.resolve();
      });

      await Promise.all(updates);
    } catch (error) {
      console.error('Failed to update offer statuses:', error);
    }
  }
}
