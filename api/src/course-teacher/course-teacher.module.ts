import { Module } from '@nestjs/common';
import { CourseTeacherService } from './course-teacher.service';
import { CourseTeacherController } from './course-teacher.controller';
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
  controllers: [CourseTeacherController],
  providers: [CourseTeacherService],
})
export class CourseTeacherModule {}
