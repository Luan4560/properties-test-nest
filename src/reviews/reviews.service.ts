import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateReviewDto } from './dto/create-review';

@Injectable()
export class ReviewsService {
  constructor(private prisma: PrismaService) {}

  async create(
    propertyId: string,
    userId: string,
    createReviewDto: CreateReviewDto,
  ) {
    const property = await this.prisma.properties.findUnique({
      where: { id: propertyId },
    });

    if (!property) {
      throw new NotFoundException('Property not found');
    }

    const existingReview = await this.prisma.review.findFirst({
      where: {
        propertyId,
        userId,
      },
    });

    if (existingReview) {
      throw new ForbiddenException('You already reviewed this property.');
    }

    const review = await this.prisma.review.create({
      data: {
        ...createReviewDto,
        userId,
        propertyId,
      },
    });

    return review;
  }
}
