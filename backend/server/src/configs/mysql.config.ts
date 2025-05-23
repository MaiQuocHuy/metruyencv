import { Injectable } from '@nestjs/common';
import { ConfigService, registerAs } from '@nestjs/config';
import {
  SequelizeModuleOptions,
  SequelizeOptionsFactory,
} from '@nestjs/sequelize';
import { Dialect } from 'sequelize';

export default registerAs('mysql-database', () => ({
  dialect: process.env.DB_DIALECT as Dialect,
  port: (process.env.DB_PORT || 3306) as number,
  host: process.env.DB_HOST || 'localhost',
  username: process.env.DB_USERNAME || 'default_user',
  password: process.env.DB_PASSWORD || 'default_password',
  database: process.env.DB_NAME_DB || 'default_db',
  autoLoadModels: true,
  logging: false,
  dialectOptions: {
    charset: 'utf8mb4',
  },
  // synchronize: true,
}));

// @Injectable()
// export class MysqlConfigService implements SequelizeOptionsFactory {
//   constructor(private configService: ConfigService) {}
//   createSequelizeOptions(): SequelizeModuleOptions {
//     return {
//       dialect: this.configService.get<string>('DB_DIALECT') as Dialect,
//       port: (this.configService.get<number>('DB_PORT') || 3306) as number,
//       host: this.configService.get('DB_HOST') || 'localhost',
//       username: this.configService.get<string>('DB_USERNAME') || 'default_user',
//       password:
//         this.configService.get<string>('DB_PASSWORD') || 'default_password',
//       database: this.configService.get<string>('DB_NAME_DB') || 'default_db',
//       autoLoadModels: true,
//       logging: false,
//       dialectOptions: {
//         charset: 'utf8mb4',
//       },
//       // synchronize: true,
//     };
//   }
// }
