import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../common/prisma/prisma.service';
import { CreateEssayDto } from './dto/create-essay.dto';
import { UpdateEssayDto } from './dto/update-essay.dto';
import { EssayStatus } from '@prisma/client';

@Injectable()
export class EssaysService {
  constructor(private prisma: PrismaService) {}

  async create(createEssayDto: CreateEssayDto, userId: string) {
    const wordCount = createEssayDto.content.split(/\s+/).length;
    const readingTime = Math.ceil(wordCount / 200); // 200 words per minute

    return this.prisma.essay.create({
      data: {
        ...createEssayDto,
        authorId: userId,
        wordCount,
        readingTime,
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
          },
        },
        reviews: {
          include: {
            reviewer: {
              select: {
                id: true,
                name: true,
                avatar: true,
              },
            },
          },
        },
        aiFeedback: true,
      },
    });
  }

  async findAll(userId?: string, status?: EssayStatus) {
    const where: any = {};
    
    if (userId) {
      where.authorId = userId;
    }
    
    if (status) {
      where.status = status;
    }

    return this.prisma.essay.findMany({
      where,
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
          },
        },
        reviews: {
          include: {
            reviewer: {
              select: {
                id: true,
                name: true,
                avatar: true,
              },
            },
          },
        },
        aiFeedback: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  async findOne(id: string) {
    const essay = await this.prisma.essay.findUnique({
      where: { id },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
          },
        },
        reviews: {
          include: {
            reviewer: {
              select: {
                id: true,
                name: true,
                avatar: true,
              },
            },
            comments: true,
          },
        },
        aiFeedback: true,
      },
    });

    if (!essay) {
      throw new NotFoundException('Essay not found');
    }

    return essay;
  }

  async update(id: string, updateEssayDto: UpdateEssayDto, userId: string) {
    const essay = await this.findOne(id);
    
    if (essay.authorId !== userId) {
      throw new ForbiddenException('You can only update your own essays');
    }

    const wordCount = updateEssayDto.content ? updateEssayDto.content.split(/\s+/).length : essay.wordCount;
    const readingTime = Math.ceil(wordCount / 200);

    return this.prisma.essay.update({
      where: { id },
      data: {
        ...updateEssayDto,
        wordCount,
        readingTime,
        version: essay.version + 1,
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
          },
        },
        reviews: {
          include: {
            reviewer: {
              select: {
                id: true,
                name: true,
                avatar: true,
              },
            },
          },
        },
        aiFeedback: true,
      },
    });
  }

  async remove(id: string, userId: string) {
    const essay = await this.findOne(id);
    
    if (essay.authorId !== userId) {
      throw new ForbiddenException('You can only delete your own essays');
    }

    await this.prisma.essay.delete({
      where: { id },
    });

    return { message: 'Essay deleted successfully' };
  }

  async submit(id: string, userId: string) {
    const essay = await this.findOne(id);
    
    if (essay.authorId !== userId) {
      throw new ForbiddenException('You can only submit your own essays');
    }

    return this.prisma.essay.update({
      where: { id },
      data: {
        status: EssayStatus.SUBMITTED,
        submittedAt: new Date(),
      },
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
    });
  }
}
