import { AnswerStatusType } from '../../../domain/answers-orm-entity';
import { GameStatusType } from '../../../domain/game-orm-entity';

export class GameOutputDTO {
  id: string;

  firstPlayerProgress: {
    answers: AnswersOutputDTO[] | null;

    player: {
      id: string;

      login: string;
    };

    score: number | null;
  };

  secondPlayerProgress: {
    answers: AnswersOutputDTO[] | null;

    player: {
      id: string;

      login: string;
    } | null;

    score: number | null;
  } | null;

  questions: GameQuestionOutputDTO[] | null;

  status: GameStatusType;

  pairCreatedDate: string | null;

  startGameDate: string | null;

  finishGameDate: string | null;
}

export class GameQuestionOutputDTO {
  id: string;

  body: string;
}

export class AnswersOutputDTO {
  questionId: string;

  answerStatus: AnswerStatusType;

  addedAt: string;
}
