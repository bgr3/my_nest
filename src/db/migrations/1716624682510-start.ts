import { MigrationInterface, QueryRunner } from 'typeorm';

export class Start1716624682510 implements MigrationInterface {
  name = 'Start1716624682510';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "post_likes_info_orm" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "ownerId" uuid NOT NULL, "addedAt" character varying NOT NULL, "likeStatus" character varying NOT NULL, "postId" uuid NOT NULL, CONSTRAINT "PK_22de31701ba2ec8e7bf777c2aaf" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "post_orm" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying NOT NULL, "shortDescription" character varying NOT NULL, "content" character varying NOT NULL, "blogId" uuid NOT NULL, "createdAt" character varying NOT NULL, CONSTRAINT "PK_5e39320d6f9900a9b42f0e553d3" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "blog_orm" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying COLLATE "C" NOT NULL, "description" character varying NOT NULL, "websiteUrl" character varying NOT NULL, "createdAt" character varying NOT NULL, "isMembership" boolean NOT NULL, "blogOwnerInfoId" uuid NOT NULL, CONSTRAINT "PK_138b665280101e97fb5327875e9" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "comment_for_post_orm" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "content" character varying NOT NULL, "commentatorInfoId" uuid NOT NULL, "createdAt" character varying NOT NULL, "postId" character varying NOT NULL, CONSTRAINT "PK_ed61fcad9894439ca108d43459e" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "comment_likes_info_orm" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "ownerId" uuid NOT NULL, "addedAt" character varying NOT NULL, "likeStatus" character varying NOT NULL, "commentId" uuid NOT NULL, CONSTRAINT "PK_82788301c22da590c53a86cbecf" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "answer_history_orm" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "questionId" character varying NOT NULL, "answerStatus" character varying NOT NULL, "addedAt" TIMESTAMP NOT NULL, "playerProgressId" uuid NOT NULL, CONSTRAINT "PK_3be48e2bde21f08bbfc28e65b9a" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "question_orm" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "body" character varying NOT NULL, "correctAnswers" character varying array NOT NULL, "published" boolean NOT NULL, "createdAt" TIMESTAMP NOT NULL, "updatedAt" TIMESTAMP, CONSTRAINT "PK_969f5da88728130b8274c97ac41" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "game_questions_orm" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "gameId" uuid NOT NULL, "questionId" uuid NOT NULL, "questionNumber" integer NOT NULL, CONSTRAINT "PK_818e46810851295c222e22fd111" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "game_orm" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "status" character varying NOT NULL, "pairCreatedDate" TIMESTAMP, "startGameDate" TIMESTAMP, "finishGameDate" TIMESTAMP, CONSTRAINT "PK_70019f3b144c0e15dffddb08d11" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "player_progress_orm" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "playerId" uuid NOT NULL, "score" integer NOT NULL, "game1Id" uuid, "game2Id" uuid, CONSTRAINT "REL_d96bc52070c1fa7ba683d36aeb" UNIQUE ("game1Id"), CONSTRAINT "REL_e9c79d62159dacb85d77821e30" UNIQUE ("game2Id"), CONSTRAINT "PK_ed4af8cfc51f8423eab2542bbd9" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "statistic_orm" ("sumScore" integer NOT NULL, "avgScores" numeric NOT NULL, "gamesCount" integer NOT NULL, "winsCount" integer NOT NULL, "lossesCount" integer NOT NULL, "drawsCount" integer NOT NULL, "playerId" uuid NOT NULL, CONSTRAINT "PK_1dd3d41a7c1ae493ffd60032d98" PRIMARY KEY ("playerId"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "email_confirmation" ("confirmationCode" character varying NOT NULL, "expirationDate" date NOT NULL, "isConfirmed" boolean NOT NULL, "nextSend" date NOT NULL, "userId" uuid NOT NULL, CONSTRAINT "PK_28d3d3fbd7503f3428b94fd18cc" PRIMARY KEY ("userId"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "user_ban_orm" ("isBanned" boolean NOT NULL, "banDate" TIMESTAMP, "banReason" character varying, "userId" uuid NOT NULL, CONSTRAINT "PK_c57efb27bdb98453bb1ae6156ce" PRIMARY KEY ("userId"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "user_orm" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "login" character varying COLLATE "C" NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, "createdAt" character varying NOT NULL, CONSTRAINT "PK_4fdc636f375e88848512de33d6e" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "auth_orm" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "issuedAt" TIMESTAMP NOT NULL, "expiredAt" TIMESTAMP NOT NULL, "deviceId" character varying NOT NULL, "deviceIP" character varying NOT NULL, "deviceName" character varying NOT NULL, "userId" character varying NOT NULL, CONSTRAINT "PK_43fde127a40ebc05043a5431fe6" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "jwt_tokens" ("accessToken" character varying NOT NULL, "refreshToken" character varying NOT NULL, "authORMId" uuid NOT NULL, CONSTRAINT "PK_e575b99b2cab356150c3eb95a0d" PRIMARY KEY ("authORMId"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "access_log_orm" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "IP" character varying NOT NULL, "URL" character varying NOT NULL, "date" TIMESTAMP NOT NULL, CONSTRAINT "PK_b384057aa92260be88af765317d" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_likes_info_orm" ADD CONSTRAINT "FK_fe55b133eb4fc0e19f816d14202" FOREIGN KEY ("ownerId") REFERENCES "user_orm"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_likes_info_orm" ADD CONSTRAINT "FK_da3a48054fe7cd95334fe95cf62" FOREIGN KEY ("postId") REFERENCES "post_orm"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_orm" ADD CONSTRAINT "FK_5d71109527dc46de716174172c1" FOREIGN KEY ("blogId") REFERENCES "blog_orm"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "blog_orm" ADD CONSTRAINT "FK_a2d46fb3cc70df098b62d275f93" FOREIGN KEY ("blogOwnerInfoId") REFERENCES "user_orm"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "comment_for_post_orm" ADD CONSTRAINT "FK_6b2d88986543ef17688808b677c" FOREIGN KEY ("commentatorInfoId") REFERENCES "user_orm"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "comment_likes_info_orm" ADD CONSTRAINT "FK_272ae6ed6bb6573bb6722468127" FOREIGN KEY ("ownerId") REFERENCES "user_orm"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "comment_likes_info_orm" ADD CONSTRAINT "FK_3375753d24e84b0795abb027514" FOREIGN KEY ("commentId") REFERENCES "comment_for_post_orm"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "answer_history_orm" ADD CONSTRAINT "FK_7966ccc8052f06b193e80d972ff" FOREIGN KEY ("playerProgressId") REFERENCES "player_progress_orm"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "game_questions_orm" ADD CONSTRAINT "FK_c90cc76db0480347f00d2990542" FOREIGN KEY ("gameId") REFERENCES "game_orm"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "game_questions_orm" ADD CONSTRAINT "FK_7e73a8bd4ac682d7e4b8e1d7521" FOREIGN KEY ("questionId") REFERENCES "question_orm"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "player_progress_orm" ADD CONSTRAINT "FK_b63ed4b94999c15e3c20279d62a" FOREIGN KEY ("playerId") REFERENCES "user_orm"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "player_progress_orm" ADD CONSTRAINT "FK_d96bc52070c1fa7ba683d36aebd" FOREIGN KEY ("game1Id") REFERENCES "game_orm"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "player_progress_orm" ADD CONSTRAINT "FK_e9c79d62159dacb85d77821e30d" FOREIGN KEY ("game2Id") REFERENCES "game_orm"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "statistic_orm" ADD CONSTRAINT "FK_1dd3d41a7c1ae493ffd60032d98" FOREIGN KEY ("playerId") REFERENCES "user_orm"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "email_confirmation" ADD CONSTRAINT "FK_28d3d3fbd7503f3428b94fd18cc" FOREIGN KEY ("userId") REFERENCES "user_orm"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_ban_orm" ADD CONSTRAINT "FK_c57efb27bdb98453bb1ae6156ce" FOREIGN KEY ("userId") REFERENCES "user_orm"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "jwt_tokens" ADD CONSTRAINT "FK_e575b99b2cab356150c3eb95a0d" FOREIGN KEY ("authORMId") REFERENCES "auth_orm"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "jwt_tokens" DROP CONSTRAINT "FK_e575b99b2cab356150c3eb95a0d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_ban_orm" DROP CONSTRAINT "FK_c57efb27bdb98453bb1ae6156ce"`,
    );
    await queryRunner.query(
      `ALTER TABLE "email_confirmation" DROP CONSTRAINT "FK_28d3d3fbd7503f3428b94fd18cc"`,
    );
    await queryRunner.query(
      `ALTER TABLE "statistic_orm" DROP CONSTRAINT "FK_1dd3d41a7c1ae493ffd60032d98"`,
    );
    await queryRunner.query(
      `ALTER TABLE "player_progress_orm" DROP CONSTRAINT "FK_e9c79d62159dacb85d77821e30d"`,
    );
    await queryRunner.query(
      `ALTER TABLE "player_progress_orm" DROP CONSTRAINT "FK_d96bc52070c1fa7ba683d36aebd"`,
    );
    await queryRunner.query(
      `ALTER TABLE "player_progress_orm" DROP CONSTRAINT "FK_b63ed4b94999c15e3c20279d62a"`,
    );
    await queryRunner.query(
      `ALTER TABLE "game_questions_orm" DROP CONSTRAINT "FK_7e73a8bd4ac682d7e4b8e1d7521"`,
    );
    await queryRunner.query(
      `ALTER TABLE "game_questions_orm" DROP CONSTRAINT "FK_c90cc76db0480347f00d2990542"`,
    );
    await queryRunner.query(
      `ALTER TABLE "answer_history_orm" DROP CONSTRAINT "FK_7966ccc8052f06b193e80d972ff"`,
    );
    await queryRunner.query(
      `ALTER TABLE "comment_likes_info_orm" DROP CONSTRAINT "FK_3375753d24e84b0795abb027514"`,
    );
    await queryRunner.query(
      `ALTER TABLE "comment_likes_info_orm" DROP CONSTRAINT "FK_272ae6ed6bb6573bb6722468127"`,
    );
    await queryRunner.query(
      `ALTER TABLE "comment_for_post_orm" DROP CONSTRAINT "FK_6b2d88986543ef17688808b677c"`,
    );
    await queryRunner.query(
      `ALTER TABLE "blog_orm" DROP CONSTRAINT "FK_a2d46fb3cc70df098b62d275f93"`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_orm" DROP CONSTRAINT "FK_5d71109527dc46de716174172c1"`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_likes_info_orm" DROP CONSTRAINT "FK_da3a48054fe7cd95334fe95cf62"`,
    );
    await queryRunner.query(
      `ALTER TABLE "post_likes_info_orm" DROP CONSTRAINT "FK_fe55b133eb4fc0e19f816d14202"`,
    );
    await queryRunner.query(`DROP TABLE "access_log_orm"`);
    await queryRunner.query(`DROP TABLE "jwt_tokens"`);
    await queryRunner.query(`DROP TABLE "auth_orm"`);
    await queryRunner.query(`DROP TABLE "user_orm"`);
    await queryRunner.query(`DROP TABLE "user_ban_orm"`);
    await queryRunner.query(`DROP TABLE "email_confirmation"`);
    await queryRunner.query(`DROP TABLE "statistic_orm"`);
    await queryRunner.query(`DROP TABLE "player_progress_orm"`);
    await queryRunner.query(`DROP TABLE "game_orm"`);
    await queryRunner.query(`DROP TABLE "game_questions_orm"`);
    await queryRunner.query(`DROP TABLE "question_orm"`);
    await queryRunner.query(`DROP TABLE "answer_history_orm"`);
    await queryRunner.query(`DROP TABLE "comment_likes_info_orm"`);
    await queryRunner.query(`DROP TABLE "comment_for_post_orm"`);
    await queryRunner.query(`DROP TABLE "blog_orm"`);
    await queryRunner.query(`DROP TABLE "post_orm"`);
    await queryRunner.query(`DROP TABLE "post_likes_info_orm"`);
  }
}
