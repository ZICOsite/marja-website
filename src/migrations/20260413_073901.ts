import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "pages_blocks_downloads_files" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"file_id" integer
  );
  
  CREATE TABLE "pages_blocks_downloads" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_downloads_files" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"file_id" integer,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_downloads" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "projects_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"media_id" integer
  );
  
  CREATE TABLE "_projects_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"media_id" integer
  );
  
  ALTER TABLE "projects" DROP CONSTRAINT "projects_image_id_media_id_fk";
  
  ALTER TABLE "_projects_v" DROP CONSTRAINT "_projects_v_version_image_id_media_id_fk";
  
  DROP INDEX "projects_image_idx";
  DROP INDEX "_projects_v_version_version_image_idx";
  DROP INDEX "_projects_v_autosave_idx";
  ALTER TABLE "pages_blocks_downloads_files" ADD CONSTRAINT "pages_blocks_downloads_files_file_id_media_id_fk" FOREIGN KEY ("file_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_downloads_files" ADD CONSTRAINT "pages_blocks_downloads_files_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_downloads"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_downloads" ADD CONSTRAINT "pages_blocks_downloads_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_downloads_files" ADD CONSTRAINT "_pages_v_blocks_downloads_files_file_id_media_id_fk" FOREIGN KEY ("file_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_downloads_files" ADD CONSTRAINT "_pages_v_blocks_downloads_files_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_downloads"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_downloads" ADD CONSTRAINT "_pages_v_blocks_downloads_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects_rels" ADD CONSTRAINT "projects_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "projects_rels" ADD CONSTRAINT "projects_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_projects_v_rels" ADD CONSTRAINT "_projects_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_projects_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_projects_v_rels" ADD CONSTRAINT "_projects_v_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "pages_blocks_downloads_files_order_idx" ON "pages_blocks_downloads_files" USING btree ("_order");
  CREATE INDEX "pages_blocks_downloads_files_parent_id_idx" ON "pages_blocks_downloads_files" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_downloads_files_locale_idx" ON "pages_blocks_downloads_files" USING btree ("_locale");
  CREATE INDEX "pages_blocks_downloads_files_file_idx" ON "pages_blocks_downloads_files" USING btree ("file_id");
  CREATE INDEX "pages_blocks_downloads_order_idx" ON "pages_blocks_downloads" USING btree ("_order");
  CREATE INDEX "pages_blocks_downloads_parent_id_idx" ON "pages_blocks_downloads" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_downloads_path_idx" ON "pages_blocks_downloads" USING btree ("_path");
  CREATE INDEX "pages_blocks_downloads_locale_idx" ON "pages_blocks_downloads" USING btree ("_locale");
  CREATE INDEX "_pages_v_blocks_downloads_files_order_idx" ON "_pages_v_blocks_downloads_files" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_downloads_files_parent_id_idx" ON "_pages_v_blocks_downloads_files" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_downloads_files_locale_idx" ON "_pages_v_blocks_downloads_files" USING btree ("_locale");
  CREATE INDEX "_pages_v_blocks_downloads_files_file_idx" ON "_pages_v_blocks_downloads_files" USING btree ("file_id");
  CREATE INDEX "_pages_v_blocks_downloads_order_idx" ON "_pages_v_blocks_downloads" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_downloads_parent_id_idx" ON "_pages_v_blocks_downloads" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_downloads_path_idx" ON "_pages_v_blocks_downloads" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_downloads_locale_idx" ON "_pages_v_blocks_downloads" USING btree ("_locale");
  CREATE INDEX "projects_rels_order_idx" ON "projects_rels" USING btree ("order");
  CREATE INDEX "projects_rels_parent_idx" ON "projects_rels" USING btree ("parent_id");
  CREATE INDEX "projects_rels_path_idx" ON "projects_rels" USING btree ("path");
  CREATE INDEX "projects_rels_media_id_idx" ON "projects_rels" USING btree ("media_id");
  CREATE INDEX "_projects_v_rels_order_idx" ON "_projects_v_rels" USING btree ("order");
  CREATE INDEX "_projects_v_rels_parent_idx" ON "_projects_v_rels" USING btree ("parent_id");
  CREATE INDEX "_projects_v_rels_path_idx" ON "_projects_v_rels" USING btree ("path");
  CREATE INDEX "_projects_v_rels_media_id_idx" ON "_projects_v_rels" USING btree ("media_id");
  ALTER TABLE "projects" DROP COLUMN "image_id";
  ALTER TABLE "_projects_v" DROP COLUMN "version_image_id";
  ALTER TABLE "_projects_v" DROP COLUMN "autosave";`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pages_blocks_downloads_files" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_downloads" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_downloads_files" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_downloads" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "projects_rels" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_projects_v_rels" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "pages_blocks_downloads_files" CASCADE;
  DROP TABLE "pages_blocks_downloads" CASCADE;
  DROP TABLE "_pages_v_blocks_downloads_files" CASCADE;
  DROP TABLE "_pages_v_blocks_downloads" CASCADE;
  DROP TABLE "projects_rels" CASCADE;
  DROP TABLE "_projects_v_rels" CASCADE;
  ALTER TABLE "projects" ADD COLUMN "image_id" integer;
  ALTER TABLE "_projects_v" ADD COLUMN "version_image_id" integer;
  ALTER TABLE "_projects_v" ADD COLUMN "autosave" boolean;
  ALTER TABLE "projects" ADD CONSTRAINT "projects_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_projects_v" ADD CONSTRAINT "_projects_v_version_image_id_media_id_fk" FOREIGN KEY ("version_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "projects_image_idx" ON "projects" USING btree ("image_id");
  CREATE INDEX "_projects_v_version_version_image_idx" ON "_projects_v" USING btree ("version_image_id");
  CREATE INDEX "_projects_v_autosave_idx" ON "_projects_v" USING btree ("autosave");`)
}
