import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "contact_info_phones" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"number" varchar NOT NULL
  );
  
  CREATE TABLE "contact_info_addresses" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"url" varchar
  );
  
  CREATE TABLE "contact_info_addresses_locales" (
  	"label" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "contact_info" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"email" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  DROP TABLE "top_bar_phones" CASCADE;
  DROP TABLE "top_bar_addresses" CASCADE;
  DROP TABLE "top_bar_addresses_locales" CASCADE;
  DROP TABLE "top_bar" CASCADE;
  ALTER TABLE "contact_info_phones" ADD CONSTRAINT "contact_info_phones_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."contact_info"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "contact_info_addresses" ADD CONSTRAINT "contact_info_addresses_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."contact_info"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "contact_info_addresses_locales" ADD CONSTRAINT "contact_info_addresses_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."contact_info_addresses"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "contact_info_phones_order_idx" ON "contact_info_phones" USING btree ("_order");
  CREATE INDEX "contact_info_phones_parent_id_idx" ON "contact_info_phones" USING btree ("_parent_id");
  CREATE INDEX "contact_info_addresses_order_idx" ON "contact_info_addresses" USING btree ("_order");
  CREATE INDEX "contact_info_addresses_parent_id_idx" ON "contact_info_addresses" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "contact_info_addresses_locales_locale_parent_id_unique" ON "contact_info_addresses_locales" USING btree ("_locale","_parent_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
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
  
  CREATE TABLE "top_bar" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"email" varchar NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  DROP TABLE "contact_info_phones" CASCADE;
  DROP TABLE "contact_info_addresses" CASCADE;
  DROP TABLE "contact_info_addresses_locales" CASCADE;
  DROP TABLE "contact_info" CASCADE;
  ALTER TABLE "top_bar_phones" ADD CONSTRAINT "top_bar_phones_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."top_bar"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "top_bar_addresses" ADD CONSTRAINT "top_bar_addresses_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."top_bar"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "top_bar_addresses_locales" ADD CONSTRAINT "top_bar_addresses_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."top_bar_addresses"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "top_bar_phones_order_idx" ON "top_bar_phones" USING btree ("_order");
  CREATE INDEX "top_bar_phones_parent_id_idx" ON "top_bar_phones" USING btree ("_parent_id");
  CREATE INDEX "top_bar_addresses_order_idx" ON "top_bar_addresses" USING btree ("_order");
  CREATE INDEX "top_bar_addresses_parent_id_idx" ON "top_bar_addresses" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "top_bar_addresses_locales_locale_parent_id_unique" ON "top_bar_addresses_locales" USING btree ("_locale","_parent_id");`)
}
