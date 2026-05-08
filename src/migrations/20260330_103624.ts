import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "top_bar" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"email" varchar NOT NULL,
  	"phone" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "top_bar_locales" (
  	"address" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  ALTER TABLE "top_bar_locales" ADD CONSTRAINT "top_bar_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."top_bar"("id") ON DELETE cascade ON UPDATE no action;
  CREATE UNIQUE INDEX "top_bar_locales_locale_parent_id_unique" ON "top_bar_locales" USING btree ("_locale","_parent_id");`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "top_bar" CASCADE;
  DROP TABLE "top_bar_locales" CASCADE;`)
}
