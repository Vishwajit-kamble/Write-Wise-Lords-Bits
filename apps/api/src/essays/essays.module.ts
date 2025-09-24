import { Module } from '@nestjs/common';
import { EssaysService } from './essays.service';
import { EssaysController } from './essays.controller';

@Module({
  providers: [EssaysService],
  controllers: [EssaysController],
  exports: [EssaysService],
})
export class EssaysModule {}
