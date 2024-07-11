import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';

import { UserORM } from './users-orm-entity';

@Entity()
export class EmailConfirmation {
  // @PrimaryGeneratedColumn('uuid')
  // id: string;

  @Column()
  confirmationCode: string;

  @Column({ type: 'date' })
  expirationDate: object;

  @Column()
  isConfirmed: boolean;

  @Column({ type: 'date' })
  nextSend: object;

  @OneToOne(() => UserORM, (user) => user.emailConfirmation, {
    // cascade: ['insert'],
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  user: UserORM;
  @PrimaryColumn({ type: 'uuid' })
  userId: string;
}
