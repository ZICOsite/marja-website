import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "products_documents_files" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"file_id" integer
  );
  
  CREATE TABLE "products_documents_files_locales" (
  	"label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "_products_v_version_documents_files" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"file_id" integer,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_products_v_version_documents_files_locales" (
  	"label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  ALTER TABLE "products_documents" DROP CONSTRAINT "products_documents_file_id_media_id_fk";
  
  ALTER TABLE "_products_v_version_documents" DROP CONSTRAINT "_products_v_version_documents_file_id_media_id_fk";
  
  DROP INDEX "products_documents_file_idx";
  DROP INDEX "_products_v_version_documents_file_idx";
  ALTER TABLE "products_documents_locales" ADD COLUMN "category" varchar;
  ALTER TABLE "products_specifications" ADD COLUMN "standard_value" varchar;
  ALTER TABLE "products_locales" ADD COLUMN "standard_label" varchar;
  ALTER TABLE "products_locales" ADD COLUMN "quality_note" varchar;
  ALTER TABLE "products_locales" ADD COLUMN "warranty_note" varchar;
  ALTER TABLE "_products_v_version_documents_locales" ADD COLUMN "category" varchar;
  ALTER TABLE "_products_v_version_specifications" ADD COLUMN "standard_value" varchar;
  ALTER TABLE "_products_v_locales" ADD COLUMN "version_standard_label" varchar;
  ALTER TABLE "_products_v_locales" ADD COLUMN "version_quality_note" varchar;
  ALTER TABLE "_products_v_locales" ADD COLUMN "version_warranty_note" varchar;
  ALTER TABLE "products_documents_files" ADD CONSTRAINT "products_documents_files_file_id_media_id_fk" FOREIGN KEY ("file_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "products_documents_files" ADD CONSTRAINT "products_documents_files_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."products_documents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products_documents_files_locales" ADD CONSTRAINT "products_documents_files_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."products_documents_files"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_products_v_version_documents_files" ADD CONSTRAINT "_products_v_version_documents_files_file_id_media_id_fk" FOREIGN KEY ("file_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_products_v_version_documents_files" ADD CONSTRAINT "_products_v_version_documents_files_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_products_v_version_documents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_products_v_version_documents_files_locales" ADD CONSTRAINT "_products_v_version_documents_files_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_products_v_version_documents_files"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "products_documents_files_order_idx" ON "products_documents_files" USING btree ("_order");
  CREATE INDEX "products_documents_files_parent_id_idx" ON "products_documents_files" USING btree ("_parent_id");
  CREATE INDEX "products_documents_files_file_idx" ON "products_documents_files" USING btree ("file_id");
  CREATE UNIQUE INDEX "products_documents_files_locales_locale_parent_id_unique" ON "products_documents_files_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_products_v_version_documents_files_order_idx" ON "_products_v_version_documents_files" USING btree ("_order");
  CREATE INDEX "_products_v_version_documents_files_parent_id_idx" ON "_products_v_version_documents_files" USING btree ("_parent_id");
  CREATE INDEX "_products_v_version_documents_files_file_idx" ON "_products_v_version_documents_files" USING btree ("file_id");
  CREATE UNIQUE INDEX "_products_v_version_documents_files_locales_locale_parent_id" ON "_products_v_version_documents_files_locales" USING btree ("_locale","_parent_id");
  ALTER TABLE "products_documents" DROP COLUMN "file_id";
  ALTER TABLE "products_documents_locales" DROP COLUMN "label";
  ALTER TABLE "_products_v_version_documents" DROP COLUMN "file_id";
  ALTER TABLE "_products_v_version_documents_locales" DROP COLUMN "label";`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "products_documents_files" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "products_documents_files_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_products_v_version_documents_files" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_products_v_version_documents_files_locales" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "products_documents_files" CASCADE;
  DROP TABLE "products_documents_files_locales" CASCADE;
  DROP TABLE "_products_v_version_documents_files" CASCADE;
  DROP TABLE "_products_v_version_documents_files_locales" CASCADE;
  ALTER TABLE "products_documents" ADD COLUMN "file_id" integer;
  ALTER TABLE "products_documents_locales" ADD COLUMN "label" varchar;
  ALTER TABLE "_products_v_version_documents" ADD COLUMN "file_id" integer;
  ALTER TABLE "_products_v_version_documents_locales" ADD COLUMN "label" varchar;
  ALTER TABLE "products_documents" ADD CONSTRAINT "products_documents_file_id_media_id_fk" FOREIGN KEY ("file_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_products_v_version_documents" ADD CONSTRAINT "_products_v_version_documents_file_id_media_id_fk" FOREIGN KEY ("file_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "products_documents_file_idx" ON "products_documents" USING btree ("file_id");
  CREATE INDEX "_products_v_version_documents_file_idx" ON "_products_v_version_documents" USING btree ("file_id");
  ALTER TABLE "products_documents_locales" DROP COLUMN "category";
  ALTER TABLE "products_specifications" DROP COLUMN "standard_value";
  ALTER TABLE "products_locales" DROP COLUMN "standard_label";
  ALTER TABLE "products_locales" DROP COLUMN "quality_note";
  ALTER TABLE "products_locales" DROP COLUMN "warranty_note";
  ALTER TABLE "_products_v_version_documents_locales" DROP COLUMN "category";
  ALTER TABLE "_products_v_version_specifications" DROP COLUMN "standard_value";
  ALTER TABLE "_products_v_locales" DROP COLUMN "version_standard_label";
  ALTER TABLE "_products_v_locales" DROP COLUMN "version_quality_note";
  ALTER TABLE "_products_v_locales" DROP COLUMN "version_warranty_note";`)
}
