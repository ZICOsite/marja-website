import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "top_bar_phones" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"number" varchar NOT NULL
  );
  
  CREATE TABLE "top_bar_addresses" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"url" varchar
  );
  
  CREATE TABLE "top_bar_addresses_locales" (
  	"label" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  DROP TABLE "top_bar_locales" CASCADE;
  ALTER TABLE "top_bar_phones" ADD CONSTRAINT "top_bar_phones_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."top_bar"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "top_bar_addresses" ADD CONSTRAINT "top_bar_addresses_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."top_bar"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "top_bar_addresses_locales" ADD CONSTRAINT "top_bar_addresses_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."top_bar_addresses"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "top_bar_phones_order_idx" ON "top_bar_phones" USING btree ("_order");
  CREATE INDEX "top_bar_phones_parent_id_idx" ON "top_bar_phones" USING btree ("_parent_id");
  CREATE INDEX "top_bar_addresses_order_idx" ON "top_bar_addresses" USING btree ("_order");
  CREATE INDEX "top_bar_addresses_parent_id_idx" ON "top_bar_addresses" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "top_bar_addresses_locales_locale_parent_id_unique" ON "top_bar_addresses_locales" USING btree ("_locale","_parent_id");
  ALTER TABLE "top_bar" DROP COLUMN "phone";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "top_bar_locales" (
  	"address" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  DROP TABLE "top_bar_phones" CASCADE;
  DROP TABLE "top_bar_addresses" CASCADE;
  DROP TABLE "top_bar_addresses_locales" CASCADE;
  ALTER TABLE "top_bar" ADD COLUMN "phone" varchar NOT NULL;
  ALTER TABLE "top_bar_locales" ADD CONSTRAINT "top_bar_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."top_bar"("id") ON DELETE cascade ON UPDATE no action;
  CREATE UNIQUE INDEX "top_bar_locales_locale_parent_id_unique" ON "top_bar_locales" USING btree ("_locale","_parent_id");`)
}
