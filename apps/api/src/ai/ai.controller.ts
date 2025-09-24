import { Controller, Post, Param, UseGuards, Request } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { AiService } from './ai.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@ApiTags('AI')
@Controller('ai')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Post('feedback/:essayId')
  @ApiOperation({ summary: 'Generate AI feedback for an essay' })
  @ApiResponse({ status: 200, description: 'AI feedback generated successfully' })
  @ApiResponse({ status: 404, description: 'Essay not found' })
  async generateFeedback(@Param('essayId') essayId: string, @Request() req) {
    return this.aiService.generateFeedback(essayId);
  }
}
