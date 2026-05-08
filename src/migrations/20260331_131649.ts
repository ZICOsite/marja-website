import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_header_nav_items_sub_links_link_type" AS ENUM('reference', 'custom');
  CREATE TABLE "header_nav_items_sub_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"link_type" "enum_header_nav_items_sub_links_link_type" DEFAULT 'reference',
  	"link_new_tab" boolean,
  	"link_url" varchar,
  	"link_label" varchar NOT NULL,
  	"description" varchar
  );
  
  ALTER TABLE "header_nav_items_sub_links" ADD CONSTRAINT "header_nav_items_sub_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."header_nav_items"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "header_nav_items_sub_links_order_idx" ON "header_nav_items_sub_links" USING btree ("_order");
  CREATE INDEX "header_nav_items_sub_links_parent_id_idx" ON "header_nav_items_sub_links" USING btree ("_parent_id");
  CREATE INDEX "header_nav_items_sub_links_locale_idx" ON "header_nav_items_sub_links" USING btree ("_locale");`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "header_nav_items_sub_links" CASCADE;
  DROP TYPE "public"."enum_header_nav_items_sub_links_link_type";`)
}
