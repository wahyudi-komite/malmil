import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from './entities/role.entity';
import { AbstractService } from '../common/abstract.service';

@Injectable()
export class RolesService extends AbstractService {
  constructor(
    @InjectRepository(Role) private readonly roleRepository: Repository<Role>,
  ) {
    super(roleRepository);
  }

  async updatePermissions(
    id: string,
    name: string,
    permissionIds: string[],
  ): Promise<Role> {
    const role = await this.roleRepository.findOne({
      where: { id } as any,
      relations: ['permissions'],
    });
    if (!role) {
      throw new Error('Role not found');
    }
    role.name = name;
    role.permissions = permissionIds.map((id) => ({ id })) as any;
    return this.roleRepository.save(role);
  }
}
