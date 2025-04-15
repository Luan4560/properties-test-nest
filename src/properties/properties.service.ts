import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreatePropertyDto } from './dto/create-property';
import { UpdatePropertyDto } from './dto/update-property';

@Injectable()
export class PropertiesService {
  constructor(private prisma: PrismaService) {}

  async create(CreatePropertyDto: CreatePropertyDto) {
    return this.prisma.properties.create({
      data: CreatePropertyDto,
    });
  }

  async findAll() {
    return this.prisma.properties.findMany({
      include: {
        reviews: true,
      },
    });
  }

  async findOne(id: string) {
    const property = await this.prisma.properties.findUnique({
      where: { id },
      include: {
        reviews: true,
      },
    });

    if (!property) {
      throw new NotFoundException(`Property with ID ${id} not found`);
    }

    return property;
  }

  async update(id: string, UpdatePropertyDto: UpdatePropertyDto) {
    try {
      return await this.prisma.properties.update({
        where: { id },
        data: UpdatePropertyDto,
      });
    } catch {
      throw new NotFoundException(`Property with ID ${id} not found`);
    }
  }

  async remove(id: string) {
    try {
      return await this.prisma.properties.delete({
        where: { id },
      });
    } catch {
      throw new NotFoundException(`Property with ID ${id} not found`);
    }
  }
}
