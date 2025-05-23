import { Module } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';
import { SequelizeModule } from '@nestjs/sequelize';
import { Category } from './models/category.model';
import { CategoryRepo } from './category.repo';
import { CacheModule } from 'src/shared/cache/cache.module';

@Module({
  imports: [SequelizeModule.forFeature([Category]), CacheModule],
  controllers: [CategoryController],
  providers: [CategoryService, CategoryRepo],
  exports: [CategoryService],
})
export class CategoryModule {}
