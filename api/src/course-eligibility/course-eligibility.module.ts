import { Module } from '@nestjs/common';
import { CourseEligibilityService } from './course-eligibility.service';
import { CourseEligibilityController } from './course-eligibility.controller';
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
  controllers: [CourseEligibilityController],
  providers: [CourseEligibilityService],
})
export class CourseEligibilityModule {}
