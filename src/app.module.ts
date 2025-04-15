import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ReviewsModule } from './reviews/reviews.module';
import { ReviewsService } from './reviews/reviews.service';
import { ReviewsController } from './reviews/reviews.controller';
import { PropertiesController } from './properties/properties.controller';
import { PropertiesService } from './properties/properties.service';
import { PropertiesModule } from './properties/properties.module';
import { PrismaModule } from './prisma/prisma.module';
import { ConfigModule } from '@nestjs/config';
@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    AuthModule,
    ReviewsModule,
    PropertiesModule,
    PrismaModule,
  ],
  controllers: [AppController, ReviewsController, PropertiesController],
  providers: [AppService, ReviewsService, PropertiesService],
})
export class AppModule {}
