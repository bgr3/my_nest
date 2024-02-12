import { MiddlewareConsumer, Module, NestModule, RequestMethod } from '@nestjs/common';
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
import { CommentsRepository } from './features/comments/infrastructure/comments-repository';
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
import { SecurityController } from './features/security/api/dto/security-controller';
import { AuthEmailConfirmValidation, AuthPasswordRecoveryCodeValidation, AuthReSendEmailConfirmValidation, UserEmailValidation, UserLoginValidation } from './features/auth/api/dto/input/auth-input-validator';
import { AccessFrequencyMiddleware } from './infrastructure/middlewares/access-middleware';
import { AccessService } from './features/access/application/access-service';
import { LogRepository } from './features/access/infrastructure/access-log-repository';
import { AccessLog, AccessLogSchema } from './features/access/domain/access-log-entity';
import { AuthorizationCommentMiddleware, CommentExistMiddleware, PostExistMiddleware, PostValidationMiddleware } from './infrastructure/middlewares/comment-validation-middleware';
import { EmailManager } from './features/email-manager/application/email-manager';
import { CqrsModule } from '@nestjs/cqrs';
import { UsersTestAllDataUseCase } from './features/users/application/use-cases/users-testing-all-data-use-case';
import { UsersCreateUserUseCase } from './features/users/application/use-cases/users-create-user-use-case';
import { UsersCheckCredentialsUseCase } from './features/users/application/use-cases/users-check-crefentials-use-case';
import { UsersUpdateCodeForRecoveryPasswordUseCase } from './features/users/application/use-cases/users-update-code-for-recovery-password-use-case';
import { UsersChangePasswordUseCase } from './features/users/application/use-cases/users-change-password-use-case';
import { UsersDeleteUserUseCase } from './features/users/application/use-cases/users-delete-user-use-case';
import { BlogsTestAllDatasUseCase } from './features/blogs/application/use-cases/blogs-test-all-data-use-case';
import { BlogsCreateBlogUseCase } from './features/blogs/application/use-cases/blogs-create-blog-use-case';
import { BlogsUpdateBlogUseCase } from './features/blogs/application/use-cases/blogs-update-blog-use-case';
import { BlogsDeleteBlogUseCase } from './features/blogs/application/use-cases/blogs-delete-blog-use-case copy';
import { CommentsTestAllDataUseCase } from './features/comments/application/use-cases/comments-test-all-data-use-case';
import { CommentsCreateCommentUseCase } from './features/comments/application/use-cases/comments-create-comment-use-case';
import { CommentsUpdateCommentUseCase } from './features/comments/application/use-cases/comments-update-comment-use-case';
import { CommentsLikeStatusUseCase } from './features/comments/application/use-cases/comments-like-status-use-case';
import { CommentsDeleteCommentUseCase } from './features/comments/application/use-cases/comments-delete-comment-use-case';
import { PostsTestAllDataUseCase } from './features/posts/application/use-cases/posts-test-all-data-use-case';
import { PostsCreatePostUseCase } from './features/posts/application/use-cases/posts-create-post-use-case';
import { PostsUpdatePostUseCase } from './features/posts/application/use-cases/posts-update-post-use-case';
import { PostsLikeStatusUseCase } from './features/posts/application/use-cases/posts-like-status-use-case';
import { PostsDeletePostUseCase } from './features/posts/application/use-cases/posts-delete-post-use-case';
import { AccessTestAllDataUseCase } from './features/access/application/use-cases/access-test-all-data-use-case';
import { AccessCheckAccessFrequencyUseCase } from './features/access/application/use-cases/access-check-access-frequency-use-case';
import { AuthTestAllDataUseCase } from './features/auth/application/use-cases/auth-test-all-data-use-case';
import { AuthConfirmEmailUseCase } from './features/auth/application/use-cases/auth-confirm-email-use-case';
import { AuthRegisterUserSendEmailUseCase } from './features/auth/application/use-cases/auth-register-user-send-email-use-case';
import { AuthChangePasswordEmailUseCase } from './features/auth/application/use-cases/auth-change-password-email-use-case';
import { AuthResendEmailUseCase } from './features/auth/application/use-cases/auth-resend-email-use-case';
import { AuthGetMeByIdUseCase } from './features/auth/application/use-cases/auth-get-me-by-id-use-case';
import { AuthCreateAuthSessionUseCase } from './features/auth/application/use-cases/auth-create-auth-session-use-case copy';
import { AuthUpdateTokensUseCase } from './features/auth/application/use-cases/auth-update-tokens-use-case';
import { AuthGetAuthSessionsByTokenUseCase } from './features/auth/application/use-cases/auth-get-auth-session-by-token-use-case';
import { AuthDeleteAuthSessionsExcludeCurentUseCase } from './features/auth/application/use-cases/auth-delete-auth-session-exclude-current-use-case copy';
import { AuthDeleteSpecifiedAuthSessionByDeviceIdUseCase } from './features/auth/application/use-cases/auth-delete-specified-auth-session-by-device-id-use-case';
import { AuthDeleteAuthSessionByTokenUseCase } from './features/auth/application/use-cases/auth-delete-auth-session-by-token-use-case';
import { TrimPipe } from './infrastructure/pipes/body-trim-pipe';
import { UserIdentificationMiddleware } from './infrastructure/middlewares/user-identification-middleware copy';
import { BlogExistValidation } from './features/posts/api/dto/input/blogs-input-validator';

dotenv.config();

const url = process.env.MONGO_URL;

//console.log('mongo URL: ', url);

if (!url) {
  throw new Error('! URL doesn`t found');
}

const usersProviders = [
  UsersService,
  UsersRepository,
  UsersQueryRepository,
];

const blogsProviders = [
  BlogsService,
  BlogsRepository,
  BlogsQueryRepository,
];

const postsProviders = [
  PostsService,
  PostsRepository,
  PostsQueryRepository,
  BlogExistValidation,
];

const commentsProviders = [
  CommentsService,
  CommentsRepository,
  CommentsQueryRepository,
];

const strategiesProviders = [
  LocalStrategy,
  JwtStrategy,
  BasicStrategy,
];

const authProviders = [
  AuthService,
  AuthRepository,
  AuthQueryRepository,
  AuthEmailConfirmValidation,
  AuthPasswordRecoveryCodeValidation,
  AuthReSendEmailConfirmValidation,
  UserEmailValidation,
  UserLoginValidation,
];
const accessProviders = [
  AccessService,
  LogRepository,
];

const useCases = [
  UsersTestAllDataUseCase,
  UsersCreateUserUseCase,
  UsersCheckCredentialsUseCase,
  UsersUpdateCodeForRecoveryPasswordUseCase,
  UsersChangePasswordUseCase,
  UsersDeleteUserUseCase,
  BlogsTestAllDatasUseCase,
  BlogsCreateBlogUseCase,
  BlogsUpdateBlogUseCase,
  BlogsDeleteBlogUseCase,
  CommentsTestAllDataUseCase,
  CommentsCreateCommentUseCase,
  CommentsUpdateCommentUseCase,
  CommentsLikeStatusUseCase,
  CommentsDeleteCommentUseCase,
  PostsTestAllDataUseCase,
  PostsCreatePostUseCase,
  PostsUpdatePostUseCase,
  PostsLikeStatusUseCase,
  PostsDeletePostUseCase,
  AccessTestAllDataUseCase,
  AccessCheckAccessFrequencyUseCase,
  AuthTestAllDataUseCase,
  AuthConfirmEmailUseCase,
  AuthRegisterUserSendEmailUseCase,
  AuthChangePasswordEmailUseCase,
  AuthResendEmailUseCase,
  AuthResendEmailUseCase,
  AuthGetMeByIdUseCase,
  AuthCreateAuthSessionUseCase,
  AuthUpdateTokensUseCase,
  AuthGetAuthSessionsByTokenUseCase,
  AuthDeleteAuthSessionsExcludeCurentUseCase,
  AuthDeleteSpecifiedAuthSessionByDeviceIdUseCase,
  AuthDeleteAuthSessionByTokenUseCase,
];

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
      {      
        name: AccessLog.name,
        schema: AccessLogSchema,
      },
    ]),
    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '60s' },
    }),
    CqrsModule,
  ],
  controllers: [
    AppController,
    AuthController,
    BlogsController,
    PostsController,
    UsersController,
    CommentsController,
    TestingController,
    SecurityController,
  ],
  providers: [
    AppService,
    EmailManager,
    TrimPipe,
    ...usersProviders,
    ...blogsProviders,
       ...postsProviders,
    ...commentsProviders,
    ...strategiesProviders,
    ...authProviders,
    ...accessProviders,
    ...useCases,
  ],
})
export class AppModule implements NestModule {
  async configure(consumer: MiddlewareConsumer) {
    consumer
      // .apply(AccessFrequencyMiddleware)
      // .exclude(
      //   { path: 'auth/refresh-token', method: RequestMethod.POST },
      //   { path: 'auth/logout', method: RequestMethod.POST },
      //   { path: 'auth/me', method: RequestMethod.GET },
      // )
      // .forRoutes(AuthController)
      .apply(PostValidationMiddleware)
      .forRoutes(
        { path: 'post/*/comments', method: RequestMethod.POST },
        )
      .apply(PostExistMiddleware)
      .forRoutes({ path: 'post/*/like-status', method: RequestMethod.PUT })
      .apply(CommentExistMiddleware)
      .forRoutes({ path: 'comments/*/like-status', method: RequestMethod.PUT })
      .apply(UserIdentificationMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL}) 
      .apply(AuthorizationCommentMiddleware)
      .forRoutes({ path: 'comments/*', method: RequestMethod.PUT }, {path: 'comments/*', method: RequestMethod.DELETE}) 
      
  }
}