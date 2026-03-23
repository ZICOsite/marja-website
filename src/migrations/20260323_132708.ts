import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "pages_blocks_popular_products" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"tagline" varchar,
  	"title" varchar DEFAULT 'Популярные товары',
  	"description" varchar,
  	"view_all_label" varchar,
  	"view_all_link" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_popular_products" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"tagline" varchar,
  	"title" varchar DEFAULT 'Популярные товары',
  	"description" varchar,
  	"view_all_label" varchar,
  	"view_all_link" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  ALTER TABLE "pages_rels" ADD COLUMN "products_id" integer;
  ALTER TABLE "_pages_v_rels" ADD COLUMN "products_id" integer;
  ALTER TABLE "pages_blocks_popular_products" ADD CONSTRAINT "pages_blocks_popular_products_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_popular_products" ADD CONSTRAINT "_pages_v_blocks_popular_products_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "pages_blocks_popular_products_order_idx" ON "pages_blocks_popular_products" USING btree ("_order");
  CREATE INDEX "pages_blocks_popular_products_parent_id_idx" ON "pages_blocks_popular_products" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_popular_products_path_idx" ON "pages_blocks_popular_products" USING btree ("_path");
  CREATE INDEX "pages_blocks_popular_products_locale_idx" ON "pages_blocks_popular_products" USING btree ("_locale");
  CREATE INDEX "_pages_v_blocks_popular_products_order_idx" ON "_pages_v_blocks_popular_products" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_popular_products_parent_id_idx" ON "_pages_v_blocks_popular_products" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_popular_products_path_idx" ON "_pages_v_blocks_popular_products" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_popular_products_locale_idx" ON "_pages_v_blocks_popular_products" USING btree ("_locale");
  ALTER TABLE "pages_rels" ADD CONSTRAINT "pages_rels_products_fk" FOREIGN KEY ("products_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_rels" ADD CONSTRAINT "_pages_v_rels_products_fk" FOREIGN KEY ("products_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "pages_rels_products_id_idx" ON "pages_rels" USING btree ("products_id","locale");
  CREATE INDEX "_pages_v_rels_products_id_idx" ON "_pages_v_rels" USING btree ("products_id","locale");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pages_blocks_popular_products" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_popular_products" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "pages_blocks_popular_products" CASCADE;
  DROP TABLE "_pages_v_blocks_popular_products" CASCADE;
  ALTER TABLE "pages_rels" DROP CONSTRAINT "pages_rels_products_fk";
  
  ALTER TABLE "_pages_v_rels" DROP CONSTRAINT "_pages_v_rels_products_fk";
  
  DROP INDEX "pages_rels_products_id_idx";
  DROP INDEX "_pages_v_rels_products_id_idx";
  ALTER TABLE "pages_rels" DROP COLUMN "products_id";
  ALTER TABLE "_pages_v_rels" DROP COLUMN "products_id";`)
}
