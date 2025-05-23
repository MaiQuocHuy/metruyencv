import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { Category } from './models/category.model';
import { Op } from 'sequelize';

@Injectable()
export class CategoryRepo {
  constructor(@InjectModel(Category) private categoryModel: typeof Category) {}

  async findCategoryByName(name: string): Promise<Category> {
    return this.categoryModel.findOne({ where: { category_name: name } });
  }
  async findCategoryById(id: number): Promise<Category> {
    return this.categoryModel.findOne({ where: { category_id: id } });
  }

  async createCategory(category: Category): Promise<Category> {
    return this.categoryModel.create(category.toJSON());
  }

  async updateCategory(category: Category): Promise<number> {
    const [affectedCount] = await this.categoryModel.update(category.toJSON(), {
      where: { category_id: category.category_id },
    });
    return affectedCount;
  }

  async getAllCategories(option: object = {}): Promise<Array<Category>> {
    return this.categoryModel.findAll(option);
  }

  async deleteManyCategory(
    categoriesId: Array<number>,
    options: object = {},
  ): Promise<number> {
    const affectedCount = await this.categoryModel.destroy({
      where: {
        category_id: {
          [Op.in]: categoriesId,
        },
      },
      ...options,
    });
    return affectedCount;
  }
}
