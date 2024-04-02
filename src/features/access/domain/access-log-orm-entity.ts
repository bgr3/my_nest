import { AccessLogType } from '../application/access-log-dto';
import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity()
export class AccessLogORM {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  IP: string;

  @Column()
  URL: string;

  @Column({ type: 'timestamp without time zone' })
  date: Date;

  updateAccessLog(inputModel: AccessLogType) {
    this.IP = inputModel.IP;
    this.URL = inputModel.URL;
    this.date = new Date();
    return;
  }

  static createAccessLog(inputModel: AccessLogType) {
    const accessLog = new this();

    accessLog.IP = inputModel.IP;
    accessLog.URL = inputModel.URL;
    accessLog.date = new Date();

    return accessLog;
  }
}
