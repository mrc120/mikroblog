import { Migration } from '@mikro-orm/migrations';

export class Migration20230310214033 extends Migration {

  async up(): Promise<void> {
    this.addSql('alter table "post" alter column "title" type varchar(255) using ("title"::varchar(255));');
    this.addSql('alter table "post" alter column "title" set not null;');
    this.addSql('alter table "post" alter column "created_at" type timestamptz(0) using ("created_at"::timestamptz(0));');
    this.addSql('alter table "post" alter column "created_at" set not null;');
    this.addSql('alter table "post" alter column "updated_at" type timestamptz(0) using ("updated_at"::timestamptz(0));');
    this.addSql('alter table "post" alter column "updated_at" set not null;');
    this.addSql('alter table "post" alter column "id" type int using ("id"::int);');
    this.addSql('alter table "post" alter column "id" set not null;');
    this.addSql('create sequence if not exists "post_id_seq";');
    this.addSql('select setval(\'post_id_seq\', (select max("id") from "post"));');
    this.addSql('alter table "post" alter column "id" set default nextval(\'post_id_seq\');');
  }

  async down(): Promise<void> {
    this.addSql('alter table "post" alter column "id" type numeric using ("id"::numeric);');
    this.addSql('alter table "post" alter column "id" drop not null;');
    this.addSql('alter table "post" alter column "created_at" type date using ("created_at"::date);');
    this.addSql('alter table "post" alter column "created_at" drop not null;');
    this.addSql('alter table "post" alter column "updated_at" type date using ("updated_at"::date);');
    this.addSql('alter table "post" alter column "updated_at" drop not null;');
    this.addSql('alter table "post" alter column "title" type char using ("title"::char);');
    this.addSql('alter table "post" alter column "title" drop not null;');
    this.addSql('alter table "post" drop constraint "post_pkey";');
    this.addSql('alter table "post" alter column "id" drop default;');
  }

}
