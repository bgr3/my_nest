import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod,
} from '@nestjs/common';
import { CqrsModule } from '@nestjs/cqrs';
import { JwtModule } from '@nestjs/jwt';
import { ScheduleModule } from '@nestjs/schedule';
import { ServeStaticModule } from '@nestjs/serve-static';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import dotenv from 'dotenv';
import { join } from 'path';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FilesStorageAdapter } from './base/adapters/files-storage-adapter';
import { S3StorageAdapter } from './base/adapters/s3-storage-adapter';
import { AccessService } from './features/access/application/access-service';
import { AccessCheckAccessFrequencyUseCase } from './features/access/application/use-cases/access-check-access-frequency-use-case';
import { AccessTestAllDataUseCase } from './features/access/application/use-cases/access-test-all-data-use-case';
import { AccessLogORM } from './features/access/domain/access-log-orm-entity';
import { LogORMRepository } from './features/access/infrastructure/access-log-orm-repository';
import { AuthController } from './features/auth/api/dto/auth-controller';
import {
  AuthEmailConfirmValidation,
  AuthPasswordRecoveryCodeValidation,
  AuthReSendEmailConfirmValidation,
  UserEmailValidation,
  UserLoginValidation,
} from './features/auth/api/dto/input/auth-input-validator';
import { AuthService } from './features/auth/application/auth-service';
import { AuthChangePasswordEmailUseCase } from './features/auth/application/use-cases/auth-change-password-email-use-case';
import { AuthConfirmEmailUseCase } from './features/auth/application/use-cases/auth-confirm-email-use-case';
import { AuthCreateAuthSessionUseCase } from './features/auth/application/use-cases/auth-create-auth-session-use-case';
import { AuthDeleteAllAuthSessionsUseCase } from './features/auth/application/use-cases/auth-delete-all-auth-sessions-use-case';
import { AuthDeleteAuthSessionByTokenUseCase } from './features/auth/application/use-cases/auth-delete-auth-session-by-token-use-case';
import { AuthDeleteAuthSessionsExcludeCurentUseCase } from './features/auth/application/use-cases/auth-delete-auth-session-exclude-current-use-case';
import { AuthDeleteSpecifiedAuthSessionByDeviceIdUseCase } from './features/auth/application/use-cases/auth-delete-specified-auth-session-by-device-id-use-case';
import { AuthGetAuthSessionsByTokenUseCase } from './features/auth/application/use-cases/auth-get-auth-session-by-token-use-case';
import { AuthGetMeByIdUseCase } from './features/auth/application/use-cases/auth-get-me-by-id-use-case';
import { AuthRegisterUserSendEmailUseCase } from './features/auth/application/use-cases/auth-register-user-send-email-use-case';
import { AuthResendEmailUseCase } from './features/auth/application/use-cases/auth-resend-email-use-case';
import { AuthTestAllDataUseCase } from './features/auth/application/use-cases/auth-test-all-data-use-case';
import { AuthUpdateTokensUseCase } from './features/auth/application/use-cases/auth-update-tokens-use-case';
import { AuthORM } from './features/auth/domain/auth-orm-entity';
import { JWTTokens } from './features/auth/domain/tokens-orm-entity';
import { AuthORMQueryRepository } from './features/auth/infrastructure/orm/auth-orm-query-repository';
import { AuthORMRepository } from './features/auth/infrastructure/orm/auth-orm-repository';
import { BlogsBloggerController } from './features/blogs/api/blogs-blogger-controller';
import { BlogsController } from './features/blogs/api/blogs-controller';
import { BlogsSAController } from './features/blogs/api/blogs-sa-controller';
import { BlogsService } from './features/blogs/application/blog-service';
import { BlogsBanUnbanUseCase } from './features/blogs/application/use-cases/blogs-ban-unban-use-case';
import { BlogsBindBlogUseCase } from './features/blogs/application/use-cases/blogs-bind-blog-use-case';
import { BlogsCreateBlogUseCase } from './features/blogs/application/use-cases/blogs-create-blog-use-case';
import { BlogsDeleteBlogUseCase } from './features/blogs/application/use-cases/blogs-delete-blog-use-case';
import { BlogsTestAllDatasUseCase } from './features/blogs/application/use-cases/blogs-test-all-data-use-case';
import { BlogsUpdateBlogUseCase } from './features/blogs/application/use-cases/blogs-update-blog-use-case';
import { BlogsUploadBackgroundWallpaperUseCase } from './features/blogs/application/use-cases/blogs-upload-background-wallpaper-use-case';
import { BlogBanORM } from './features/blogs/domain/blogs-ban-orm-entity';
import { BlogORM } from './features/blogs/domain/blogs-orm-entity';
import { BlogsORMQueryRepository } from './features/blogs/infrastructure/orm/blogs-orm-query-repository';
import { BlogsORMRepository } from './features/blogs/infrastructure/orm/blogs-orm-repository';
import { CommentsController } from './features/comments/api/comments-controller';
import { CommentsService } from './features/comments/application/comment-service';
import { CommentsCreateCommentUseCase } from './features/comments/application/use-cases/comments-create-comment-use-case';
import { CommentsDeleteCommentUseCase } from './features/comments/application/use-cases/comments-delete-comment-use-case';
import { CommentsLikeStatusUseCase } from './features/comments/application/use-cases/comments-like-status-use-case';
import { CommentsTestAllDataUseCase } from './features/comments/application/use-cases/comments-test-all-data-use-case';
import { CommentsUpdateCommentUseCase } from './features/comments/application/use-cases/comments-update-comment-use-case';
import { CommentLikesInfoORM } from './features/comments/domain/comments-likes-info-orm-entity';
import { CommentForPostORM } from './features/comments/domain/comments-orm-entity';
import { CommentsORMQueryRepository } from './features/comments/infrastructure/orm/comments-orm-query-repository';
import { CommentsORMRepository } from './features/comments/infrastructure/orm/comments-orm-repository';
import { EmailManager } from './features/email-manager/application/email-manager';
import { QuizController } from './features/pair-quiz-game/api/quiz-controller';
import { QuizSAController } from './features/pair-quiz-game/api/quiz-sa-controller';
import { QuizAnswerUseCase } from './features/pair-quiz-game/application/commands/quiz-answer-game-use-case';
import { QuizCreateGameUseCase } from './features/pair-quiz-game/application/commands/quiz-create-game-use-case';
import { QuizCreateQuestionUseCase } from './features/pair-quiz-game/application/commands/quiz-create-question-use-case';
import { QuizCreateStatisticUseCase } from './features/pair-quiz-game/application/commands/quiz-create-statistic-game-use-case';
import { QuizDeleteQuestionUseCase } from './features/pair-quiz-game/application/commands/quiz-delete-question-use-case';
import { QuizPublishUnpublishQuestionUseCase } from './features/pair-quiz-game/application/commands/quiz-publish-question-use-case';
import { QuizTestAllDataUseCase } from './features/pair-quiz-game/application/commands/quiz-test-all-data-use-case';
import { QuizUpdateQuestionUseCase } from './features/pair-quiz-game/application/commands/quiz-update-question-use-case';
import { AnswerHistoryORM } from './features/pair-quiz-game/domain/answers-orm-entity';
import { GameORM } from './features/pair-quiz-game/domain/game-orm-entity';
import { GameQuestionsORM } from './features/pair-quiz-game/domain/game-qusestions-orm-entity';
import { PlayerProgressORM } from './features/pair-quiz-game/domain/player-progress-orm-entity';
import { QuestionORM } from './features/pair-quiz-game/domain/questions-orm-entity';
import { StatisticORM } from './features/pair-quiz-game/domain/statistic-orm-entity';
import { GameORMQueryRepository } from './features/pair-quiz-game/infrastructure/game-orm-query-repository';
import { GameORMRepository } from './features/pair-quiz-game/infrastructure/game-orm-repository';
import { QuestionORMQueryRepository } from './features/pair-quiz-game/infrastructure/question-orm-query-repository';
import { QuestionORMRepository } from './features/pair-quiz-game/infrastructure/question-orm-repository';
import { StatisticORMQueryRepository } from './features/pair-quiz-game/infrastructure/statistic-orm-query-repository';
import { StatisticORMRepository } from './features/pair-quiz-game/infrastructure/statistic-orm-repository';
import { BlogExistValidation } from './features/posts/api/dto/input/blogs-input-validator';
import { PostsController } from './features/posts/api/post-controller';
import { PostsService } from './features/posts/application/post-service';
import { PostsCreatePostUseCase } from './features/posts/application/use-cases/posts-create-post-use-case';
import { PostsDeletePostUseCase } from './features/posts/application/use-cases/posts-delete-post-use-case';
import { PostsLikeStatusUseCase } from './features/posts/application/use-cases/posts-like-status-use-case';
import { PostsTestAllDataUseCase } from './features/posts/application/use-cases/posts-test-all-data-use-case';
import { PostsUpdatePostUseCase } from './features/posts/application/use-cases/posts-update-post-use-case';
import { PostLikesInfoORM } from './features/posts/domain/posts-likesinfo-orm-entity';
import { PostORM } from './features/posts/domain/posts-orm-entity';
import { PostsORMQueryRepository } from './features/posts/infrastructure/orm/posts-orm-query-repository';
import { PostsORMRepository } from './features/posts/infrastructure/orm/posts-orm-repository';
import { SecurityController } from './features/security/api/dto/security-controller';
import { TestingController } from './features/testing/api/testing-controller';
import { UsersBloggerController } from './features/users/api/users-blogger-controller';
import { UsersController } from './features/users/api/users-controller';
import { UserCreatedHandler } from './features/users/application/events-handlers/log-created-user.event.handler';
import { BasicStrategy } from './features/users/application/strategies/basic-strategy';
import { JwtStrategy } from './features/users/application/strategies/jwt-strategy';
import { LocalStrategy } from './features/users/application/strategies/local-strategy';
import { UsersBanUnbanUseCase } from './features/users/application/use-cases/users-ban-unban-use-case';
import { UsersBloggerBanUnbanUseCase } from './features/users/application/use-cases/users-blogger-ban-unban-use-case';
import { UsersChangePasswordUseCase } from './features/users/application/use-cases/users-change-password-use-case';
import { UsersCheckCredentialsUseCase } from './features/users/application/use-cases/users-check-credentials-use-case';
import { UsersCreateUserUseCase } from './features/users/application/use-cases/users-create-user-use-case';
import { UsersDeleteUserUseCase } from './features/users/application/use-cases/users-delete-user-use-case';
import { UsersTestAllDataUseCase } from './features/users/application/use-cases/users-testing-all-data-use-case';
import { UsersUpdateCodeForRecoveryPasswordUseCase } from './features/users/application/use-cases/users-update-code-for-recovery-password-use-case';
import { UsersService } from './features/users/application/users-service';
import { EmailConfirmation } from './features/users/domain/entities/email-confirmation-orm-entity';
import { UserBanORM } from './features/users/domain/entities/users-ban-orm-entity';
import { UserBlogBanORM } from './features/users/domain/entities/users-blog-ban-orm-entity';
import { UserORM } from './features/users/domain/entities/users-orm-entity';
import { UsersORMQueryRepository } from './features/users/infrastructure/orm/users-orm-query-repository';
import { UsersORMRepository } from './features/users/infrastructure/orm/users-orm-repository';
import {
  AuthorizationBloggerBanMiddleware,
  AuthorizationBlogMiddleware,
} from './infrastructure/middlewares/blog-validation-middleware';
import {
  AuthorizationCommentMiddleware,
  BannedUserCommentMiddleware,
  CommentExistMiddleware,
  PostExistMiddleware,
  PostValidationMiddleware,
} from './infrastructure/middlewares/comment-validation-middleware';
import { QuizGameAnswerUserValidationMiddleware } from './infrastructure/middlewares/quiz-game-answer-user-validation-middleware';
import { QuizGameConnectValidationMiddleware } from './infrastructure/middlewares/quiz-game-connect-validation-middleware';
import { QuizGameUserSecurityMiddleware } from './infrastructure/middlewares/quiz-game-user-security-middleware';
import { AuthorizationSecurityMiddleware } from './infrastructure/middlewares/security-validation-middleware';
import { UserIdentificationMiddleware } from './infrastructure/middlewares/user-identification-middleware';
import { TrimPipe } from './infrastructure/pipes/body-trim-pipe';

dotenv.config();

const url = process.env.MONGO_URL;
const postgresUrl = process.env.POSTGRES_NEON_URL;

if (!url) {
  throw new Error('! URL doesn`t found');
}

if (!postgresUrl) {
  throw new Error('! PostgresURL doesn`t found');
}

export const postgresParam: TypeOrmModuleOptions = {
  type: 'postgres',
  url: postgresUrl,
  // database: 'nestORM',
  // namingStrategy:
  // logging: ['query'],
  autoLoadEntities: true,
  synchronize: false,
};

const adapterProviders = [
  { provide: FilesStorageAdapter, useClass: S3StorageAdapter },
];

const usersProviders = [
  UsersService,
  UsersORMRepository,
  UsersORMQueryRepository,
];

const blogsProviders = [
  BlogsService,
  BlogsORMRepository,
  BlogsORMQueryRepository,
];

const postsProviders = [
  PostsService,
  BlogExistValidation,
  PostsORMRepository,
  PostsORMQueryRepository,
];

const commentsProviders = [
  CommentsService,
  CommentsORMRepository,
  CommentsORMQueryRepository,
];

const strategiesProviders = [LocalStrategy, JwtStrategy, BasicStrategy];

const authProviders = [
  AuthService,
  AuthEmailConfirmValidation,
  AuthPasswordRecoveryCodeValidation,
  AuthReSendEmailConfirmValidation,
  UserEmailValidation,
  UserLoginValidation,
  AuthORMRepository,
  AuthORMQueryRepository,
];

const quizProviders = [
  QuestionORMRepository,
  QuestionORMQueryRepository,
  GameORMRepository,
  GameORMQueryRepository,
  StatisticORMRepository,
  StatisticORMQueryRepository,
];

const accessProviders = [AccessService, LogORMRepository];

const useCases = [
  UsersTestAllDataUseCase,
  UsersCreateUserUseCase,
  UsersCheckCredentialsUseCase,
  UsersUpdateCodeForRecoveryPasswordUseCase,
  UsersChangePasswordUseCase,
  UsersDeleteUserUseCase,
  UsersBanUnbanUseCase,
  UsersBloggerBanUnbanUseCase,
  BlogsTestAllDatasUseCase,
  BlogsCreateBlogUseCase,
  BlogsBindBlogUseCase,
  BlogsUpdateBlogUseCase,
  BlogsDeleteBlogUseCase,
  BlogsBanUnbanUseCase,
  BlogsUploadBackgroundWallpaperUseCase,
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
  AuthDeleteAllAuthSessionsUseCase,
  UsersBanUnbanUseCase,
  AuthDeleteAuthSessionByTokenUseCase,
  QuizCreateQuestionUseCase,
  QuizDeleteQuestionUseCase,
  QuizPublishUnpublishQuestionUseCase,
  QuizUpdateQuestionUseCase,
  QuizCreateQuestionUseCase,
  QuizCreateGameUseCase,
  QuizTestAllDataUseCase,
  QuizAnswerUseCase,
  QuizCreateStatisticUseCase,
];

const handlers = [UserCreatedHandler];

const entities = [
  UserORM,
  EmailConfirmation,
  AuthORM,
  JWTTokens,
  AccessLogORM,
  BlogORM,
  BlogBanORM,
  PostORM,
  PostLikesInfoORM,
  CommentForPostORM,
  CommentLikesInfoORM,
  QuestionORM,
  GameORM,
  GameQuestionsORM,
  PlayerProgressORM,
  AnswerHistoryORM,
  StatisticORM,
  UserBanORM,
  UserBlogBanORM,
];

@Module({
  imports: [
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'swagger-static'),
      serveRoot: process.env.NODE_ENV === 'development' ? '/' : '/swagger',
    }),

    TypeOrmModule.forRoot(postgresParam),

    TypeOrmModule.forFeature([...entities]),

    JwtModule.register({
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '60s' },
    }),
    CqrsModule,
    ScheduleModule.forRoot(),
  ],
  controllers: [
    AppController,
    AuthController,
    BlogsController,
    BlogsSAController,
    PostsController,
    UsersController,
    UsersBloggerController,
    CommentsController,
    TestingController,
    SecurityController,
    QuizController,
    QuizSAController,
    BlogsSAController,
    BlogsBloggerController,
  ],
  providers: [
    AppService,
    EmailManager,
    TrimPipe,
    // TasksService,
    ...adapterProviders,
    ...usersProviders,
    ...blogsProviders,
    ...postsProviders,
    ...commentsProviders,
    ...strategiesProviders,
    ...authProviders,
    ...accessProviders,
    ...quizProviders,
    ...useCases,
    ...handlers,
  ],
})
export class AppModule implements NestModule {
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
  async configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(UserIdentificationMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL })
      // .apply(AccessFrequencyMiddleware)
      // .exclude(
      //   { path: 'auth/refresh-token', method: RequestMethod.POST },
      //   { path: 'auth/logout', method: RequestMethod.POST },
      //   { path: 'auth/me', method: RequestMethod.GET },
      // )
      // .forRoutes(AuthController)
      .apply(PostValidationMiddleware)
      .forRoutes({ path: 'posts/*/comments', method: RequestMethod.POST })
      .apply(BannedUserCommentMiddleware)
      .forRoutes({ path: 'posts/*/comments', method: RequestMethod.POST })
      .apply(PostExistMiddleware)
      .forRoutes({ path: 'posts/*/like-status', method: RequestMethod.PUT })
      .apply(CommentExistMiddleware)
      .forRoutes({ path: 'comments/*/like-status', method: RequestMethod.PUT })
      .apply(AuthorizationCommentMiddleware)
      .exclude({ path: 'comments/:id/like-status', method: RequestMethod.PUT })
      .forRoutes(
        { path: 'comments/*', method: RequestMethod.PUT },
        { path: 'comments/*', method: RequestMethod.DELETE },
      )
      .apply(AuthorizationSecurityMiddleware)
      .forRoutes({ path: 'security/devices/*', method: RequestMethod.DELETE })
      .apply(QuizGameUserSecurityMiddleware)
      .exclude({
        path: 'pair-game-quiz/pairs/my-current',
        method: RequestMethod.GET,
      })
      .forRoutes({
        path: 'pair-game-quiz/pairs/*',
        method: RequestMethod.GET,
      })
      .apply(QuizGameConnectValidationMiddleware)
      .forRoutes({
        path: 'pair-game-quiz/pairs/connection',
        method: RequestMethod.POST,
      })
      .apply(QuizGameAnswerUserValidationMiddleware)
      .forRoutes({
        path: 'pair-game-quiz/pairs/my-current/answers',
        method: RequestMethod.POST,
      })
      .apply(AuthorizationBlogMiddleware)
      .forRoutes({
        path: 'blogger/blogs/*',
        method: RequestMethod.ALL,
      })
      .apply(AuthorizationBlogMiddleware)
      .forRoutes({
        path: 'blogger/users/blog/*',
        method: RequestMethod.GET,
      })
      .apply(AuthorizationBloggerBanMiddleware)
      .forRoutes({
        path: 'blogger/users/*/ban',
        method: RequestMethod.PUT,
      });
  }
}
