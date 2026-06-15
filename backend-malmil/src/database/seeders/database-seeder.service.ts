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
    this.logger.log('Seeding permissions...');
    const permissions = await this.seedPermissions();

    this.logger.log('Seeding roles...');
    const roles = await this.seedRoles(permissions);

    const userCount = await this.userRepository.count();
    if (userCount === 0) {
      await this.seedUsers(roles);
      this.logger.log('Seeding complete');
    } else {
      this.logger.log('Users already exist, skipping user seed');
    }
  }

  private async seedPermissions(): Promise<Permission[]> {
    const permissionNames = [
      // System
      'dashboard_view',
      'settings_view',
      'audit_view',

      // Users & Roles
      'users_view',
      'users_create',
      'users_edit',
      'users_delete',
      'roles_view',
      'roles_assign',
      'permissions_view',

      // Products
      'products_view',
      'products_create',
      'products_edit',
      'products_delete',

      // Categories
      'categories_view',
      'categories_create',
      'categories_edit',
      'categories_delete',

      // Orders
      'orders_view',
      'orders_edit',

      // Coupons
      'coupons_view',
      'coupons_create',
      'coupons_edit',
      'coupons_delete',

      // Banners
      'banners_view',
      'banners_create',
      'banners_edit',
      'banners_delete',

      // Customers
      'customers_view',
      'customers_edit',
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
        permissions: permissions.filter(
          (p) => !p.name.startsWith('roles_') && !p.name.startsWith('permissions_'),
        ),
      },
      {
        name: 'operator',
        permissions: permissions.filter((p) =>
          [
            'dashboard_view',
            'products_view',
            'categories_view',
            'orders_view',
            'orders_edit',
            'customers_view',
          ].includes(p.name),
        ),
      },
      {
        name: 'customer',
        permissions: [],
      },
    ];

    const roles: Role[] = [];
    for (const data of rolesData) {
      let role = await this.roleRepository.findOne({
        where: { name: data.name },
        relations: ['permissions'],
      });
      if (!role) {
        role = this.roleRepository.create({
          name: data.name,
          permissions: data.permissions,
        });
        roles.push(await this.roleRepository.save(role));
      } else {
        role.permissions = data.permissions;
        roles.push(await this.roleRepository.save(role));
      }
    }

    this.logger.log(`Seeded ${roles.length} roles`);
    return roles;
  }

  private async seedUsers(roles: Role[]): Promise<void> {
    const adminRole = roles.find((r) => r.name === 'super_admin');
    const operatorRole = roles.find((r) => r.name === 'operator');

    const hashedPassword = await bcrypt.hash('Astra123#', 12);

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
