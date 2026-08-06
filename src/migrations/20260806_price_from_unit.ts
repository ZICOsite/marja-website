import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_products_price_unit" AS ENUM('m2', 'kg', 'roll', 'm3', 'lm', 'pcs');
  CREATE TYPE "public"."enum__products_v_version_price_unit" AS ENUM('m2', 'kg', 'roll', 'm3', 'lm', 'pcs');
  ALTER TABLE "products" ADD COLUMN "price_from" boolean DEFAULT false;
  ALTER TABLE "products" ADD COLUMN "price_unit" "public"."enum_products_price_unit";
  ALTER TABLE "_products_v" ADD COLUMN "version_price_from" boolean DEFAULT false;
  ALTER TABLE "_products_v" ADD COLUMN "version_price_unit" "public"."enum__products_v_version_price_unit";`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "products" DROP COLUMN "price_from";
  ALTER TABLE "products" DROP COLUMN "price_unit";
  ALTER TABLE "_products_v" DROP COLUMN "version_price_from";
  ALTER TABLE "_products_v" DROP COLUMN "version_price_unit";
  DROP TYPE "public"."enum_products_price_unit";
  DROP TYPE "public"."enum__products_v_version_price_unit";`)
}
