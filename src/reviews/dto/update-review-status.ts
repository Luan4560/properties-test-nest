import { IsEnum, IsNotEmpty } from 'class-validator';
import { ReviewStatus } from './get-reviews';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateReviewStatusDto {
  @ApiProperty({
    description: 'Novo status da avaliação',
    enum: ReviewStatus,
    example: ReviewStatus.APPROVED,
  })
  @IsNotEmpty()
  @IsEnum(ReviewStatus)
  status: ReviewStatus;
}
