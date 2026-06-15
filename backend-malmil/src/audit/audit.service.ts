import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Brackets } from 'typeorm';
import { AuditLog } from './entities/audit-log.entity';

@Injectable()
export class AuditService {
  private readonly logger = new Logger('Audit');

  constructor(
    @InjectRepository(AuditLog)
    private readonly auditRepository: Repository<AuditLog>,
  ) {}

  async paginate(query: any) {
    const take = query.limit ? +query.limit : 25;
    const page = query.page ? +query.page : 1;
    const keyword = query.keyword || '';

    const qb = this.auditRepository
      .createQueryBuilder('audit')
      .orderBy('audit.createdAt', 'DESC')
      .take(take)
      .skip((page - 1) * take);

    if (keyword) {
      qb.andWhere(
        new Brackets((qb2) => {
          qb2.where('audit.userEmail like :kw', { kw: `%${keyword}%` })
            .orWhere('audit.action like :kw', { kw: `%${keyword}%` })
            .orWhere('audit.resource like :kw', { kw: `%${keyword}%` })
            .orWhere('audit.detail like :kw', { kw: `%${keyword}%` });
        }),
      );
    }

    const [data, total] = await qb.getManyAndCount();

    return {
      data,
      meta: { total, page, last_page: Math.ceil(total / take), pageSize: take },
    };
  }

  async log(
    userId: string,
    userEmail: string,
    action: string,
    resource?: string,
    resourceId?: string,
    detail?: string,
    ip?: string,
  ): Promise<void> {
    await this.auditRepository.save({
      userId,
      userEmail,
      action,
      resource,
      resourceId,
      detail,
      ip,
    });

    this.logger.log(`${action} | ${resource} ${resourceId ?? ''} | by ${userEmail}`);
  }
}
