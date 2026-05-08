import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_products_currency" AS ENUM('UZS', 'USD', 'EUR', 'RUB');
  CREATE TYPE "public"."enum__products_v_version_currency" AS ENUM('UZS', 'USD', 'EUR', 'RUB');
  ALTER TABLE "products" ADD COLUMN "price" numeric;
  ALTER TABLE "products" ADD COLUMN "currency" "enum_products_currency" DEFAULT 'UZS';
  ALTER TABLE "products" ADD COLUMN "price_on_request" boolean DEFAULT false;
  ALTER TABLE "_products_v" ADD COLUMN "version_price" numeric;
  ALTER TABLE "_products_v" ADD COLUMN "version_currency" "enum__products_v_version_currency" DEFAULT 'UZS';
  ALTER TABLE "_products_v" ADD COLUMN "version_price_on_request" boolean DEFAULT false;`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "products" DROP COLUMN "price";
  ALTER TABLE "products" DROP COLUMN "currency";
  ALTER TABLE "products" DROP COLUMN "price_on_request";
  ALTER TABLE "_products_v" DROP COLUMN "version_price";
  ALTER TABLE "_products_v" DROP COLUMN "version_currency";
  ALTER TABLE "_products_v" DROP COLUMN "version_price_on_request";
  DROP TYPE "public"."enum_products_currency";
  DROP TYPE "public"."enum__products_v_version_currency";`)
}
