import { MigrationInterface, QueryRunner } from "typeorm";

export class BloggerAllComments1719345210902 implements MigrationInterface {
    name = 'BloggerAllComments1719345210902'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "comment_for_post_orm" DROP COLUMN "postId"`);
        await queryRunner.query(`ALTER TABLE "comment_for_post_orm" ADD "postId" uuid NOT NULL`);
        await queryRunner.query(`ALTER TABLE "comment_for_post_orm" ADD CONSTRAINT "FK_5a405b68ae5b9fa681a2edcf4a0" FOREIGN KEY ("postId") REFERENCES "post_orm"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "comment_for_post_orm" DROP CONSTRAINT "FK_5a405b68ae5b9fa681a2edcf4a0"`);
        await queryRunner.query(`ALTER TABLE "comment_for_post_orm" DROP COLUMN "postId"`);
        await queryRunner.query(`ALTER TABLE "comment_for_post_orm" ADD "postId" character varying NOT NULL`);
    }

}
