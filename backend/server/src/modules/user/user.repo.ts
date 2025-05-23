import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from './models/user.model';
import { Role } from '@modules/auth/models/role.model';
import { UserStatus } from '@common/constants/user.constant';
import PaginateUtil from 'src/shared/utils/paginate.util';

@Injectable()
export class UserRepo {
  constructor(@InjectModel(User) private userModel: typeof User) {}

  async findUserByEmail(email: string): Promise<User> {
    return this.userModel.findOne({ where: { usr_email: email } });
  }

  async createNewUser(user: User): Promise<User> {
    return this.userModel.create(user.toJSON());
  }

  async getUserRoleByUserId(userId: number): Promise<User> {
    return this.userModel.findByPk(userId, {
      include: [{ model: Role, required: false }],
    });
  }

  async findUserById(userId: number): Promise<User> {
    return this.userModel.findByPk(userId);
  }

  async updatePassword(password: string, userId: number): Promise<number> {
    const [affectedCount] = await this.userModel.update(
      { usr_password: password },
      { where: { usr_id: userId, usr_status: UserStatus.ACTIVE } },
    );
    return affectedCount;
  }

  async updateProfile(user: User, userId: number): Promise<number> {
    const [affectedCount] = await this.userModel.update(user.toJSON(), {
      where: { usr_id: userId, usr_status: UserStatus.ACTIVE },
    });
    return affectedCount;
  }

  async getListUserPaginate(
    page: number,
    limit: number,
    option: object = {},
  ): Promise<any> {
    const offset = (page - 1) * limit;
    const { rows: data, count: total } = await this.userModel.findAndCountAll({
      ...option,
      limit,
      offset,
      order: [['updatedAt', 'DESC']],
    });
    return {
      data,
      pagination: PaginateUtil.paginationReturn({ page, total, limit, offset }),
    };
  }
}
