import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_pages_blocks_careers_sections_layout" AS ENUM('oneColumn', 'twoColumns');
  CREATE TYPE "public"."enum__pages_v_blocks_careers_sections_layout" AS ENUM('oneColumn', 'twoColumns');
  CREATE TABLE "pages_blocks_careers_sections" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"layout" "enum_pages_blocks_careers_sections_layout" DEFAULT 'oneColumn',
  	"content" jsonb,
  	"content_right" jsonb
  );
  
  CREATE TABLE "pages_blocks_careers" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"photo_id" integer,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_careers_sections" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"layout" "enum__pages_v_blocks_careers_sections_layout" DEFAULT 'oneColumn',
  	"content" jsonb,
  	"content_right" jsonb,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_careers" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"photo_id" integer,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  ALTER TABLE "pages_blocks_careers_sections" ADD CONSTRAINT "pages_blocks_careers_sections_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_careers"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_careers" ADD CONSTRAINT "pages_blocks_careers_photo_id_media_id_fk" FOREIGN KEY ("photo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_careers" ADD CONSTRAINT "pages_blocks_careers_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_careers_sections" ADD CONSTRAINT "_pages_v_blocks_careers_sections_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_careers"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_careers" ADD CONSTRAINT "_pages_v_blocks_careers_photo_id_media_id_fk" FOREIGN KEY ("photo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_careers" ADD CONSTRAINT "_pages_v_blocks_careers_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "pages_blocks_careers_sections_order_idx" ON "pages_blocks_careers_sections" USING btree ("_order");
  CREATE INDEX "pages_blocks_careers_sections_parent_id_idx" ON "pages_blocks_careers_sections" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_careers_sections_locale_idx" ON "pages_blocks_careers_sections" USING btree ("_locale");
  CREATE INDEX "pages_blocks_careers_order_idx" ON "pages_blocks_careers" USING btree ("_order");
  CREATE INDEX "pages_blocks_careers_parent_id_idx" ON "pages_blocks_careers" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_careers_path_idx" ON "pages_blocks_careers" USING btree ("_path");
  CREATE INDEX "pages_blocks_careers_locale_idx" ON "pages_blocks_careers" USING btree ("_locale");
  CREATE INDEX "pages_blocks_careers_photo_idx" ON "pages_blocks_careers" USING btree ("photo_id");
  CREATE INDEX "_pages_v_blocks_careers_sections_order_idx" ON "_pages_v_blocks_careers_sections" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_careers_sections_parent_id_idx" ON "_pages_v_blocks_careers_sections" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_careers_sections_locale_idx" ON "_pages_v_blocks_careers_sections" USING btree ("_locale");
  CREATE INDEX "_pages_v_blocks_careers_order_idx" ON "_pages_v_blocks_careers" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_careers_parent_id_idx" ON "_pages_v_blocks_careers" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_careers_path_idx" ON "_pages_v_blocks_careers" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_careers_locale_idx" ON "_pages_v_blocks_careers" USING btree ("_locale");
  CREATE INDEX "_pages_v_blocks_careers_photo_idx" ON "_pages_v_blocks_careers" USING btree ("photo_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "pages_blocks_careers_sections" CASCADE;
  DROP TABLE "pages_blocks_careers" CASCADE;
  DROP TABLE "_pages_v_blocks_careers_sections" CASCADE;
  DROP TABLE "_pages_v_blocks_careers" CASCADE;
  DROP TYPE "public"."enum_pages_blocks_careers_sections_layout";
  DROP TYPE "public"."enum__pages_v_blocks_careers_sections_layout";`)
}
