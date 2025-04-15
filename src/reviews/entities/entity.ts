// src/reviews/entities/review.entity.ts
import { ApiProperty } from '@nestjs/swagger';
import { ReviewStatus } from '../dto/get-reviews';

export class UserEntity {
  @ApiProperty({ example: '1', description: 'ID do usuário' })
  id: string;

  @ApiProperty({ example: 'João Silva', description: 'Nome do usuário' })
  name: string;
}

export class ReviewEntity {
  @ApiProperty({ example: '1', description: 'ID da avaliação' })
  id: string;

  @ApiProperty({ example: 5, description: 'Avaliação em estrelas (1-5)' })
  rating: number;

  @ApiProperty({
    example: 'Excelente propriedade, recomendo!',
    description: 'Comentário da avaliação',
  })
  comment: string;

  @ApiProperty({
    enum: ReviewStatus,
    example: ReviewStatus.APPROVED,
    description: 'Status da avaliação',
  })
  status: string;

  @ApiProperty({
    example: '2023-01-01T00:00:00Z',
    description: 'Data de criação',
  })
  createdAt: Date;

  @ApiProperty({
    example: '2023-01-01T00:00:00Z',
    description: 'Data de atualização',
  })
  updatedAt: Date;

  @ApiProperty({ description: 'Usuário que criou a avaliação' })
  user: UserEntity;

  @ApiProperty({ example: '1', description: 'ID da propriedade' })
  propertyId: string;

  @ApiProperty({ example: '1', description: 'ID do usuário' })
  userId: string;
}

export class PaginatedReviewsResponse {
  @ApiProperty({
    type: [ReviewEntity],
    description: 'Lista de avaliações',
  })
  data: ReviewEntity[];

  @ApiProperty({
    description: 'Metadados da paginação',
    example: {
      total: 35,
      page: 1,
      limit: 10,
      totalPages: 4,
      hasNextPage: true,
      hasPreviousPage: false,
    },
  })
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}
