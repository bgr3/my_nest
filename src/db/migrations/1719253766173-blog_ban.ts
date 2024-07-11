import { MigrationInterface, QueryRunner } from "typeorm";

export class BlogBan1719253766173 implements MigrationInterface {
    name = 'BlogBan1719253766173'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "blog_ban_orm" ("isBanned" boolean NOT NULL, "banDate" TIMESTAMP, "blogId" uuid NOT NULL, CONSTRAINT "PK_51f1415e9f7d5a80e7bcfd5a590" PRIMARY KEY ("blogId"))`);
        await queryRunner.query(`ALTER TABLE "blog_ban_orm" ADD CONSTRAINT "FK_51f1415e9f7d5a80e7bcfd5a590" FOREIGN KEY ("blogId") REFERENCES "blog_orm"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "blog_ban_orm" DROP CONSTRAINT "FK_51f1415e9f7d5a80e7bcfd5a590"`);
        await queryRunner.query(`DROP TABLE "blog_ban_orm"`);
    }

}
