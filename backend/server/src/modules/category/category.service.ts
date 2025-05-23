import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { CategoryRepo } from './category.repo';
import { CreateCategoryDto } from './dto/create-category.dto';
import Util from '@common/services/util.service';
import { Category } from './models/category.model';
import { CacheService } from 'src/shared/cache/cache.service';
import { Sequelize } from 'sequelize-typescript';

@Injectable()
export class CategoryService {
  constructor(
    private categoryRepo: CategoryRepo,
    private util: Util,
    private cacheService: CacheService,
    private sequelize: Sequelize,
  ) {}

  async createNewCategory(createCategoryDto: CreateCategoryDto) {
    const foundCategory = await this.categoryRepo.findCategoryByName(
      createCategoryDto.category_name,
    );
    if (foundCategory)
      throw new HttpException(
        'Category already exists',
        HttpStatus.BAD_REQUEST,
      );

    const category = await this.categoryRepo.createCategory(
      new Category({
        category_id: this.util.generateIdByTime({ fitWithInteger: true }),
        category_name: createCategoryDto.category_name,
      }),
    );
    if (!category)
      throw new HttpException('Category not created', HttpStatus.BAD_REQUEST);

    // delete cache
    const cacheKey = `all_categories`;
    await this.cacheService.delete(cacheKey);

    return { category };
  }

  async updateCategory(
    categoryId: number,
    createCategoryDto: CreateCategoryDto,
  ): Promise<number> {
    const foundCategory = await this.categoryRepo.findCategoryById(categoryId);
    if (!foundCategory)
      throw new HttpException('Category not exists', HttpStatus.BAD_REQUEST);

    foundCategory.category_name = createCategoryDto.category_name;
    const isUpdated = await this.categoryRepo.updateCategory(foundCategory);
    if (!isUpdated)
      throw new HttpException(
        'Can not update category',
        HttpStatus.BAD_REQUEST,
      );

    // delete cache
    const cacheKey = `all_categories`;
    await this.cacheService.delete(cacheKey);

    return isUpdated;
  }

  async getAllCategories(): Promise<Array<Category>> {
    const cacheKey = `all_categories`;
    const cacheCategories = await this.cacheService.get(cacheKey);
    if (cacheCategories) {
      const categories = (cacheCategories as Category[]).map((value) => {
        const category = new Category({ ...(value as Category) });
        return category.get({ plain: true });
      });

      return categories;
    }
    const categories = await this.categoryRepo.getAllCategories({ raw: true });
    await this.cacheService.set(cacheKey, categories);
    return categories;
  }

  async getCategoryById(categoryId: number): Promise<Category> {
    const allCategories = await this.getAllCategories();
    const category = allCategories.find((category) => {
      return category.category_id === categoryId;
    });
    if (!category)
      throw new HttpException('Category not found', HttpStatus.BAD_REQUEST);
    return category;
  }

  async deleteManyCategories(categoriesId: number[]): Promise<number> {
    const allCategories = await this.getAllCategories();
    const categories = allCategories
      .filter((category) => categoriesId.includes(category.category_id))
      .map((category) => category.category_id);

    // Check if all requested IDs exist
    if (categories.length !== categoriesId.length) {
      throw new HttpException(
        'Some categories not found',
        HttpStatus.BAD_REQUEST,
      );
    }

    const isDeleted = this.sequelize.transaction(async (t) => {
      const deleteCategories = await this.categoryRepo.deleteManyCategory(
        categories,
        { transaction: t },
      );
      if (!deleteCategories)
        throw new HttpException(
          'Can not delete category',
          HttpStatus.BAD_REQUEST,
        );
      return deleteCategories;
    });

    // delete cache
    const cacheKey = `all_categories`;
    await this.cacheService.delete(cacheKey);

    return isDeleted;
  }
}
