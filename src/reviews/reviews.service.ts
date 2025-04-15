import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateReviewDto } from './dto/create-review';
import { GetReviewsQueryDto, SortOrder } from './dto/get-reviews';
import { UpdateReviewDto } from './dto/update-review';
import { UpdateReviewStatusDto } from './dto/update-review-status';

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

  async findAllByPropertyId(propertyId: string, query: GetReviewsQueryDto) {
    const property = await this.prisma.properties.findUnique({
      where: { id: propertyId },
    });

    if (!property) {
      throw new NotFoundException(`Property with ID ${propertyId} not found`);
    }

    const { page = 1, limit = 10, status, sortOrder = SortOrder.DESC } = query;
    const skip = (page - 1) * limit;

    const where = {
      propertyId,
      ...(status && { status: status }),
    };

    const [reviews, total] = await Promise.all([
      this.prisma.review.findMany({
        where,
        skip,
        take: limit,
        orderBy: {
          createdAt: sortOrder,
        },
        include: {
          user: {
            select: {
              id: true,
              name: true,
            },
          },
        },
      }),
      this.prisma.review.count({ where }),
    ]);

    const totalPages = Math.ceil(total / limit);
    const hasNextPage = page < totalPages;
    const hasPreviousPage = page > 1;

    return {
      data: reviews,
      meta: {
        total,
        page,
        limit,
        totalPages,
        hasNextPage,
        hasPreviousPage,
      },
    };
  }

  async getReviewById(propertyId: string, reviewId: string) {
    const review = await this.prisma.review.findFirst({
      where: {
        id: reviewId,
        propertyId,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    if (!review) {
      throw new NotFoundException(
        `Review with ID ${reviewId} not found property ${propertyId}`,
      );
    }

    return review;
  }

  async updateReview(
    propertiId: string,
    reviewId: string,
    userId: string,
    updateReviewDto: UpdateReviewDto,
  ) {
    const review = await this.getReviewById(propertiId, reviewId);

    if (review.userId !== userId) {
      throw new ForbiddenException('You Can only update your own reviews');
    }

    return this.prisma.review.update({
      where: {
        id: reviewId,
      },
      data: updateReviewDto,
    });
  }

  async deleteReview(propertyId: string, reviewId: string, userId: string) {
    const review = await this.getReviewById(propertyId, reviewId);

    if (review.userId !== userId) {
      throw new ForbiddenException('You can only delete your own reviews');
    }

    return this.prisma.review.delete({
      where: {
        id: reviewId,
      },
    });
  }

  async updateReviewstatus(
    propertyId: string,
    reviewId: string,
    updateStatusDto: UpdateReviewStatusDto,
  ) {
    await this.getReviewById(propertyId, reviewId);

    return this.prisma.review.update({
      where: {
        id: reviewId,
      },
      data: {
        status: updateStatusDto.status,
      },
    });
  }
}
