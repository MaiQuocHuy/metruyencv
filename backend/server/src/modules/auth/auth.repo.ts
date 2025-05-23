import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { KeyToken } from './models/keyToken.model';
import { RoleGrants } from './models/rolegrants.model';
import { Role } from './models/role.model';
import { Resource } from './models/resource.model';
import { User } from '@modules/user/models/user.model';

@Injectable()
export class AuthRepo {
  constructor(
    @InjectModel(KeyToken) private keyTokenModel: typeof KeyToken,
    @InjectModel(RoleGrants) private roleGrantsModel: typeof RoleGrants,
    @InjectModel(Role) private roleModel: typeof Role,
    @InjectModel(Resource) private resourceModel: typeof Resource,
  ) {}

  async createKeyToken({
    id,
    user_id,
    refresh_key,
    public_key,
    refresh_token,
  }): Promise<KeyToken> {
    try {
      return await this.keyTokenModel.create({
        id,
        user_id,
        refresh_key,
        public_key,
        refresh_token,
      });
    } catch (error) {
      throw new HttpException(
        error.message,
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async updateOrCreateKeyTokenByUserId<T>(
    {
      id,
      user_id,
      refresh_key,
      public_key,
      refresh_token,
    }: {
      id?: string;
      user_id: number;
      refresh_key: string;
      public_key: string;
      refresh_token: string;
    },
    option: object = { returning: true },
  ): Promise<T> {
    const upsertData: any = {
      user_id,
      refresh_key,
      public_key,
      refresh_token,
    };
    if (id) {
      upsertData.id = id;
    }
    const token = await this.keyTokenModel.upsert(upsertData, option);
    return token as T;
  }

  async findKeyTokenByUserId(user_id: number): Promise<KeyToken> {
    return await this.keyTokenModel.findOne({
      where: { user_id },
    });
  }

  async deleteKeyTokenByUserId(user_id: number): Promise<number> {
    return await this.keyTokenModel.destroy({ where: { user_id } });
  }

  async deleteKeyTokenById(id: number): Promise<number> {
    return await this.keyTokenModel.destroy({ where: { id } });
  }

  async updateRefreshTokenUsedByUserId(
    user_id: number,
    refresh_token: string,
    refresh_tokens_used: object,
  ): Promise<number> {
    const [affectedCount] = await this.keyTokenModel.update(
      {
        refresh_token,
        refresh_tokens_used,
      },
      { where: { user_id: user_id }, returning: true },
    );
    return affectedCount;
  }

  async getAllRoleGrants(): Promise<RoleGrants[]> {
    const roleGrants = await this.roleGrantsModel.findAll({
      include: [
        {
          model: Role,
          required: false,
        },
        {
          model: Resource,
          required: false,
        },
      ],
    });
    // console.log(
    //   `roleGrants::${JSON.stringify(roleGrants.map((grant) => grant.toJSON()))}`,
    // );
    return roleGrants;
  }

  async getRoleByRoleSlug(roleSlug: string): Promise<Role> {
    return await this.roleModel.findOne({
      where: { role_slug: roleSlug },
    });
  }
}
