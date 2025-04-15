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
import { GetReviewsQueryDto, ReviewStatus } from './dto/get-reviews';
import { UpdateReviewDto } from './dto/update-review';
import { UpdateReviewStatusDto } from './dto/update-review-status';
import { RolesGuard } from 'src/auth/roles.guard';
import { Roles } from 'src/auth/decorators/roles';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { PaginatedReviewsResponse, ReviewEntity } from './entities/entity';

@ApiTags('reviews')
@Controller('api/properties/:propertyId/reviews')
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}
  @Get()
  @ApiOperation({ summary: 'Listar avaliações de uma propriedade' })
  @ApiParam({ name: 'propertyId', description: 'ID da propriedade' })
  @ApiQuery({ name: 'page', required: false, description: 'Número da página' })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Número de itens por página',
  })
  @ApiQuery({
    name: 'status',
    required: false,
    description: 'Filtrar por status',
    enum: ReviewStatus,
  })
  @ApiQuery({
    name: 'sortOrder',
    required: false,
    description: 'Ordenar por data (asc/desc)',
    enum: ['asc', 'desc'],
  })
  @ApiResponse({
    status: 200,
    description: 'Lista de avaliações retornada com sucesso',
    type: PaginatedReviewsResponse,
    schema: {
      properties: {
        data: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              rating: { type: 'number' },
              comment: { type: 'string' },
              status: {
                type: 'string',
                enum: ['PENDING', 'APPROVED', 'REJECTED'],
              },
              createdAt: { type: 'string', format: 'date-time' },
              user: {
                type: 'object',
                properties: {
                  id: { type: 'string' },
                  name: { type: 'string' },
                },
              },
            },
          },
        },
        meta: {
          type: 'object',
          properties: {
            total: { type: 'number' },
            page: { type: 'number' },
            limit: { type: 'number' },
            totalPages: { type: 'number' },
            hasNextPage: { type: 'boolean' },
            hasPreviousPage: { type: 'boolean' },
          },
        },
      },
    },
  })
  @ApiResponse({ status: 404, description: 'Propriedade não encontrada' })
  findAll(
    @Param('propertyId') propertyId: string,
    @Query() query: GetReviewsQueryDto,
  ) {
    return this.reviewsService.findAllByPropertyId(propertyId, query);
  }

  @Put(':reviewId')
  @UseGuards(AuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Atualizar uma avaliação (apenas pelo autor)' })
  @ApiParam({ name: 'propertyId', description: 'ID da propriedade' })
  @ApiParam({ name: 'reviewId', description: 'ID da avaliação' })
  @ApiResponse({ status: 200, description: 'Avaliação atualizada com sucesso' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  @ApiResponse({
    status: 403,
    description: 'Proibido - Usuário não é o autor da avaliação',
  })
  @ApiResponse({
    status: 404,
    description: 'Avaliação não encontrada',
    type: ReviewEntity,
  })
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
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Remover uma avaliação (apenas pelo autor)' })
  @ApiParam({ name: 'propertyId', description: 'ID da propriedade' })
  @ApiParam({ name: 'reviewId', description: 'ID da avaliação' })
  @ApiResponse({ status: 200, description: 'Avaliação removida com sucesso' })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  @ApiResponse({
    status: 403,
    description: 'Proibido - Usuário não é o autor da avaliação',
  })
  @ApiResponse({ status: 404, description: 'Avaliação não encontrada' })
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
  @Roles('ADMIN')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Atualizar status da avaliação (apenas admin)' })
  @ApiParam({ name: 'propertyId', description: 'ID da propriedade' })
  @ApiParam({ name: 'reviewId', description: 'ID da avaliação' })
  @ApiResponse({
    status: 200,
    description: 'Status da avaliação atualizado com sucesso',
  })
  @ApiResponse({ status: 401, description: 'Não autorizado' })
  @ApiResponse({
    status: 403,
    description: 'Proibido - Usuário não é um administrador',
  })
  @ApiResponse({
    status: 404,
    description: 'Avaliação não encontrada',
    type: ReviewEntity,
  })
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
