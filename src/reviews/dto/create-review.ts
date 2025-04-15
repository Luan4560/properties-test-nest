// src/reviews/dto/create-review.dto.ts
import {
  IsNotEmpty,
  IsNumber,
  Min,
  Max,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateReviewDto {
  @IsNotEmpty()
  @IsNumber()
  @Min(1)
  @Max(5)
  rating: number;

  @IsNotEmpty()
  @IsString()
  @MaxLength(500)
  comment: string;
}
