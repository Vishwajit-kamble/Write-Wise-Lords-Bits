import { Controller, Get, Post, Body, Patch, Param, UseGuards, Request, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { ReviewsService } from './reviews.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { ReviewStatus } from '@prisma/client';

@ApiTags('Reviews')
@Controller('reviews')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class ReviewsController {
  constructor(private readonly reviewsService: ReviewsService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new review' })
  create(@Body() createReviewDto: CreateReviewDto, @Request() req) {
    return this.reviewsService.create(createReviewDto, req.user.userId);
  }

  @Post('assign/:essayId')
  @ApiOperation({ summary: 'Assign a reviewer to an essay' })
  assignReviewer(@Param('essayId') essayId: string) {
    return this.reviewsService.assignReviewer(essayId);
  }

  @Get()
  @ApiOperation({ summary: 'Get all reviews' })
  findAll(@Query('reviewerId') reviewerId?: string, @Query('status') status?: ReviewStatus) {
    return this.reviewsService.findAll(reviewerId, status);
  }

  @Get('my')
  @ApiOperation({ summary: 'Get current user reviews' })
  findMyReviews(@Request() req) {
    return this.reviewsService.findAll(req.user.userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get review by ID' })
  findOne(@Param('id') id: string) {
    return this.reviewsService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update review' })
  update(@Param('id') id: string, @Body() updateReviewDto: UpdateReviewDto, @Request() req) {
    return this.reviewsService.update(id, updateReviewDto, req.user.userId);
  }

  @Patch(':id/complete')
  @ApiOperation({ summary: 'Complete review' })
  complete(@Param('id') id: string, @Request() req) {
    return this.reviewsService.complete(id, req.user.userId);
  }
}
