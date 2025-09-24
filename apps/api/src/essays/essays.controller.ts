import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Request, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { EssaysService } from './essays.service';
import { CreateEssayDto } from './dto/create-essay.dto';
import { UpdateEssayDto } from './dto/update-essay.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { EssayStatus } from '@prisma/client';

@ApiTags('Essays')
@Controller('essays')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class EssaysController {
  constructor(private readonly essaysService: EssaysService) {}

  @Post()
  @ApiOperation({ summary: 'Create a new essay' })
  create(@Body() createEssayDto: CreateEssayDto, @Request() req) {
    return this.essaysService.create(createEssayDto, req.user.userId);
  }

  @Get()
  @ApiOperation({ summary: 'Get all essays' })
  findAll(@Query('userId') userId?: string, @Query('status') status?: EssayStatus) {
    return this.essaysService.findAll(userId, status);
  }

  @Get('my')
  @ApiOperation({ summary: 'Get current user essays' })
  findMyEssays(@Request() req) {
    return this.essaysService.findAll(req.user.userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get essay by ID' })
  findOne(@Param('id') id: string) {
    return this.essaysService.findOne(id);
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Update essay' })
  update(@Param('id') id: string, @Body() updateEssayDto: UpdateEssayDto, @Request() req) {
    return this.essaysService.update(id, updateEssayDto, req.user.userId);
  }

  @Patch(':id/submit')
  @ApiOperation({ summary: 'Submit essay for review' })
  submit(@Param('id') id: string, @Request() req) {
    return this.essaysService.submit(id, req.user.userId);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete essay' })
  remove(@Param('id') id: string, @Request() req) {
    return this.essaysService.remove(id, req.user.userId);
  }
}
