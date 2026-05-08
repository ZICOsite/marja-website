import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_footer_company_links_link_type" AS ENUM('reference', 'custom');
  CREATE TYPE "public"."enum_footer_product_links_link_type" AS ENUM('reference', 'custom');
  CREATE TABLE "footer_company_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"link_type" "enum_footer_company_links_link_type" DEFAULT 'reference',
  	"link_new_tab" boolean,
  	"link_url" varchar,
  	"link_label" varchar NOT NULL
  );
  
  CREATE TABLE "footer_product_links" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"link_type" "enum_footer_product_links_link_type" DEFAULT 'reference',
  	"link_new_tab" boolean,
  	"link_url" varchar,
  	"link_label" varchar NOT NULL
  );
  
  CREATE TABLE "footer_locales" (
  	"description" varchar,
  	"privacy_policy" jsonb,
  	"terms_of_use" jsonb,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  ALTER TABLE "footer_company_links" ADD CONSTRAINT "footer_company_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."footer"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "footer_product_links" ADD CONSTRAINT "footer_product_links_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."footer"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "footer_locales" ADD CONSTRAINT "footer_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."footer"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "footer_company_links_order_idx" ON "footer_company_links" USING btree ("_order");
  CREATE INDEX "footer_company_links_parent_id_idx" ON "footer_company_links" USING btree ("_parent_id");
  CREATE INDEX "footer_company_links_locale_idx" ON "footer_company_links" USING btree ("_locale");
  CREATE INDEX "footer_product_links_order_idx" ON "footer_product_links" USING btree ("_order");
  CREATE INDEX "footer_product_links_parent_id_idx" ON "footer_product_links" USING btree ("_parent_id");
  CREATE INDEX "footer_product_links_locale_idx" ON "footer_product_links" USING btree ("_locale");
  CREATE UNIQUE INDEX "footer_locales_locale_parent_id_unique" ON "footer_locales" USING btree ("_locale","_parent_id");`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "footer_company_links" CASCADE;
  DROP TABLE "footer_product_links" CASCADE;
  DROP TABLE "footer_locales" CASCADE;
  DROP TYPE "public"."enum_footer_company_links_link_type";
  DROP TYPE "public"."enum_footer_product_links_link_type";`)
}
