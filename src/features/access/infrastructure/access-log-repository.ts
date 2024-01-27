import { Injectable } from "@nestjs/common";
import { InjectModel } from "@nestjs/mongoose";
import { AccessLog, AccessLogDocument, AccessLogModelType } from "../domain/access-log-entity";

@Injectable()
export class LogRepository {
    constructor(@InjectModel(AccessLog.name) private AccessLogModel: AccessLogModelType){}
    async testAllData (): Promise<void> {
        const result = await this.AccessLogModel.deleteMany({})
        //console.log('accessLog delete: ', result.deletedCount)
    }

    async save(accessLog: AccessLogDocument): Promise<void> {
        await accessLog.save();
      }

    async findAccessLogByURLAndIp (URL: string, IP: string): Promise<Date[]> {
        const result = (await this.AccessLogModel.find({$and: [{URL: URL}, {IP: IP}]}).sort({date: -1}).limit(5).lean()).map(i => i.date);
        return result
    }


}