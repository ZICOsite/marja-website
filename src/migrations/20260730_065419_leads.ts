import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_leads_source" AS ENUM('calculator', 'consultation', 'order');
  CREATE TYPE "public"."enum_leads_timing" AS ENUM('now', 'month', 'quarter');
  CREATE TYPE "public"."enum_leads_delivery_status" AS ENUM('pending', 'delivered', 'partial', 'failed');
  CREATE TYPE "public"."enum_leads_telegram_status" AS ENUM('pending', 'sent', 'failed', 'skipped');
  CREATE TYPE "public"."enum_leads_crm_status" AS ENUM('pending', 'sent', 'failed', 'skipped');
  CREATE TABLE "leads_details" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"value" varchar
  );
  
  CREATE TABLE "leads" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"source" "enum_leads_source" NOT NULL,
  	"name" varchar NOT NULL,
  	"phone" varchar NOT NULL,
  	"city" varchar,
  	"timing" "enum_leads_timing",
  	"comment" varchar,
  	"area" numeric,
  	"amount" numeric,
  	"locale" varchar,
  	"ip" varchar,
  	"delivery_status" "enum_leads_delivery_status" DEFAULT 'pending' NOT NULL,
  	"telegram_status" "enum_leads_telegram_status" DEFAULT 'pending',
  	"crm_status" "enum_leads_crm_status" DEFAULT 'pending',
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "leads_id" integer;
  ALTER TABLE "leads_details" ADD CONSTRAINT "leads_details_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."leads"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "leads_details_order_idx" ON "leads_details" USING btree ("_order");
  CREATE INDEX "leads_details_parent_id_idx" ON "leads_details" USING btree ("_parent_id");
  CREATE INDEX "leads_phone_idx" ON "leads" USING btree ("phone");
  CREATE INDEX "leads_delivery_status_idx" ON "leads" USING btree ("delivery_status");
  CREATE INDEX "leads_updated_at_idx" ON "leads" USING btree ("updated_at");
  CREATE INDEX "leads_created_at_idx" ON "leads" USING btree ("created_at");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_leads_fk" FOREIGN KEY ("leads_id") REFERENCES "public"."leads"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_leads_id_idx" ON "payload_locked_documents_rels" USING btree ("leads_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "leads_details" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "leads" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "leads_details" CASCADE;
  DROP TABLE "leads" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_leads_fk";
  
  DROP INDEX "payload_locked_documents_rels_leads_id_idx";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "leads_id";
  DROP TYPE "public"."enum_leads_source";
  DROP TYPE "public"."enum_leads_timing";
  DROP TYPE "public"."enum_leads_delivery_status";
  DROP TYPE "public"."enum_leads_telegram_status";
  DROP TYPE "public"."enum_leads_crm_status";`)
}
