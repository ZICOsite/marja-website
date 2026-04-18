import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_products_notice_position" AS ENUM('above', 'below');
  CREATE TABLE "products_notice" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"enabled" boolean DEFAULT false,
  	"position" "enum_products_notice_position" DEFAULT 'below',
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "products_notice_locales" (
  	"text" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  ALTER TABLE "products_notice_locales" ADD CONSTRAINT "products_notice_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."products_notice"("id") ON DELETE cascade ON UPDATE no action;
  CREATE UNIQUE INDEX "products_notice_locales_locale_parent_id_unique" ON "products_notice_locales" USING btree ("_locale","_parent_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "products_notice" CASCADE;
  DROP TABLE "products_notice_locales" CASCADE;
  DROP TYPE "public"."enum_products_notice_position";`)
}
