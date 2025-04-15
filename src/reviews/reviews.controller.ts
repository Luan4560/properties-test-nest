import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review';
import { AuthGuard } from 'src/auth/auth.guard';
import { GetReviewsQueryDto } from './dto/get-reviews';
import { UpdateReviewDto } from './dto/update-review';
import { UpdateReviewStatusDto } from './dto/update-review-status';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/decorators/roles';

@Controller('api/properties/:propertyId/reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Get()
  findAll(
    @Param('propertyId') propertyId: string,
    @Query() query: GetReviewsQueryDto,
  ) {
    return this.reviewsService.findAllByPropertyId(propertyId, query);
  }

  @Put(':reviewId')
  @UseGuards(AuthGuard)
  async update(
    @Param('propertyId') propertyId: string,
    @Param('reviewId') reviewId: string,
    @Body() updateReviewDto: UpdateReviewDto,
    @Request() req,
  ) {
    const userId = req.user.id;
    return this.reviewsService.updateReview(
      propertyId,
      reviewId,
      userId,
      updateReviewDto,
    );
  }

  @Delete(':reviewId')
  @UseGuards(AuthGuard)
  async remove(
    @Param('propertyId') propertyId: string,
    @Param('reviewId') reviewId: string,
    @Request() req,
  ) {
    const userId = req.user.id;
    return this.reviewsService.deleteReview(propertyId, reviewId, userId);
  }

  @Patch(':reviewId/status')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('ADMIN')
  updateStatus(
    @Param('propertyId') propertyId: string,
    @Param('reviewId') reviewId: string,
    @Body() updateStatusDto: UpdateReviewStatusDto,
  ) {
    return this.reviewsService.updateReviewstatus(
      propertyId,
      reviewId,
      updateStatusDto,
    );
  }

  @Post()
  @UseGuards(AuthGuard)
  create(
    @Param('propertyId') propertyId: string,
    @Body() createReviewDto: CreateReviewDto,
    @Request() req,
  ) {
    const userId = req.user.id;
    return this.reviewsService.create(propertyId, userId, createReviewDto);
  }
}
