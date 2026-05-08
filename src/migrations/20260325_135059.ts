import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "search" ADD COLUMN "sku" varchar;
  ALTER TABLE "search" ADD COLUMN "short_description" varchar;
  ALTER TABLE "search" ADD COLUMN "hero_image_id" integer;
  ALTER TABLE "search" ADD COLUMN "in_stock" boolean;
  ALTER TABLE "search" ADD COLUMN "price" numeric;
  ALTER TABLE "search" ADD COLUMN "currency" varchar;
  ALTER TABLE "search" ADD COLUMN "price_on_request" boolean;
  ALTER TABLE "search_rels" ADD COLUMN "products_id" integer;
  ALTER TABLE "search" ADD CONSTRAINT "search_hero_image_id_media_id_fk" FOREIGN KEY ("hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "search_rels" ADD CONSTRAINT "search_rels_products_fk" FOREIGN KEY ("products_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "search_sku_idx" ON "search" USING btree ("sku");
  CREATE INDEX "search_hero_image_idx" ON "search" USING btree ("hero_image_id");
  CREATE INDEX "search_rels_products_id_idx" ON "search_rels" USING btree ("products_id");`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "search" DROP CONSTRAINT "search_hero_image_id_media_id_fk";
  
  ALTER TABLE "search_rels" DROP CONSTRAINT "search_rels_products_fk";
  
  DROP INDEX "search_sku_idx";
  DROP INDEX "search_hero_image_idx";
  DROP INDEX "search_rels_products_id_idx";
  ALTER TABLE "search" DROP COLUMN "sku";
  ALTER TABLE "search" DROP COLUMN "short_description";
  ALTER TABLE "search" DROP COLUMN "hero_image_id";
  ALTER TABLE "search" DROP COLUMN "in_stock";
  ALTER TABLE "search" DROP COLUMN "price";
  ALTER TABLE "search" DROP COLUMN "currency";
  ALTER TABLE "search" DROP COLUMN "price_on_request";
  ALTER TABLE "search_rels" DROP COLUMN "products_id";`)
}
