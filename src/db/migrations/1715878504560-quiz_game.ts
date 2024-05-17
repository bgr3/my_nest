import { MigrationInterface, QueryRunner } from "typeorm";

export class QuizGame1715878504560 implements MigrationInterface {
    name = 'QuizGame1715878504560'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TABLE "answer_history_orm" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "questionId" character varying NOT NULL, "answerStatus" character varying NOT NULL, "addedAt" TIMESTAMP NOT NULL, "playerProgressId" uuid NOT NULL, CONSTRAINT "PK_3be48e2bde21f08bbfc28e65b9a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "question_orm" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "body" character varying NOT NULL, "correctAnswers" character varying array NOT NULL, "published" boolean NOT NULL, "createdAt" TIMESTAMP NOT NULL, "updatedAt" TIMESTAMP, CONSTRAINT "PK_969f5da88728130b8274c97ac41" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "game_questions_orm" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "gameId" uuid NOT NULL, "questionId" uuid NOT NULL, "questionNumber" integer NOT NULL, CONSTRAINT "PK_818e46810851295c222e22fd111" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "game_orm" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "status" character varying NOT NULL, "pairCreatedDate" TIMESTAMP, "startGameDate" TIMESTAMP, "finishGameDate" TIMESTAMP, CONSTRAINT "PK_70019f3b144c0e15dffddb08d11" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "player_progress_orm" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "playerId" uuid NOT NULL, "score" integer NOT NULL, "game1Id" uuid, "game2Id" uuid, CONSTRAINT "REL_d96bc52070c1fa7ba683d36aeb" UNIQUE ("game1Id"), CONSTRAINT "REL_e9c79d62159dacb85d77821e30" UNIQUE ("game2Id"), CONSTRAINT "PK_ed4af8cfc51f8423eab2542bbd9" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "statistic_orm" ("sumScore" integer NOT NULL, "avgScores" numeric NOT NULL, "gamesCount" integer NOT NULL, "winsCount" integer NOT NULL, "lossesCount" integer NOT NULL, "drawsCount" integer NOT NULL, "playerId" uuid NOT NULL, CONSTRAINT "PK_1dd3d41a7c1ae493ffd60032d98" PRIMARY KEY ("playerId"))`);
        await queryRunner.query(`ALTER TABLE "answer_history_orm" ADD CONSTRAINT "FK_7966ccc8052f06b193e80d972ff" FOREIGN KEY ("playerProgressId") REFERENCES "player_progress_orm"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "game_questions_orm" ADD CONSTRAINT "FK_c90cc76db0480347f00d2990542" FOREIGN KEY ("gameId") REFERENCES "game_orm"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "game_questions_orm" ADD CONSTRAINT "FK_7e73a8bd4ac682d7e4b8e1d7521" FOREIGN KEY ("questionId") REFERENCES "question_orm"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "player_progress_orm" ADD CONSTRAINT "FK_b63ed4b94999c15e3c20279d62a" FOREIGN KEY ("playerId") REFERENCES "user_orm"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "player_progress_orm" ADD CONSTRAINT "FK_d96bc52070c1fa7ba683d36aebd" FOREIGN KEY ("game1Id") REFERENCES "game_orm"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "player_progress_orm" ADD CONSTRAINT "FK_e9c79d62159dacb85d77821e30d" FOREIGN KEY ("game2Id") REFERENCES "game_orm"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "statistic_orm" ADD CONSTRAINT "FK_1dd3d41a7c1ae493ffd60032d98" FOREIGN KEY ("playerId") REFERENCES "user_orm"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "statistic_orm" DROP CONSTRAINT "FK_1dd3d41a7c1ae493ffd60032d98"`);
        await queryRunner.query(`ALTER TABLE "player_progress_orm" DROP CONSTRAINT "FK_e9c79d62159dacb85d77821e30d"`);
        await queryRunner.query(`ALTER TABLE "player_progress_orm" DROP CONSTRAINT "FK_d96bc52070c1fa7ba683d36aebd"`);
        await queryRunner.query(`ALTER TABLE "player_progress_orm" DROP CONSTRAINT "FK_b63ed4b94999c15e3c20279d62a"`);
        await queryRunner.query(`ALTER TABLE "game_questions_orm" DROP CONSTRAINT "FK_7e73a8bd4ac682d7e4b8e1d7521"`);
        await queryRunner.query(`ALTER TABLE "game_questions_orm" DROP CONSTRAINT "FK_c90cc76db0480347f00d2990542"`);
        await queryRunner.query(`ALTER TABLE "answer_history_orm" DROP CONSTRAINT "FK_7966ccc8052f06b193e80d972ff"`);
        await queryRunner.query(`DROP TABLE "statistic_orm"`);
        await queryRunner.query(`DROP TABLE "player_progress_orm"`);
        await queryRunner.query(`DROP TABLE "game_orm"`);
        await queryRunner.query(`DROP TABLE "game_questions_orm"`);
        await queryRunner.query(`DROP TABLE "question_orm"`);
        await queryRunner.query(`DROP TABLE "answer_history_orm"`);
    }

}
