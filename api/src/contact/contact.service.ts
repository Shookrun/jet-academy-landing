import {
  Injectable,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { CreateContactDto } from './dto/create-contact.dto';
import { UpdateContactDto } from './dto/update-contact.dto';
import { PrismaService } from 'src/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class ContactService {
  constructor(private prisma: PrismaService) {}

  async create(createContactDto: CreateContactDto) {
    try {
      const exists = await this.prisma.contactInfo.findFirst();
      if (exists) {
        throw new ConflictException(
          'Contact info already exists. Use update instead.',
        );
      }

      return await this.prisma.contactInfo.create({
        data: createContactDto,
      });
    } catch (error) {
      if (error instanceof ConflictException) {
        throw error;
      }
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new Error(`Failed to create contact info: ${error.message}`);
      }
      throw error;
    }
  }

  async findAll() {
    try {
      const contact = await this.prisma.contactInfo.findFirst({
        orderBy: { createdAt: 'desc' },
      });

      if (!contact) {
        throw new NotFoundException('Contact info not found');
      }

      return contact;
    } catch (error) {
      if (error instanceof NotFoundException) {
        throw error;
      }
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        console.error('Database query failed:', error);
        throw new Error('Failed to fetch contact info');
      }
      throw error;
    }
  }

  async findOne(id: string) {
    try {
      const contact = await this.prisma.contactInfo.findUnique({
        where: { id },
      });

      if (!contact) {
        throw new NotFoundException(`Contact info not found`);
      }

      return contact;
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new Error(`Failed to fetch contact info: ${error.message}`);
      }
      throw error;
    }
  }

  async update(id: string, updateContactDto: UpdateContactDto) {
    try {
      await this.findOne(id);

      return await this.prisma.contactInfo.update({
        where: { id },
        data: updateContactDto,
      });
    } catch (error) {
      if (error instanceof Prisma.PrismaClientKnownRequestError) {
        throw new Error(`Failed to update contact info: ${error.message}`);
      }
      throw error;
    }
  }
}
