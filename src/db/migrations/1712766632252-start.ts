import { MigrationInterface, QueryRunner } from 'typeorm';

export class Start1712766632252 implements MigrationInterface {
  name = 'Start1712766632252';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      /*sql*/ `CREATE TABLE "email_confirmation" ("confirmationCode" character varying NOT NULL, "expirationDate" date NOT NULL, "isConfirmed" boolean NOT NULL, "nextSend" date NOT NULL, "userId" uuid NOT NULL, CONSTRAINT "PK_28d3d3fbd7503f3428b94fd18cc" PRIMARY KEY ("userId"))`,
    );
    await queryRunner.query(
      /*sql*/ `CREATE TABLE "user_orm" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "login" character varying NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, "createdAt" character varying NOT NULL, CONSTRAINT "PK_4fdc636f375e88848512de33d6e" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      /*sql*/ `CREATE TABLE "post_likes_info_orm" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "userId" character varying NOT NULL, "login" character varying NOT NULL, "addedAt" character varying NOT NULL, "likeStatus" character varying NOT NULL, "postId" uuid NOT NULL, CONSTRAINT "PK_22de31701ba2ec8e7bf777c2aaf" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      /*sql*/ `CREATE TABLE "blog_orm" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "name" character varying NOT NULL, "description" character varying NOT NULL, "websiteUrl" character varying NOT NULL, "createdAt" character varying NOT NULL, "isMembership" boolean NOT NULL, CONSTRAINT "PK_138b665280101e97fb5327875e9" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      /*sql*/ `CREATE TABLE "post_orm" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying NOT NULL, "shortDescription" character varying NOT NULL, "content" character varying NOT NULL, "blogId" uuid NOT NULL, "createdAt" character varying NOT NULL, CONSTRAINT "PK_5e39320d6f9900a9b42f0e553d3" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      /*sql*/ `CREATE TABLE "commentator_info" ("userId" character varying NOT NULL, "userLogin" character varying NOT NULL, "commentId" uuid NOT NULL, CONSTRAINT "PK_079640fcf695968e2b38d584314" PRIMARY KEY ("commentId"))`,
    );
    await queryRunner.query(
      /*sql*/ `CREATE TABLE "comment_likes_info_orm" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "userId" character varying NOT NULL, "login" character varying NOT NULL, "addedAt" character varying NOT NULL, "likeStatus" character varying NOT NULL, "commentId" uuid NOT NULL, CONSTRAINT "PK_82788301c22da590c53a86cbecf" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      /*sql*/ `CREATE TABLE "comment_for_post_orm" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "content" character varying NOT NULL, "createdAt" character varying NOT NULL, "postId" character varying NOT NULL, CONSTRAINT "PK_ed61fcad9894439ca108d43459e" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      /*sql*/ `CREATE TABLE "auth_orm" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "issuedAt" TIMESTAMP NOT NULL, "expiredAt" TIMESTAMP NOT NULL, "deviceId" character varying NOT NULL, "deviceIP" character varying NOT NULL, "deviceName" character varying NOT NULL, "userId" character varying NOT NULL, CONSTRAINT "PK_43fde127a40ebc05043a5431fe6" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      /*sql*/ `CREATE TABLE "jwt_tokens" ("accessToken" character varying NOT NULL, "refreshToken" character varying NOT NULL, "authORMId" uuid NOT NULL, CONSTRAINT "PK_e575b99b2cab356150c3eb95a0d" PRIMARY KEY ("authORMId"))`,
    );
    await queryRunner.query(
      /*sql*/ `CREATE TABLE "access_log_orm" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "IP" character varying NOT NULL, "URL" character varying NOT NULL, "date" TIMESTAMP NOT NULL, CONSTRAINT "PK_b384057aa92260be88af765317d" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      /*sql*/ `ALTER TABLE "email_confirmation" ADD CONSTRAINT "FK_28d3d3fbd7503f3428b94fd18cc" FOREIGN KEY ("userId") REFERENCES "user_orm"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      /*sql*/ `ALTER TABLE "post_likes_info_orm" ADD CONSTRAINT "FK_da3a48054fe7cd95334fe95cf62" FOREIGN KEY ("postId") REFERENCES "post_orm"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      /*sql*/ `ALTER TABLE "post_orm" ADD CONSTRAINT "FK_5d71109527dc46de716174172c1" FOREIGN KEY ("blogId") REFERENCES "blog_orm"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      /*sql*/ `ALTER TABLE "commentator_info" ADD CONSTRAINT "FK_079640fcf695968e2b38d584314" FOREIGN KEY ("commentId") REFERENCES "comment_for_post_orm"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      /*sql*/ `ALTER TABLE "comment_likes_info_orm" ADD CONSTRAINT "FK_3375753d24e84b0795abb027514" FOREIGN KEY ("commentId") REFERENCES "comment_for_post_orm"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      /*sql*/ `ALTER TABLE "jwt_tokens" ADD CONSTRAINT "FK_e575b99b2cab356150c3eb95a0d" FOREIGN KEY ("authORMId") REFERENCES "auth_orm"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      /*sql*/ `ALTER TABLE "jwt_tokens" DROP CONSTRAINT "FK_e575b99b2cab356150c3eb95a0d"`,
    );
    await queryRunner.query(
      /*sql*/ `ALTER TABLE "comment_likes_info_orm" DROP CONSTRAINT "FK_3375753d24e84b0795abb027514"`,
    );
    await queryRunner.query(
      /*sql*/ `ALTER TABLE "commentator_info" DROP CONSTRAINT "FK_079640fcf695968e2b38d584314"`,
    );
    await queryRunner.query(
      /*sql*/ `ALTER TABLE "post_orm" DROP CONSTRAINT "FK_5d71109527dc46de716174172c1"`,
    );
    await queryRunner.query(
      /*sql*/ `ALTER TABLE "post_likes_info_orm" DROP CONSTRAINT "FK_da3a48054fe7cd95334fe95cf62"`,
    );
    await queryRunner.query(
      /*sql*/ `ALTER TABLE "email_confirmation" DROP CONSTRAINT "FK_28d3d3fbd7503f3428b94fd18cc"`,
    );
    await queryRunner.query(/*sql*/ `DROP TABLE "access_log_orm"`);
    await queryRunner.query(/*sql*/ `DROP TABLE "jwt_tokens"`);
    await queryRunner.query(/*sql*/ `DROP TABLE "auth_orm"`);
    await queryRunner.query(/*sql*/ `DROP TABLE "comment_for_post_orm"`);
    await queryRunner.query(/*sql*/ `DROP TABLE "comment_likes_info_orm"`);
    await queryRunner.query(/*sql*/ `DROP TABLE "commentator_info"`);
    await queryRunner.query(/*sql*/ `DROP TABLE "post_orm"`);
    await queryRunner.query(/*sql*/ `DROP TABLE "blog_orm"`);
    await queryRunner.query(/*sql*/ `DROP TABLE "post_likes_info_orm"`);
    await queryRunner.query(/*sql*/ `DROP TABLE "user_orm"`);
    await queryRunner.query(/*sql*/ `DROP TABLE "email_confirmation"`);
  }
}
