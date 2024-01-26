import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UsersService } from './features/users/application/users-service';
import { UsersController } from './features/users/api/users-controller';
import { User, UserSchema } from './features/users/domain/users-entity';
import { UsersRepository } from './features/users/infrastructure/users-repository';
import { UsersQueryRepository } from './features/users/infrastructure/users-query-repository';
import { TestingController } from './features/testing/api/testing-controller';
import { BlogsService } from './features/blogs/application/blog-service';
import { BlogsQueryRepository } from './features/blogs/infrastructure/blogs-query-repository';
import { BlogsRepository } from './features/blogs/infrastructure/blogs-repository';
import { BlogsController } from './features/blogs/api/blogs-controller';
import { PostsService } from './features/posts/application/post-service';
import { PostsRepository } from './features/posts/infrastructure/posts-repository';
import { PostsQueryRepository } from './features/posts/infrastructure/posts-query-repository';
import { PostsController } from './features/posts/api/post-controller';
import { CommentsService } from './features/comments/application/comment-service';
import { CommentsRepository } from './features/comments/infrastructure/comments-reppository';
import { CommentsQueryRepository } from './features/comments/infrastructure/comments-query-repository';
import { CommentsController } from './features/comments/api/comments-controller';
import { Blog, BlogSchema } from './features/blogs/domain/blogs-entity';
import { Post, PostSchema } from './features/posts/domain/posts-entity';
import {
  CommentForPost,
  CommentSchema,
} from './features/comments/domain/comments-entity';
import { ServeStaticModule } from '@nestjs/serve-static';
import { join } from 'path';
import dotenv from 'dotenv';
import { JwtStrategy } from './features/users/application/strategies/jwt-strategy';
import { LocalStrategy } from './features/users/application/strategies/local-strategy';
import { JwtModule } from '@nestjs/jwt';
import { BasicStrategy } from './features/users/application/strategies/basic-strategy';
import { AuthQueryRepository } from './features/auth/infrastructure/auth-query-repository';
import { AuthRepository } from './features/auth/infrastructure/auth-repository';
import { AuthService } from './features/auth/application/auth-service';
import { Auth, AuthSchema } from './features/auth/domain/auth-entity';
import { AuthController } from './features/auth/api/dto/auth-controller';

dotenv.config();

const url = process.env.MONGO_URL;

console.log('mongo URL: ', url);

if (!url) {
  throw new Error('! URL doesn`t found');
}

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'swagger-static'),
      serveRoot: process.env.NODE_ENV === 'development' ? '/' : '/swagger',
    }),
    MongooseModule.forRoot(url, {
      dbName: 'nest',
    }),
    MongooseModule.forFeature([
      {
        name: User.name,
        schema: UserSchema,
      },
      {
        name: Blog.name,
        schema: BlogSchema,
      },
      {
        name: Post.name,
        schema: PostSchema,
      },
      {
        name: CommentForPost.name,
        schema: CommentSchema,
      },
      {
        name: Auth.name,
        schema: AuthSchema,
      },
    ]),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '60s' },
    }),
  ],
  controllers: [
    AppController,
    BlogsController,
    PostsController,
    UsersController,
    CommentsController,
    TestingController,
    AuthController,
  ],
  providers: [
    AppService,
    UsersService,
    UsersRepository,
    UsersQueryRepository,
    BlogsService,
    BlogsRepository,
    BlogsQueryRepository,
    PostsService,
    PostsRepository,
    PostsQueryRepository,
    CommentsService,
    CommentsRepository,
    CommentsQueryRepository,
    AuthService,
    AuthRepository,
    AuthQueryRepository,
    LocalStrategy,
    JwtStrategy,
    BasicStrategy,
  ],
})
export class AppModule {}
