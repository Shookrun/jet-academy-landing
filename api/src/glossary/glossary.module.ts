import { Module } from '@nestjs/common';
import { GlossaryService } from './glossary.service';
import { GlossaryController } from './glossary.controller';
import { GlossaryCategoryService } from './glossary-category.service';
import { GlossaryCategoryController } from './glossary-category.controller';
import { JwtService } from '@nestjs/jwt';

@Module({
  controllers: [GlossaryController, GlossaryCategoryController],
  providers: [GlossaryService, GlossaryCategoryService, JwtService],
  exports: [GlossaryService, GlossaryCategoryService],
})
export class GlossaryModule {}
