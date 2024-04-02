import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Model } from 'mongoose';
import { AccessLogType } from '../application/access-log-dto';

export type AccessLogDocument = HydratedDocument<AccessLog>;

export type AccessLogModelType = Model<AccessLogDocument> & typeof statics;

@Schema()
export class AccessLog {
  @Prop({ required: true })
  IP: string;

  @Prop({ required: true })
  URL: string;

  @Prop({ required: true })
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

export const AccessLogSchema = SchemaFactory.createForClass(AccessLog);

AccessLogSchema.methods = {
  updateAccessLog: AccessLog.prototype.updateAccessLog,
};

const statics = {
  createAccessLog: AccessLog.createAccessLog,
};

AccessLogSchema.statics = statics;
