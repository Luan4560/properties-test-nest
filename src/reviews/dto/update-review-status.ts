import { IsEnum, IsNotEmpty } from 'class-validator';
import { ReviewStatus } from './get-reviews';

export class UpdateReviewStatusDto {
  @IsNotEmpty()
  @IsEnum(ReviewStatus)
  status: ReviewStatus;
}
