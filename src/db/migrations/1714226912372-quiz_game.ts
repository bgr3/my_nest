import { MigrationInterface, QueryRunner } from "typeorm";

export class QuizGame1714226912372 implements MigrationInterface {
    name = 'QuizGame1714226912372'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "answer_history_orm" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "questionId" character varying NOT NULL, "answerStatus" character varying, "addedAt" TIMESTAMP NOT NULL, "playerProgressIdId" uuid, CONSTRAINT "PK_3be48e2bde21f08bbfc28e65b9a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "question_orm" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "body" character varying NOT NULL, "correctAnswers" character varying array NOT NULL, "published" boolean NOT NULL, "createdAt" TIMESTAMP NOT NULL, "updatedAt" TIMESTAMP, CONSTRAINT "PK_969f5da88728130b8274c97ac41" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "game_orm" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "status" character varying NOT NULL, "pairCreatedDate" TIMESTAMP, "startGameDate" TIMESTAMP, "finishGameDate" TIMESTAMP, CONSTRAINT "PK_70019f3b144c0e15dffddb08d11" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "player_progress_orm" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "playerId" uuid NOT NULL, "score" integer, "game1Id" uuid, "game2Id" uuid, CONSTRAINT "REL_d96bc52070c1fa7ba683d36aeb" UNIQUE ("game1Id"), CONSTRAINT "REL_e9c79d62159dacb85d77821e30" UNIQUE ("game2Id"), CONSTRAINT "PK_ed4af8cfc51f8423eab2542bbd9" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "game_orm_questions_question_orm" ("gameOrmId" uuid NOT NULL, "questionOrmId" uuid NOT NULL, CONSTRAINT "PK_02bf1c93d26fbff0fe6f39500a6" PRIMARY KEY ("gameOrmId", "questionOrmId"))`);
        await queryRunner.query(`CREATE INDEX "IDX_5e11db720268a2e51829b60d72" ON "game_orm_questions_question_orm" ("gameOrmId") `);
        await queryRunner.query(`CREATE INDEX "IDX_f803e3a9fe38548474bbab6276" ON "game_orm_questions_question_orm" ("questionOrmId") `);
        await queryRunner.query(`ALTER TABLE "answer_history_orm" ADD CONSTRAINT "FK_8a467044fbf64e7acdbce2f6a4b" FOREIGN KEY ("playerProgressIdId") REFERENCES "player_progress_orm"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "player_progress_orm" ADD CONSTRAINT "FK_b63ed4b94999c15e3c20279d62a" FOREIGN KEY ("playerId") REFERENCES "user_orm"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "player_progress_orm" ADD CONSTRAINT "FK_d96bc52070c1fa7ba683d36aebd" FOREIGN KEY ("game1Id") REFERENCES "game_orm"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "player_progress_orm" ADD CONSTRAINT "FK_e9c79d62159dacb85d77821e30d" FOREIGN KEY ("game2Id") REFERENCES "game_orm"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "game_orm_questions_question_orm" ADD CONSTRAINT "FK_5e11db720268a2e51829b60d72b" FOREIGN KEY ("gameOrmId") REFERENCES "game_orm"("id") ON DELETE CASCADE ON UPDATE CASCADE`);
        await queryRunner.query(`ALTER TABLE "game_orm_questions_question_orm" ADD CONSTRAINT "FK_f803e3a9fe38548474bbab6276a" FOREIGN KEY ("questionOrmId") REFERENCES "question_orm"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "game_orm_questions_question_orm" DROP CONSTRAINT "FK_f803e3a9fe38548474bbab6276a"`);
        await queryRunner.query(`ALTER TABLE "game_orm_questions_question_orm" DROP CONSTRAINT "FK_5e11db720268a2e51829b60d72b"`);
        await queryRunner.query(`ALTER TABLE "player_progress_orm" DROP CONSTRAINT "FK_e9c79d62159dacb85d77821e30d"`);
        await queryRunner.query(`ALTER TABLE "player_progress_orm" DROP CONSTRAINT "FK_d96bc52070c1fa7ba683d36aebd"`);
        await queryRunner.query(`ALTER TABLE "player_progress_orm" DROP CONSTRAINT "FK_b63ed4b94999c15e3c20279d62a"`);
        await queryRunner.query(`ALTER TABLE "answer_history_orm" DROP CONSTRAINT "FK_8a467044fbf64e7acdbce2f6a4b"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_f803e3a9fe38548474bbab6276"`);
        await queryRunner.query(`DROP INDEX "public"."IDX_5e11db720268a2e51829b60d72"`);
        await queryRunner.query(`DROP TABLE "game_orm_questions_question_orm"`);
        await queryRunner.query(`DROP TABLE "player_progress_orm"`);
        await queryRunner.query(`DROP TABLE "game_orm"`);
        await queryRunner.query(`DROP TABLE "question_orm"`);
        await queryRunner.query(`DROP TABLE "answer_history_orm"`);
    }

}
