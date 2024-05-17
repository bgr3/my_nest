/* eslint-disable @typescript-eslint/no-explicit-any */
import { NotFoundException } from '@nestjs/common';
import { ICommandHandler } from '@nestjs/cqrs';
import { DataSource, EntityManager } from 'typeorm';

// import { ErrorStatus, Result } from '../object-result/objcet-result';

interface ICommand {}

export abstract class TransactionalCommandHandler<C extends ICommand>
  implements ICommandHandler<C>
{
  protected constructor(protected readonly dataSource: DataSource) {}

  async execute(
    command: C,
  ): Promise</*{ token: string; refreshToken: string } | string*/ any> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();
    const entityManager = queryRunner.manager;

    try {
      const result = await this.handle(command, entityManager);

      await queryRunner.commitTransaction();

      return result;
    } catch (error) {
      console.log(error);

      await queryRunner.rollbackTransaction();

      throw new NotFoundException();
      //   return null;
    } finally {
      await queryRunner.release();
    }
  }
  //TODO разобраться с any
  protected abstract handle(
    command: C,
    entityManager: EntityManager,
  ): Promise<any | string>;
}
