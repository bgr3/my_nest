import { MigrationInterface, QueryRunner } from "typeorm";

export class BloggerBan1717776507466 implements MigrationInterface {
    name = 'BloggerBan1717776507466'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "user_blog_ban_orm" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "userId" uuid NOT NULL, "blogId" uuid NOT NULL, "isBanned" boolean NOT NULL, "banDate" TIMESTAMP, "banReason" character varying, CONSTRAINT "PK_8f2e8d68b67d793c146076857f9" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "user_blog_ban_orm" ADD CONSTRAINT "FK_f10f3a10236643cc135ec46ba91" FOREIGN KEY ("userId") REFERENCES "user_orm"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "user_blog_ban_orm" ADD CONSTRAINT "FK_3b4e85964591fd381519bc2860f" FOREIGN KEY ("blogId") REFERENCES "blog_orm"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_blog_ban_orm" DROP CONSTRAINT "FK_3b4e85964591fd381519bc2860f"`);
        await queryRunner.query(`ALTER TABLE "user_blog_ban_orm" DROP CONSTRAINT "FK_f10f3a10236643cc135ec46ba91"`);
        await queryRunner.query(`DROP TABLE "user_blog_ban_orm"`);
    }

}
