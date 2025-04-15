import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review';
import { AuthGuard } from 'src/auth/auth.guard';
import { GetReviewsQueryDto } from './dto/get-reviews';

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
