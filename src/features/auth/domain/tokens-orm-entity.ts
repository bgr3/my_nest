import { Column, Entity, JoinColumn, OneToOne, PrimaryColumn } from 'typeorm';

import { AuthORM } from './auth-orm-entity';

@Entity()
export class JWTTokens {
  @Column()
  accessToken: string;

  @Column()
  refreshToken: string;

  @OneToOne(() => AuthORM, (authORM) => authORM.JWTTokens, {
    onDelete: 'CASCADE',
  })
  @JoinColumn()
  authORM: AuthORM;
  @PrimaryColumn({ type: 'uuid' })
  authORMId: string;
}
