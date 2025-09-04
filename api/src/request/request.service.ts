import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma.service';
import { CreateRequestDto } from './dto/create-request.dto';
import { Prisma, RequestStatus } from '@prisma/client';

@Injectable()
export class RequestService {
  constructor(private prisma: PrismaService) {}

  async createRequest(createRequestDto: CreateRequestDto) {
    return this.prisma.request.create({
      data: {
        name: createRequestDto.name,
        surname: createRequestDto.surname,
        number: createRequestDto.number,
        childAge: createRequestDto.childAge,
        childLanguage: createRequestDto.childLanguage,
        status: RequestStatus.PENDING,
        additionalInfo: createRequestDto.additionalInfo || {},
      },
    });
  }

  async findAll(page = 1, limit = 10) {
    try {
      const skip = (page - 1) * limit;

      const [total, items] = await Promise.all([
        this.prisma.request.count(),
        this.prisma.request.findMany({
          skip,
          take: +limit,
          orderBy: {
            createdAt: 'desc',
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
    return this.prisma.request.findUnique({
      where: { id },
      select: {
        id: true,
        name: true,
        surname: true,
        number: true,
        childAge: true,
        childLanguage: true,
        status: true,
        createdAt: true,
        viewedBy: true,
        viewedAt: true,
        additionalInfo: true,
      },
    });
  }

  async markAsViewed(id: string, userName: string) {
    return this.prisma.request.update({
      where: { id },
      data: {
        viewedBy: userName,
        status: RequestStatus.VIEWED,
        viewedAt: new Date(),
      },
    });
  }

  async remove(id: string) {
    return this.prisma.request.delete({
      where: { id },
    });
  }
}
