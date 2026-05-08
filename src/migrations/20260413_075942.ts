import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "pages_blocks_documentation_categories_files" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"file_id" integer
  );
  
  CREATE TABLE "pages_blocks_documentation_categories" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar
  );
  
  CREATE TABLE "pages_blocks_documentation" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_documentation_categories_files" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"file_id" integer,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_documentation_categories" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_documentation" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  ALTER TABLE "pages_blocks_documentation_categories_files" ADD CONSTRAINT "pages_blocks_documentation_categories_files_file_id_media_id_fk" FOREIGN KEY ("file_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_documentation_categories_files" ADD CONSTRAINT "pages_blocks_documentation_categories_files_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_documentation_categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_documentation_categories" ADD CONSTRAINT "pages_blocks_documentation_categories_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_documentation"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_documentation" ADD CONSTRAINT "pages_blocks_documentation_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_documentation_categories_files" ADD CONSTRAINT "_pages_v_blocks_documentation_categories_files_file_id_media_id_fk" FOREIGN KEY ("file_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_documentation_categories_files" ADD CONSTRAINT "_pages_v_blocks_documentation_categories_files_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_documentation_categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_documentation_categories" ADD CONSTRAINT "_pages_v_blocks_documentation_categories_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_documentation"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_documentation" ADD CONSTRAINT "_pages_v_blocks_documentation_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "pages_blocks_documentation_categories_files_order_idx" ON "pages_blocks_documentation_categories_files" USING btree ("_order");
  CREATE INDEX "pages_blocks_documentation_categories_files_parent_id_idx" ON "pages_blocks_documentation_categories_files" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_documentation_categories_files_locale_idx" ON "pages_blocks_documentation_categories_files" USING btree ("_locale");
  CREATE INDEX "pages_blocks_documentation_categories_files_file_idx" ON "pages_blocks_documentation_categories_files" USING btree ("file_id");
  CREATE INDEX "pages_blocks_documentation_categories_order_idx" ON "pages_blocks_documentation_categories" USING btree ("_order");
  CREATE INDEX "pages_blocks_documentation_categories_parent_id_idx" ON "pages_blocks_documentation_categories" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_documentation_categories_locale_idx" ON "pages_blocks_documentation_categories" USING btree ("_locale");
  CREATE INDEX "pages_blocks_documentation_order_idx" ON "pages_blocks_documentation" USING btree ("_order");
  CREATE INDEX "pages_blocks_documentation_parent_id_idx" ON "pages_blocks_documentation" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_documentation_path_idx" ON "pages_blocks_documentation" USING btree ("_path");
  CREATE INDEX "pages_blocks_documentation_locale_idx" ON "pages_blocks_documentation" USING btree ("_locale");
  CREATE INDEX "_pages_v_blocks_documentation_categories_files_order_idx" ON "_pages_v_blocks_documentation_categories_files" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_documentation_categories_files_parent_id_idx" ON "_pages_v_blocks_documentation_categories_files" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_documentation_categories_files_locale_idx" ON "_pages_v_blocks_documentation_categories_files" USING btree ("_locale");
  CREATE INDEX "_pages_v_blocks_documentation_categories_files_file_idx" ON "_pages_v_blocks_documentation_categories_files" USING btree ("file_id");
  CREATE INDEX "_pages_v_blocks_documentation_categories_order_idx" ON "_pages_v_blocks_documentation_categories" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_documentation_categories_parent_id_idx" ON "_pages_v_blocks_documentation_categories" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_documentation_categories_locale_idx" ON "_pages_v_blocks_documentation_categories" USING btree ("_locale");
  CREATE INDEX "_pages_v_blocks_documentation_order_idx" ON "_pages_v_blocks_documentation" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_documentation_parent_id_idx" ON "_pages_v_blocks_documentation" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_documentation_path_idx" ON "_pages_v_blocks_documentation" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_documentation_locale_idx" ON "_pages_v_blocks_documentation" USING btree ("_locale");`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "pages_blocks_documentation_categories_files" CASCADE;
  DROP TABLE "pages_blocks_documentation_categories" CASCADE;
  DROP TABLE "pages_blocks_documentation" CASCADE;
  DROP TABLE "_pages_v_blocks_documentation_categories_files" CASCADE;
  DROP TABLE "_pages_v_blocks_documentation_categories" CASCADE;
  DROP TABLE "_pages_v_blocks_documentation" CASCADE;`)
}
