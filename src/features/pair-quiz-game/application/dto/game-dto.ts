import { AnswersOutputDTO } from '../../api/dto/output/game-output-dto';
import { GameStatusType } from '../../domain/game-orm-entity';

export class AnswerDTO {
  answer: AnswersOutputDTO;
  statusGame: GameStatusType;
  firstPlayerId: string;
  secondPlayerId: string;
}
