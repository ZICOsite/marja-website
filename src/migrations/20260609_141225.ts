import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TABLE "pages_blocks_activity_feed" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"tagline" varchar,
  	"title" varchar,
  	"description" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_activity_feed" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"tagline" varchar,
  	"title" varchar,
  	"description" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  ALTER TABLE "pages_blocks_activity_feed" ADD CONSTRAINT "pages_blocks_activity_feed_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_activity_feed" ADD CONSTRAINT "_pages_v_blocks_activity_feed_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "pages_blocks_activity_feed_order_idx" ON "pages_blocks_activity_feed" USING btree ("_order");
  CREATE INDEX "pages_blocks_activity_feed_parent_id_idx" ON "pages_blocks_activity_feed" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_activity_feed_path_idx" ON "pages_blocks_activity_feed" USING btree ("_path");
  CREATE INDEX "pages_blocks_activity_feed_locale_idx" ON "pages_blocks_activity_feed" USING btree ("_locale");
  CREATE INDEX "_pages_v_blocks_activity_feed_order_idx" ON "_pages_v_blocks_activity_feed" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_activity_feed_parent_id_idx" ON "_pages_v_blocks_activity_feed" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_activity_feed_path_idx" ON "_pages_v_blocks_activity_feed" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_activity_feed_locale_idx" ON "_pages_v_blocks_activity_feed" USING btree ("_locale");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "pages_blocks_activity_feed" CASCADE;
  DROP TABLE "_pages_v_blocks_activity_feed" CASCADE;`)
}
