import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PrismaModule } from 'src/prisma.module';
import { StudentProjectController } from './student-project.controller';
import { StudentProjectService } from './student-project.service';
import { StudentProjectCategoryService } from './category.service';
import { StudentProjectCategoryController } from './category.controller';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1d' },
    }),
    PrismaModule,
  ],
  controllers: [StudentProjectController, StudentProjectCategoryController],
  providers: [StudentProjectService, StudentProjectCategoryService],
})
export class StudentProjectModule {}
