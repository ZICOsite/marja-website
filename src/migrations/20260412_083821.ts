import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_projects_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__projects_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__projects_v_published_locale" AS ENUM('uz', 'ru', 'en', 'tg', 'kk');
  CREATE TABLE "pages_blocks_contacts_offices" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"address" varchar,
  	"hours" varchar,
  	"map_url" varchar
  );
  
  CREATE TABLE "pages_blocks_contacts_phones" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"number" varchar,
  	"label" varchar
  );
  
  CREATE TABLE "pages_blocks_contacts" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"offices_title" varchar,
  	"contacts_title" varchar,
  	"email" varchar,
  	"email_label" varchar,
  	"map_embed_url" varchar,
  	"description" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_completed_projects" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"tagline" varchar,
  	"title" varchar,
  	"description" varchar,
  	"view_all_label" varchar,
  	"view_all_link" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_contacts_offices" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"address" varchar,
  	"hours" varchar,
  	"map_url" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_contacts_phones" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"number" varchar,
  	"label" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_contacts" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"offices_title" varchar,
  	"contacts_title" varchar,
  	"email" varchar,
  	"email_label" varchar,
  	"map_embed_url" varchar,
  	"description" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_completed_projects" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"tagline" varchar,
  	"title" varchar,
  	"description" varchar,
  	"view_all_label" varchar,
  	"view_all_link" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "projects" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"published_at" timestamp(3) with time zone,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_projects_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "projects_locales" (
  	"title" varchar,
  	"description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_projects_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_image_id" integer,
  	"version_published_at" timestamp(3) with time zone,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__projects_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "enum__projects_v_published_locale",
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "_projects_v_locales" (
  	"version_title" varchar,
  	"version_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  ALTER TABLE "pages_rels" ADD COLUMN "projects_id" integer;
  ALTER TABLE "_pages_v_rels" ADD COLUMN "projects_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "projects_id" integer;
  ALTER TABLE "pages_blocks_contacts_offices" ADD CONSTRAINT "pages_blocks_contacts_offices_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_contacts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_contacts_phones" ADD CONSTRAINT "pages_blocks_contacts_phones_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_contacts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_contacts" ADD CONSTRAINT "pages_blocks_contacts_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_completed_projects" ADD CONSTRAINT "pages_blocks_completed_projects_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_contacts_offices" ADD CONSTRAINT "_pages_v_blocks_contacts_offices_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_contacts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_contacts_phones" ADD CONSTRAINT "_pages_v_blocks_contacts_phones_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_contacts"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_contacts" ADD CONSTRAINT "_pages_v_blocks_contacts_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_completed_projects" ADD CONSTRAINT "_pages_v_blocks_completed_projects_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects" ADD CONSTRAINT "projects_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "projects_locales" ADD CONSTRAINT "projects_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_projects_v" ADD CONSTRAINT "_projects_v_parent_id_projects_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."projects"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_projects_v" ADD CONSTRAINT "_projects_v_version_image_id_media_id_fk" FOREIGN KEY ("version_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_projects_v_locales" ADD CONSTRAINT "_projects_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_projects_v"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "pages_blocks_contacts_offices_order_idx" ON "pages_blocks_contacts_offices" USING btree ("_order");
  CREATE INDEX "pages_blocks_contacts_offices_parent_id_idx" ON "pages_blocks_contacts_offices" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_contacts_offices_locale_idx" ON "pages_blocks_contacts_offices" USING btree ("_locale");
  CREATE INDEX "pages_blocks_contacts_phones_order_idx" ON "pages_blocks_contacts_phones" USING btree ("_order");
  CREATE INDEX "pages_blocks_contacts_phones_parent_id_idx" ON "pages_blocks_contacts_phones" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_contacts_phones_locale_idx" ON "pages_blocks_contacts_phones" USING btree ("_locale");
  CREATE INDEX "pages_blocks_contacts_order_idx" ON "pages_blocks_contacts" USING btree ("_order");
  CREATE INDEX "pages_blocks_contacts_parent_id_idx" ON "pages_blocks_contacts" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_contacts_path_idx" ON "pages_blocks_contacts" USING btree ("_path");
  CREATE INDEX "pages_blocks_contacts_locale_idx" ON "pages_blocks_contacts" USING btree ("_locale");
  CREATE INDEX "pages_blocks_completed_projects_order_idx" ON "pages_blocks_completed_projects" USING btree ("_order");
  CREATE INDEX "pages_blocks_completed_projects_parent_id_idx" ON "pages_blocks_completed_projects" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_completed_projects_path_idx" ON "pages_blocks_completed_projects" USING btree ("_path");
  CREATE INDEX "pages_blocks_completed_projects_locale_idx" ON "pages_blocks_completed_projects" USING btree ("_locale");
  CREATE INDEX "_pages_v_blocks_contacts_offices_order_idx" ON "_pages_v_blocks_contacts_offices" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_contacts_offices_parent_id_idx" ON "_pages_v_blocks_contacts_offices" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_contacts_offices_locale_idx" ON "_pages_v_blocks_contacts_offices" USING btree ("_locale");
  CREATE INDEX "_pages_v_blocks_contacts_phones_order_idx" ON "_pages_v_blocks_contacts_phones" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_contacts_phones_parent_id_idx" ON "_pages_v_blocks_contacts_phones" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_contacts_phones_locale_idx" ON "_pages_v_blocks_contacts_phones" USING btree ("_locale");
  CREATE INDEX "_pages_v_blocks_contacts_order_idx" ON "_pages_v_blocks_contacts" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_contacts_parent_id_idx" ON "_pages_v_blocks_contacts" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_contacts_path_idx" ON "_pages_v_blocks_contacts" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_contacts_locale_idx" ON "_pages_v_blocks_contacts" USING btree ("_locale");
  CREATE INDEX "_pages_v_blocks_completed_projects_order_idx" ON "_pages_v_blocks_completed_projects" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_completed_projects_parent_id_idx" ON "_pages_v_blocks_completed_projects" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_completed_projects_path_idx" ON "_pages_v_blocks_completed_projects" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_completed_projects_locale_idx" ON "_pages_v_blocks_completed_projects" USING btree ("_locale");
  CREATE INDEX "projects_image_idx" ON "projects" USING btree ("image_id");
  CREATE INDEX "projects_updated_at_idx" ON "projects" USING btree ("updated_at");
  CREATE INDEX "projects_created_at_idx" ON "projects" USING btree ("created_at");
  CREATE INDEX "projects__status_idx" ON "projects" USING btree ("_status");
  CREATE UNIQUE INDEX "projects_locales_locale_parent_id_unique" ON "projects_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_projects_v_parent_idx" ON "_projects_v" USING btree ("parent_id");
  CREATE INDEX "_projects_v_version_version_image_idx" ON "_projects_v" USING btree ("version_image_id");
  CREATE INDEX "_projects_v_version_version_updated_at_idx" ON "_projects_v" USING btree ("version_updated_at");
  CREATE INDEX "_projects_v_version_version_created_at_idx" ON "_projects_v" USING btree ("version_created_at");
  CREATE INDEX "_projects_v_version_version__status_idx" ON "_projects_v" USING btree ("version__status");
  CREATE INDEX "_projects_v_created_at_idx" ON "_projects_v" USING btree ("created_at");
  CREATE INDEX "_projects_v_updated_at_idx" ON "_projects_v" USING btree ("updated_at");
  CREATE INDEX "_projects_v_snapshot_idx" ON "_projects_v" USING btree ("snapshot");
  CREATE INDEX "_projects_v_published_locale_idx" ON "_projects_v" USING btree ("published_locale");
  CREATE INDEX "_projects_v_latest_idx" ON "_projects_v" USING btree ("latest");
  CREATE INDEX "_projects_v_autosave_idx" ON "_projects_v" USING btree ("autosave");
  CREATE UNIQUE INDEX "_projects_v_locales_locale_parent_id_unique" ON "_projects_v_locales" USING btree ("_locale","_parent_id");
  ALTER TABLE "pages_rels" ADD CONSTRAINT "pages_rels_projects_fk" FOREIGN KEY ("projects_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_rels" ADD CONSTRAINT "_pages_v_rels_projects_fk" FOREIGN KEY ("projects_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_projects_fk" FOREIGN KEY ("projects_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "pages_rels_projects_id_idx" ON "pages_rels" USING btree ("projects_id","locale");
  CREATE INDEX "_pages_v_rels_projects_id_idx" ON "_pages_v_rels" USING btree ("projects_id","locale");
  CREATE INDEX "payload_locked_documents_rels_projects_id_idx" ON "payload_locked_documents_rels" USING btree ("projects_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pages_blocks_contacts_offices" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_contacts_phones" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_contacts" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_completed_projects" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_contacts_offices" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_contacts_phones" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_contacts" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_completed_projects" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "projects" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "projects_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_projects_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_projects_v_locales" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "pages_blocks_contacts_offices" CASCADE;
  DROP TABLE "pages_blocks_contacts_phones" CASCADE;
  DROP TABLE "pages_blocks_contacts" CASCADE;
  DROP TABLE "pages_blocks_completed_projects" CASCADE;
  DROP TABLE "_pages_v_blocks_contacts_offices" CASCADE;
  DROP TABLE "_pages_v_blocks_contacts_phones" CASCADE;
  DROP TABLE "_pages_v_blocks_contacts" CASCADE;
  DROP TABLE "_pages_v_blocks_completed_projects" CASCADE;
  DROP TABLE "projects" CASCADE;
  DROP TABLE "projects_locales" CASCADE;
  DROP TABLE "_projects_v" CASCADE;
  DROP TABLE "_projects_v_locales" CASCADE;
  ALTER TABLE "pages_rels" DROP CONSTRAINT "pages_rels_projects_fk";
  
  ALTER TABLE "_pages_v_rels" DROP CONSTRAINT "_pages_v_rels_projects_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_projects_fk";
  
  DROP INDEX "pages_rels_projects_id_idx";
  DROP INDEX "_pages_v_rels_projects_id_idx";
  DROP INDEX "payload_locked_documents_rels_projects_id_idx";
  ALTER TABLE "pages_rels" DROP COLUMN "projects_id";
  ALTER TABLE "_pages_v_rels" DROP COLUMN "projects_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "projects_id";
  DROP TYPE "public"."enum_projects_status";
  DROP TYPE "public"."enum__projects_v_version_status";
  DROP TYPE "public"."enum__projects_v_published_locale";`)
}
