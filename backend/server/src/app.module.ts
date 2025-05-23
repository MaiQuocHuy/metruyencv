import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { ResponseInterceptor } from './common/interceptors/response.interceptor';
import { ConfigModule, ConfigService } from '@nestjs/config';
// import { MysqlConfigService } from './configs/mysql.config';
import mysqlConfig from './configs/mysql.config';
import { SequelizeModule } from '@nestjs/sequelize';
import { UserModule } from './modules/user/user.module';
import { AuthModule } from './modules/auth/auth.module';
import { CommonModule } from 'src/common/common.module';
import { AuthService } from '@modules/auth/auth.service';
import { CacheModule } from './shared/cache/cache.module';
import { CategoryModule } from './modules/category/category.module';
import { MangaModule } from './modules/manga/manga.module';
// import { DatabaseModule } from './configs/config.module';
import { FavoriteModule } from './modules/favorite/favorite.module';
import { ChapterModule } from './modules/chapter/chapter.module';
import { MulterModule } from '@nestjs/platform-express';
import { CloudinaryModule } from './shared/cloudinary/cloudinary.module';
import { PinataModule } from './shared/pinata/pinata.module';
import { Web3Module } from './shared/web3/web3.module';
import { CommentModule } from './modules/comment/comment.module';
import { ErrorReportModule } from './modules/error-report/error-report.module';
@Module({
  imports: [
    MulterModule.register({
      dest: './shared/uploads', // Thư mục lưu trữ ảnh
    }),
    ConfigModule.forRoot({
      cache: true,
      isGlobal: true,
    }), // Ensure configuration is loaded (dotenv support)
    SequelizeModule.forRootAsync(mysqlConfig.asProvider()),
    UserModule,
    AuthModule,
    CommonModule,
    CacheModule,
    CategoryModule,
    MangaModule,
    FavoriteModule,
    ChapterModule,
    CloudinaryModule,
    PinataModule,
    Web3Module,
    CommentModule,
    ErrorReportModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    AuthService,
    {
      provide: APP_INTERCEPTOR,
      useClass: ResponseInterceptor,
    },
  ],
})
export class AppModule {}
