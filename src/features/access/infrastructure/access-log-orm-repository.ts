import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { AccessLogORM } from '../domain/access-log-orm-entity';
import { Repository } from 'typeorm';

@Injectable()
export class LogORMRepository {
  constructor(
    @InjectRepository(AccessLogORM)
    private readonly accessLogRepository: Repository<AccessLogORM>,
  ) {}
  async testAllData(): Promise<void> {
    await this.accessLogRepository.delete({});
    //console.log('accessLog delete: ', result.deletedCount)
  }

  async save(accessLog: AccessLogORM): Promise<void> {
    await this.accessLogRepository.save(accessLog);
  }

  async findAccessLogByURLAndIp(URL: string, IP: string): Promise<Date[]> {
    const result = (
      await this.accessLogRepository
        .createQueryBuilder('a')
        .select()
        .where('a.URL = :URL', { URL: URL })
        .andWhere('a.IP = :IP', { IP: IP })
        .orderBy('a.date', 'DESC')
        .take(5)
        .getMany()
    ).map((i) => i.date);
    return result;
  }
}
