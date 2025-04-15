import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString, Max, Min } from 'class-validator';

export class UpdateReviewDto {
  @ApiProperty({
    description: 'Avaliação em estrelas (1-5)',
    minimum: 1,
    maximum: 5,
    required: false,
    example: 4,
  })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(5)
  rating?: number;

  @ApiProperty({
    description: 'Comentário da avaliação',
    required: false,
    example: 'Uma ótima experiência! Recomendo a todos.',
  })
  @IsOptional()
  @IsString()
  comment?: string;
}
