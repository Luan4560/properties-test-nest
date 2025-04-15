import {
  Body,
  Controller,
  Param,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review';
import { AuthGuard } from 'src/auth/auth.guard';

@Controller('api/properties/:propertyId/reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

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
