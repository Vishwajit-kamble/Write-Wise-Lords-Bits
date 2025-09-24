import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { ReviewStatus } from '@prisma/client';

@Injectable()
export class ReviewsService {
  constructor(private prisma: PrismaService) {}

  async create(createReviewDto: CreateReviewDto, reviewerId: string) {
    return this.prisma.review.create({
      data: {
        ...createReviewDto,
        reviewerId,
      },
      include: {
        essay: {
          include: {
            author: {
              select: {
                id: true,
                name: true,
                email: true,
                avatar: true,
              },
            },
          },
        },
        reviewer: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
          },
        },
        comments: true,
      },
    });
  }

  async findAll(reviewerId?: string, status?: ReviewStatus) {
    const where: any = {};
    
    if (reviewerId) {
      where.reviewerId = reviewerId;
    }
    
    if (status) {
      where.status = status;
    }

    return this.prisma.review.findMany({
      where,
      include: {
        essay: {
          include: {
            author: {
              select: {
                id: true,
                name: true,
                email: true,
                avatar: true,
              },
            },
          },
        },
        reviewer: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
          },
        },
        comments: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: string) {
    const review = await this.prisma.review.findUnique({
      where: { id },
      include: {
        essay: {
          include: {
            author: {
              select: {
                id: true,
                name: true,
                email: true,
                avatar: true,
              },
            },
          },
        },
        reviewer: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
          },
        },
        comments: true,
      },
    });

    if (!review) {
      throw new NotFoundException('Review not found');
    }

    return review;
  }

  async update(id: string, updateReviewDto: UpdateReviewDto, userId: string) {
    const review = await this.findOne(id);
    
    if (review.reviewerId !== userId) {
      throw new ForbiddenException('You can only update your own reviews');
    }

    return this.prisma.review.update({
      where: { id },
      data: {
        ...updateReviewDto,
        status: ReviewStatus.IN_PROGRESS,
      },
      include: {
        essay: {
          include: {
            author: {
              select: {
                id: true,
                name: true,
                email: true,
                avatar: true,
              },
            },
          },
        },
        reviewer: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
          },
        },
        comments: true,
      },
    });
  }

  async complete(id: string, userId: string) {
    const review = await this.findOne(id);
    
    if (review.reviewerId !== userId) {
      throw new ForbiddenException('You can only complete your own reviews');
    }

    return this.prisma.review.update({
      where: { id },
      data: {
        status: ReviewStatus.COMPLETED,
        completedAt: new Date(),
      },
      include: {
        essay: {
          include: {
            author: {
              select: {
                id: true,
                name: true,
                email: true,
                avatar: true,
              },
            },
          },
        },
        reviewer: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
          },
        },
        comments: true,
      },
    });
  }

  async assignReviewer(essayId: string) {
    // Simple round-robin assignment algorithm
    // In a real implementation, this would be more sophisticated
    const reviewers = await this.prisma.user.findMany({
      where: { role: 'REVIEWER' },
    });

    if (reviewers.length === 0) {
      throw new Error('No reviewers available');
    }

    // Get the reviewer with the least number of assigned reviews
    const reviewerCounts = await Promise.all(
      reviewers.map(async (reviewer) => ({
        reviewer,
        count: await this.prisma.review.count({
          where: {
            reviewerId: reviewer.id,
            status: { in: ['ASSIGNED', 'IN_PROGRESS'] },
          },
        }),
      }))
    );

    const selectedReviewer = reviewerCounts.reduce((min, current) =>
      current.count < min.count ? current : min
    ).reviewer;

    return this.create(
      {
        essayId,
        scores: {
          structure: 0,
          grammar: 0,
          clarity: 0,
          argumentStrength: 0,
          originality: 0,
          overall: 0,
        },
        status: ReviewStatus.ASSIGNED,
      },
      selectedReviewer.id
    );
  }
}
