import { Module } from '@nestjs/common';
import { CourseModuleService } from './course-module.service';
import { CourseModuleController } from './course-module.controller';
import { JwtModule } from '@nestjs/jwt';
import { PrismaModule } from 'src/prisma.module';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '1d' },
    }),
    PrismaModule,
  ],
  controllers: [CourseModuleController],
  providers: [CourseModuleService],
})
export class CourseModuleModule {}
