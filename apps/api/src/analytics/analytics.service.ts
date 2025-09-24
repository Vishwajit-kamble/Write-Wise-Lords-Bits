import { Injectable } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';

@Injectable()
export class AnalyticsService {
  constructor(private prisma: PrismaService) {}

  async getDashboardStats(userId: string, userRole: string) {
    const baseStats = {
      essaysSubmitted: 0,
      reviewsCompleted: 0,
      averageScore: 0,
      pendingReviews: 0,
      upcomingDeadlines: 0,
    };

    if (userRole === 'STUDENT') {
      return this.getStudentStats(userId);
    } else if (userRole === 'REVIEWER') {
      return this.getReviewerStats(userId);
    } else if (userRole === 'FACULTY') {
      return this.getFacultyStats(userId);
    }

    return baseStats;
  }

  private async getStudentStats(userId: string) {
    const [essaysCount, reviewsCount, avgScore, pendingReviews, upcomingDeadlines] = await Promise.all([
      this.prisma.essay.count({
        where: { authorId: userId },
      }),
      this.prisma.review.count({
        where: { essay: { authorId: userId } },
      }),
      this.getAverageScore(userId),
      this.prisma.review.count({
        where: {
          essay: { authorId: userId },
          status: { in: ['ASSIGNED', 'IN_PROGRESS'] },
        },
      }),
      this.prisma.essay.count({
        where: {
          authorId: userId,
          dueDate: { gte: new Date() },
          status: { not: 'GRADED' },
        },
      }),
    ]);

    return {
      essaysSubmitted: essaysCount,
      reviewsCompleted: reviewsCount,
      averageScore: avgScore,
      pendingReviews,
      upcomingDeadlines,
    };
  }

  private async getReviewerStats(userId: string) {
    const [reviewsCount, completedReviews, avgScore, pendingReviews] = await Promise.all([
      this.prisma.review.count({
        where: { reviewerId: userId },
      }),
      this.prisma.review.count({
        where: { reviewerId: userId, status: 'COMPLETED' },
      }),
      this.getReviewerAverageScore(userId),
      this.prisma.review.count({
        where: {
          reviewerId: userId,
          status: { in: ['ASSIGNED', 'IN_PROGRESS'] },
        },
      }),
    ]);

    return {
      essaysSubmitted: 0,
      reviewsCompleted: completedReviews,
      averageScore: avgScore,
      pendingReviews,
      upcomingDeadlines: 0,
    };
  }

  private async getFacultyStats(userId: string) {
    const [essaysCount, reviewsCount, avgScore, pendingReviews, upcomingDeadlines] = await Promise.all([
      this.prisma.essay.count({
        where: { course: { instructorId: userId } },
      }),
      this.prisma.review.count({
        where: { essay: { course: { instructorId: userId } } },
      }),
      this.getFacultyAverageScore(userId),
      this.prisma.review.count({
        where: {
          essay: { course: { instructorId: userId } },
          status: { in: ['ASSIGNED', 'IN_PROGRESS'] },
        },
      }),
      this.prisma.essay.count({
        where: {
          course: { instructorId: userId },
          dueDate: { gte: new Date() },
          status: { not: 'GRADED' },
        },
      }),
    ]);

    return {
      essaysSubmitted: essaysCount,
      reviewsCompleted: reviewsCount,
      averageScore: avgScore,
      pendingReviews,
      upcomingDeadlines,
    };
  }

  private async getAverageScore(userId: string): Promise<number> {
    const reviews = await this.prisma.review.findMany({
      where: {
        essay: { authorId: userId },
        status: 'COMPLETED',
      },
      select: { scores: true },
    });

    if (reviews.length === 0) return 0;

    const totalScore = reviews.reduce((sum, review) => {
      const scores = review.scores as any;
      return sum + (scores.overall || 0);
    }, 0);

    return Math.round((totalScore / reviews.length) * 10) / 10;
  }

  private async getReviewerAverageScore(userId: string): Promise<number> {
    const reviews = await this.prisma.review.findMany({
      where: {
        reviewerId: userId,
        status: 'COMPLETED',
      },
      select: { scores: true },
    });

    if (reviews.length === 0) return 0;

    const totalScore = reviews.reduce((sum, review) => {
      const scores = review.scores as any;
      return sum + (scores.overall || 0);
    }, 0);

    return Math.round((totalScore / reviews.length) * 10) / 10;
  }

  private async getFacultyAverageScore(userId: string): Promise<number> {
    const reviews = await this.prisma.review.findMany({
      where: {
        essay: { course: { instructorId: userId } },
        status: 'COMPLETED',
      },
      select: { scores: true },
    });

    if (reviews.length === 0) return 0;

    const totalScore = reviews.reduce((sum, review) => {
      const scores = review.scores as any;
      return sum + (scores.overall || 0);
    }, 0);

    return Math.round((totalScore / reviews.length) * 10) / 10;
  }

  async getPerformanceTrends(userId: string, userRole: string, days: number = 30) {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    if (userRole === 'STUDENT') {
      return this.getStudentPerformanceTrends(userId, startDate);
    } else if (userRole === 'FACULTY') {
      return this.getFacultyPerformanceTrends(userId, startDate);
    }

    return [];
  }

  private async getStudentPerformanceTrends(userId: string, startDate: Date) {
    const essays = await this.prisma.essay.findMany({
      where: {
        authorId: userId,
        createdAt: { gte: startDate },
        status: 'GRADED',
      },
      include: {
        reviews: {
          where: { status: 'COMPLETED' },
          select: { scores: true, createdAt: true },
        },
      },
    });

    return essays.map(essay => ({
      date: essay.createdAt.toISOString().split('T')[0],
      averageScore: essay.reviews.length > 0 
        ? (essay.reviews[0].scores as any).overall 
        : 0,
      essayCount: 1,
    }));
  }

  private async getFacultyPerformanceTrends(userId: string, startDate: Date) {
    const essays = await this.prisma.essay.findMany({
      where: {
        course: { instructorId: userId },
        createdAt: { gte: startDate },
        status: 'GRADED',
      },
      include: {
        reviews: {
          where: { status: 'COMPLETED' },
          select: { scores: true, createdAt: true },
        },
      },
    });

    // Group by date and calculate averages
    const groupedData = essays.reduce((acc, essay) => {
      const date = essay.createdAt.toISOString().split('T')[0];
      if (!acc[date]) {
        acc[date] = { totalScore: 0, count: 0 };
      }
      if (essay.reviews.length > 0) {
        acc[date].totalScore += (essay.reviews[0].scores as any).overall;
        acc[date].count += 1;
      }
      return acc;
    }, {} as Record<string, { totalScore: number; count: number }>);

    return Object.entries(groupedData).map(([date, data]) => ({
      date,
      averageScore: data.count > 0 ? Math.round((data.totalScore / data.count) * 10) / 10 : 0,
      essayCount: data.count,
    }));
  }

  async getCommonIssues(userId: string, userRole: string) {
    // This would analyze common issues from AI feedback and reviews
    // For now, returning mock data
    return [
      { type: 'Grammar', count: 15, percentage: 25 },
      { type: 'Structure', count: 12, percentage: 20 },
      { type: 'Clarity', count: 10, percentage: 17 },
      { type: 'Argument Strength', count: 8, percentage: 13 },
      { type: 'Originality', count: 6, percentage: 10 },
    ];
  }
}
