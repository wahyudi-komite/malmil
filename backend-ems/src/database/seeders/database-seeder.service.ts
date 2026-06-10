import { Injectable, Logger, OnApplicationBootstrap } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { Permission } from '../../permissions/entities/permission.entity';
import { Role } from '../../roles/entities/role.entity';
import { User } from '../../users/entities/user.entity';

@Injectable()
export class DatabaseSeeder implements OnApplicationBootstrap {
  private readonly logger = new Logger(DatabaseSeeder.name);

  constructor(
    @InjectRepository(Permission)
    private readonly permissionRepository: Repository<Permission>,
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async onApplicationBootstrap(): Promise<void> {
    const userCount = await this.userRepository.count();
    if (userCount > 0) {
      this.logger.log('Database already seeded, skipping');
      return;
    }

    this.logger.log('Seeding database...');

    const permissions = await this.seedPermissions();
    const roles = await this.seedRoles(permissions);
    await this.seedUsers(roles);

    this.logger.log('Seeding complete');
  }

  private async seedPermissions(): Promise<Permission[]> {
    const permissionNames = [
      'users_view',
      'users_create',
      'users_edit',
      'users_delete',
      'roles_view',
      'roles_assign',
      'permissions_view',
      'dashboard_view',
      'datareal_view',
      'datalist_view',
      'settings_view',
    ];

    const permissions: Permission[] = [];
    for (const name of permissionNames) {
      const existing = await this.permissionRepository.findOne({
        where: { name },
      });
      if (!existing) {
        const permission = this.permissionRepository.create({ name });
        permissions.push(await this.permissionRepository.save(permission));
      } else {
        permissions.push(existing);
      }
    }

    this.logger.log(`Seeded ${permissions.length} permissions`);
    return permissions;
  }

  private async seedRoles(permissions: Permission[]): Promise<Role[]> {
    const rolesData = [
      {
        name: 'super_admin',
        permissions: permissions,
      },
      {
        name: 'admin',
        permissions: permissions.filter((p) => !p.name.startsWith('roles_')),
      },
      {
        name: 'operator',
        permissions: permissions.filter((p) =>
          ['dashboard_view', 'datareal_view', 'datalist_view'].includes(p.name),
        ),
      },
    ];

    const roles: Role[] = [];
    for (const data of rolesData) {
      const existing = await this.roleRepository.findOne({
        where: { name: data.name },
      });
      if (!existing) {
        const role = this.roleRepository.create({
          name: data.name,
          permissions: data.permissions,
        });
        roles.push(await this.roleRepository.save(role));
      } else {
        roles.push(existing);
      }
    }

    this.logger.log(`Seeded ${roles.length} roles`);
    return roles;
  }

  private async seedUsers(roles: Role[]): Promise<void> {
    const adminRole = roles.find((r) => r.name === 'super_admin');
    const operatorRole = roles.find((r) => r.name === 'operator');

    const hashedPassword = await bcrypt.hash('Astra123#', 10);

    const usersData = [
      {
        name: 'Administrator',
        email: 'adhye.yudhie@gmail.com',
        password: hashedPassword,
        role: adminRole,
        avatar: '',
      },
      {
        name: 'Operator',
        email: 'operator@example.com',
        password: hashedPassword,
        role: operatorRole,
        avatar: '',
      },
    ];

    for (const data of usersData) {
      const existing = await this.userRepository.findOne({
        where: { email: data.email },
      });
      if (!existing) {
        await this.userRepository.save(this.userRepository.create(data));
      }
    }

    this.logger.log('Seeded users');
  }
}
