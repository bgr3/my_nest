import { Injectable } from "@nestjs/common"
import { add } from 'date-fns/add';
import { LogRepository } from "../infrastructure/access-log-repository";
import { InjectModel } from "@nestjs/mongoose";
import { AccessLog, AccessLogModelType } from "../domain/access-log-entity";

@Injectable()
export class AccessService {
    constructor(
        protected logRepository: LogRepository,
        @InjectModel(AccessLog.name) private AccessLogModel: AccessLogModelType,){}
    async testAllData (): Promise<void> {
        return this.logRepository.testAllData()
    }

    async checkaccessFrequency (url: string, ip: string): Promise<boolean> {
        const lastDate = await this.logRepository.findAccessLogByURLAndIp(url, ip)
        
        if(lastDate[0]){
            if(new Date() < add(lastDate[0], {seconds: 10})){
                if (lastDate[4]) {
                    if (new Date() < add(lastDate[4], {seconds: 10})) return false
                }
            }
        }
    
        const log = {
            URL: url,
            IP: ip,
        }

        const accessLog = AccessLog.createAccessLog(log);
      
          const newAuthModel = new this.AccessLogModel(accessLog);
      
          await this.logRepository.save(newAuthModel);

        return true
    }
}