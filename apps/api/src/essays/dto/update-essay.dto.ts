import { IsOptional, IsString, IsDateString, IsEnum } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { EssayStatus } from '@prisma/client';

export class UpdateEssayDto {
  @ApiProperty({ example: 'The Impact of Technology on Education', required: false })
  @IsOptional()
  @IsString()
  title?: string;

  @ApiProperty({ example: 'Technology has revolutionized the way we learn and teach...', required: false })
  @IsOptional()
  @IsString()
  content?: string;

  @ApiProperty({ example: 'DRAFT', enum: EssayStatus, required: false })
  @IsOptional()
  @IsEnum(EssayStatus)
  status?: EssayStatus;

  @ApiProperty({ example: '2024-12-31T23:59:59Z', required: false })
  @IsOptional()
  @IsDateString()
  dueDate?: string;

  @ApiProperty({ example: 'course-id-123', required: false })
  @IsOptional()
  @IsString()
  courseId?: string;
}
