import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "pages_blocks_latest_posts" (
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
  
  CREATE TABLE "_pages_v_blocks_latest_posts" (
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
  
  ALTER TABLE "posts" ADD COLUMN "video_url" varchar;
  ALTER TABLE "posts_rels" ADD COLUMN "media_id" integer;
  ALTER TABLE "_posts_v" ADD COLUMN "version_video_url" varchar;
  ALTER TABLE "_posts_v_rels" ADD COLUMN "media_id" integer;
  ALTER TABLE "pages_blocks_latest_posts" ADD CONSTRAINT "pages_blocks_latest_posts_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_latest_posts" ADD CONSTRAINT "_pages_v_blocks_latest_posts_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "pages_blocks_latest_posts_order_idx" ON "pages_blocks_latest_posts" USING btree ("_order");
  CREATE INDEX "pages_blocks_latest_posts_parent_id_idx" ON "pages_blocks_latest_posts" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_latest_posts_path_idx" ON "pages_blocks_latest_posts" USING btree ("_path");
  CREATE INDEX "pages_blocks_latest_posts_locale_idx" ON "pages_blocks_latest_posts" USING btree ("_locale");
  CREATE INDEX "_pages_v_blocks_latest_posts_order_idx" ON "_pages_v_blocks_latest_posts" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_latest_posts_parent_id_idx" ON "_pages_v_blocks_latest_posts" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_latest_posts_path_idx" ON "_pages_v_blocks_latest_posts" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_latest_posts_locale_idx" ON "_pages_v_blocks_latest_posts" USING btree ("_locale");
  ALTER TABLE "posts_rels" ADD CONSTRAINT "posts_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_posts_v_rels" ADD CONSTRAINT "_posts_v_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "posts_rels_media_id_idx" ON "posts_rels" USING btree ("media_id");
  CREATE INDEX "_posts_v_rels_media_id_idx" ON "_posts_v_rels" USING btree ("media_id");`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pages_blocks_latest_posts" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_latest_posts" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "pages_blocks_latest_posts" CASCADE;
  DROP TABLE "_pages_v_blocks_latest_posts" CASCADE;
  ALTER TABLE "posts_rels" DROP CONSTRAINT "posts_rels_media_fk";
  
  ALTER TABLE "_posts_v_rels" DROP CONSTRAINT "_posts_v_rels_media_fk";
  
  DROP INDEX "posts_rels_media_id_idx";
  DROP INDEX "_posts_v_rels_media_id_idx";
  ALTER TABLE "posts" DROP COLUMN "video_url";
  ALTER TABLE "posts_rels" DROP COLUMN "media_id";
  ALTER TABLE "_posts_v" DROP COLUMN "version_video_url";
  ALTER TABLE "_posts_v_rels" DROP COLUMN "media_id";`)
}
