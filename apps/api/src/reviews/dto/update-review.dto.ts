import { IsOptional, IsObject, IsString, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { ReviewStatus } from '@prisma/client';

export class UpdateReviewDto {
  @ApiProperty({
    example: {
      structure: 8,
      grammar: 7,
      clarity: 9,
      argumentStrength: 8,
      originality: 6,
      overall: 8,
    },
    required: false,
  })
  @IsOptional()
  @IsObject()
  scores?: {
    structure: number;
    grammar: number;
    clarity: number;
    argumentStrength: number;
    originality: number;
    overall: number;
  };

  @ApiProperty({ example: 'IN_PROGRESS', enum: ReviewStatus, required: false })
  @IsOptional()
  @IsEnum(ReviewStatus)
  status?: ReviewStatus;

  @ApiProperty({ example: 'Great essay with strong arguments...', required: false })
  @IsOptional()
  @IsString()
  feedback?: string;
}
