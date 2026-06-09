import { MigrationInterface, QueryRunner } from 'typeorm';

export class RemoveSaltColumn1665678901234 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE "users" DROP COLUMN "salt"');
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE "users" ADD "salt" character varying(20)');
  }
}
