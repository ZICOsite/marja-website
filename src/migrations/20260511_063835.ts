import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_pages_blocks_warranty_features_items_icon" AS ENUM('shieldCheck', 'factory', 'users', 'star', 'award', 'badgeCheck');
  CREATE TYPE "public"."enum_pages_blocks_lean_tools_tools_icon" AS ENUM('layers', 'trendingUp', 'layoutGrid', 'gauge', 'wrench', 'barChart', 'target', 'shuffle', 'activity', 'shieldCheck');
  CREATE TYPE "public"."enum__pages_v_blocks_warranty_features_items_icon" AS ENUM('shieldCheck', 'factory', 'users', 'star', 'award', 'badgeCheck');
  CREATE TYPE "public"."enum__pages_v_blocks_lean_tools_tools_icon" AS ENUM('layers', 'trendingUp', 'layoutGrid', 'gauge', 'wrench', 'barChart', 'target', 'shuffle', 'activity', 'shieldCheck');
  CREATE TABLE "pages_blocks_warranty_intro" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"text" varchar,
  	"years" varchar DEFAULT '25',
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_marketing_analysis_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"year" varchar,
  	"description" varchar,
  	"value1" numeric
  );
  
  CREATE TABLE "pages_blocks_marketing_analysis" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"series1_label" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_company_growth_stats" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar,
  	"label" varchar
  );
  
  CREATE TABLE "pages_blocks_company_growth_achievements" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "pages_blocks_company_growth" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"heading" varchar,
  	"description" varchar,
  	"image_id" integer,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_warranty_features_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"icon" "enum_pages_blocks_warranty_features_items_icon" DEFAULT 'shieldCheck',
  	"title" varchar
  );
  
  CREATE TABLE "pages_blocks_warranty_features" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"description" varchar,
  	"background_image_id" integer,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_lean_intro_points" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"text" varchar
  );
  
  CREATE TABLE "pages_blocks_lean_intro" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"heading" varchar,
  	"description" varchar,
  	"image_id" integer,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_lean_principles_principles" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"description" varchar
  );
  
  CREATE TABLE "pages_blocks_lean_principles" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"description" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_lean_tools_tools" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"icon" "enum_pages_blocks_lean_tools_tools_icon" DEFAULT 'layers',
  	"name" varchar,
  	"title" varchar,
  	"description" varchar
  );
  
  CREATE TABLE "pages_blocks_lean_tools" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"description" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_lean_results_stats" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar,
  	"label" varchar
  );
  
  CREATE TABLE "pages_blocks_lean_results_comparisons" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"metric" varchar,
  	"before" varchar,
  	"after" varchar
  );
  
  CREATE TABLE "pages_blocks_lean_results" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"description" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_warranty_intro" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"text" varchar,
  	"years" varchar DEFAULT '25',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_marketing_analysis_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"year" varchar,
  	"description" varchar,
  	"value1" numeric,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_marketing_analysis" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"series1_label" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_company_growth_stats" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"value" varchar,
  	"label" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_company_growth_achievements" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"text" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_company_growth" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"heading" varchar,
  	"description" varchar,
  	"image_id" integer,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_warranty_features_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"icon" "enum__pages_v_blocks_warranty_features_items_icon" DEFAULT 'shieldCheck',
  	"title" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_warranty_features" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"description" varchar,
  	"background_image_id" integer,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_lean_intro_points" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"text" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_lean_intro" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"heading" varchar,
  	"description" varchar,
  	"image_id" integer,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_lean_principles_principles" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"title" varchar,
  	"description" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_lean_principles" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"description" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_lean_tools_tools" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"icon" "enum__pages_v_blocks_lean_tools_tools_icon" DEFAULT 'layers',
  	"name" varchar,
  	"title" varchar,
  	"description" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_lean_tools" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"description" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_lean_results_stats" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"value" varchar,
  	"label" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_lean_results_comparisons" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"metric" varchar,
  	"before" varchar,
  	"after" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_lean_results" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading" varchar,
  	"description" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  ALTER TABLE "product_categories" ADD COLUMN "sort_order" numeric;
  ALTER TABLE "_product_categories_v" ADD COLUMN "version_sort_order" numeric;
  ALTER TABLE "pages_blocks_warranty_intro" ADD CONSTRAINT "pages_blocks_warranty_intro_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_marketing_analysis_items" ADD CONSTRAINT "pages_blocks_marketing_analysis_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_marketing_analysis"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_marketing_analysis" ADD CONSTRAINT "pages_blocks_marketing_analysis_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_company_growth_stats" ADD CONSTRAINT "pages_blocks_company_growth_stats_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_company_growth"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_company_growth_achievements" ADD CONSTRAINT "pages_blocks_company_growth_achievements_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_company_growth"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_company_growth" ADD CONSTRAINT "pages_blocks_company_growth_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_company_growth" ADD CONSTRAINT "pages_blocks_company_growth_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_warranty_features_items" ADD CONSTRAINT "pages_blocks_warranty_features_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_warranty_features"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_warranty_features" ADD CONSTRAINT "pages_blocks_warranty_features_background_image_id_media_id_fk" FOREIGN KEY ("background_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_warranty_features" ADD CONSTRAINT "pages_blocks_warranty_features_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_lean_intro_points" ADD CONSTRAINT "pages_blocks_lean_intro_points_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_lean_intro"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_lean_intro" ADD CONSTRAINT "pages_blocks_lean_intro_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_lean_intro" ADD CONSTRAINT "pages_blocks_lean_intro_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_lean_principles_principles" ADD CONSTRAINT "pages_blocks_lean_principles_principles_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_lean_principles"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_lean_principles" ADD CONSTRAINT "pages_blocks_lean_principles_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_lean_tools_tools" ADD CONSTRAINT "pages_blocks_lean_tools_tools_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_lean_tools"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_lean_tools" ADD CONSTRAINT "pages_blocks_lean_tools_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_lean_results_stats" ADD CONSTRAINT "pages_blocks_lean_results_stats_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_lean_results"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_lean_results_comparisons" ADD CONSTRAINT "pages_blocks_lean_results_comparisons_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_lean_results"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_lean_results" ADD CONSTRAINT "pages_blocks_lean_results_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_warranty_intro" ADD CONSTRAINT "_pages_v_blocks_warranty_intro_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_marketing_analysis_items" ADD CONSTRAINT "_pages_v_blocks_marketing_analysis_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_marketing_analysis"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_marketing_analysis" ADD CONSTRAINT "_pages_v_blocks_marketing_analysis_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_company_growth_stats" ADD CONSTRAINT "_pages_v_blocks_company_growth_stats_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_company_growth"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_company_growth_achievements" ADD CONSTRAINT "_pages_v_blocks_company_growth_achievements_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_company_growth"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_company_growth" ADD CONSTRAINT "_pages_v_blocks_company_growth_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_company_growth" ADD CONSTRAINT "_pages_v_blocks_company_growth_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_warranty_features_items" ADD CONSTRAINT "_pages_v_blocks_warranty_features_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_warranty_features"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_warranty_features" ADD CONSTRAINT "_pages_v_blocks_warranty_features_background_image_id_media_id_fk" FOREIGN KEY ("background_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_warranty_features" ADD CONSTRAINT "_pages_v_blocks_warranty_features_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_lean_intro_points" ADD CONSTRAINT "_pages_v_blocks_lean_intro_points_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_lean_intro"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_lean_intro" ADD CONSTRAINT "_pages_v_blocks_lean_intro_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_lean_intro" ADD CONSTRAINT "_pages_v_blocks_lean_intro_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_lean_principles_principles" ADD CONSTRAINT "_pages_v_blocks_lean_principles_principles_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_lean_principles"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_lean_principles" ADD CONSTRAINT "_pages_v_blocks_lean_principles_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_lean_tools_tools" ADD CONSTRAINT "_pages_v_blocks_lean_tools_tools_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_lean_tools"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_lean_tools" ADD CONSTRAINT "_pages_v_blocks_lean_tools_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_lean_results_stats" ADD CONSTRAINT "_pages_v_blocks_lean_results_stats_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_lean_results"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_lean_results_comparisons" ADD CONSTRAINT "_pages_v_blocks_lean_results_comparisons_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_lean_results"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_lean_results" ADD CONSTRAINT "_pages_v_blocks_lean_results_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "pages_blocks_warranty_intro_order_idx" ON "pages_blocks_warranty_intro" USING btree ("_order");
  CREATE INDEX "pages_blocks_warranty_intro_parent_id_idx" ON "pages_blocks_warranty_intro" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_warranty_intro_path_idx" ON "pages_blocks_warranty_intro" USING btree ("_path");
  CREATE INDEX "pages_blocks_warranty_intro_locale_idx" ON "pages_blocks_warranty_intro" USING btree ("_locale");
  CREATE INDEX "pages_blocks_marketing_analysis_items_order_idx" ON "pages_blocks_marketing_analysis_items" USING btree ("_order");
  CREATE INDEX "pages_blocks_marketing_analysis_items_parent_id_idx" ON "pages_blocks_marketing_analysis_items" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_marketing_analysis_items_locale_idx" ON "pages_blocks_marketing_analysis_items" USING btree ("_locale");
  CREATE INDEX "pages_blocks_marketing_analysis_order_idx" ON "pages_blocks_marketing_analysis" USING btree ("_order");
  CREATE INDEX "pages_blocks_marketing_analysis_parent_id_idx" ON "pages_blocks_marketing_analysis" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_marketing_analysis_path_idx" ON "pages_blocks_marketing_analysis" USING btree ("_path");
  CREATE INDEX "pages_blocks_marketing_analysis_locale_idx" ON "pages_blocks_marketing_analysis" USING btree ("_locale");
  CREATE INDEX "pages_blocks_company_growth_stats_order_idx" ON "pages_blocks_company_growth_stats" USING btree ("_order");
  CREATE INDEX "pages_blocks_company_growth_stats_parent_id_idx" ON "pages_blocks_company_growth_stats" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_company_growth_stats_locale_idx" ON "pages_blocks_company_growth_stats" USING btree ("_locale");
  CREATE INDEX "pages_blocks_company_growth_achievements_order_idx" ON "pages_blocks_company_growth_achievements" USING btree ("_order");
  CREATE INDEX "pages_blocks_company_growth_achievements_parent_id_idx" ON "pages_blocks_company_growth_achievements" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_company_growth_achievements_locale_idx" ON "pages_blocks_company_growth_achievements" USING btree ("_locale");
  CREATE INDEX "pages_blocks_company_growth_order_idx" ON "pages_blocks_company_growth" USING btree ("_order");
  CREATE INDEX "pages_blocks_company_growth_parent_id_idx" ON "pages_blocks_company_growth" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_company_growth_path_idx" ON "pages_blocks_company_growth" USING btree ("_path");
  CREATE INDEX "pages_blocks_company_growth_locale_idx" ON "pages_blocks_company_growth" USING btree ("_locale");
  CREATE INDEX "pages_blocks_company_growth_image_idx" ON "pages_blocks_company_growth" USING btree ("image_id");
  CREATE INDEX "pages_blocks_warranty_features_items_order_idx" ON "pages_blocks_warranty_features_items" USING btree ("_order");
  CREATE INDEX "pages_blocks_warranty_features_items_parent_id_idx" ON "pages_blocks_warranty_features_items" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_warranty_features_items_locale_idx" ON "pages_blocks_warranty_features_items" USING btree ("_locale");
  CREATE INDEX "pages_blocks_warranty_features_order_idx" ON "pages_blocks_warranty_features" USING btree ("_order");
  CREATE INDEX "pages_blocks_warranty_features_parent_id_idx" ON "pages_blocks_warranty_features" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_warranty_features_path_idx" ON "pages_blocks_warranty_features" USING btree ("_path");
  CREATE INDEX "pages_blocks_warranty_features_locale_idx" ON "pages_blocks_warranty_features" USING btree ("_locale");
  CREATE INDEX "pages_blocks_warranty_features_background_image_idx" ON "pages_blocks_warranty_features" USING btree ("background_image_id");
  CREATE INDEX "pages_blocks_lean_intro_points_order_idx" ON "pages_blocks_lean_intro_points" USING btree ("_order");
  CREATE INDEX "pages_blocks_lean_intro_points_parent_id_idx" ON "pages_blocks_lean_intro_points" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_lean_intro_points_locale_idx" ON "pages_blocks_lean_intro_points" USING btree ("_locale");
  CREATE INDEX "pages_blocks_lean_intro_order_idx" ON "pages_blocks_lean_intro" USING btree ("_order");
  CREATE INDEX "pages_blocks_lean_intro_parent_id_idx" ON "pages_blocks_lean_intro" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_lean_intro_path_idx" ON "pages_blocks_lean_intro" USING btree ("_path");
  CREATE INDEX "pages_blocks_lean_intro_locale_idx" ON "pages_blocks_lean_intro" USING btree ("_locale");
  CREATE INDEX "pages_blocks_lean_intro_image_idx" ON "pages_blocks_lean_intro" USING btree ("image_id");
  CREATE INDEX "pages_blocks_lean_principles_principles_order_idx" ON "pages_blocks_lean_principles_principles" USING btree ("_order");
  CREATE INDEX "pages_blocks_lean_principles_principles_parent_id_idx" ON "pages_blocks_lean_principles_principles" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_lean_principles_principles_locale_idx" ON "pages_blocks_lean_principles_principles" USING btree ("_locale");
  CREATE INDEX "pages_blocks_lean_principles_order_idx" ON "pages_blocks_lean_principles" USING btree ("_order");
  CREATE INDEX "pages_blocks_lean_principles_parent_id_idx" ON "pages_blocks_lean_principles" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_lean_principles_path_idx" ON "pages_blocks_lean_principles" USING btree ("_path");
  CREATE INDEX "pages_blocks_lean_principles_locale_idx" ON "pages_blocks_lean_principles" USING btree ("_locale");
  CREATE INDEX "pages_blocks_lean_tools_tools_order_idx" ON "pages_blocks_lean_tools_tools" USING btree ("_order");
  CREATE INDEX "pages_blocks_lean_tools_tools_parent_id_idx" ON "pages_blocks_lean_tools_tools" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_lean_tools_tools_locale_idx" ON "pages_blocks_lean_tools_tools" USING btree ("_locale");
  CREATE INDEX "pages_blocks_lean_tools_order_idx" ON "pages_blocks_lean_tools" USING btree ("_order");
  CREATE INDEX "pages_blocks_lean_tools_parent_id_idx" ON "pages_blocks_lean_tools" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_lean_tools_path_idx" ON "pages_blocks_lean_tools" USING btree ("_path");
  CREATE INDEX "pages_blocks_lean_tools_locale_idx" ON "pages_blocks_lean_tools" USING btree ("_locale");
  CREATE INDEX "pages_blocks_lean_results_stats_order_idx" ON "pages_blocks_lean_results_stats" USING btree ("_order");
  CREATE INDEX "pages_blocks_lean_results_stats_parent_id_idx" ON "pages_blocks_lean_results_stats" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_lean_results_stats_locale_idx" ON "pages_blocks_lean_results_stats" USING btree ("_locale");
  CREATE INDEX "pages_blocks_lean_results_comparisons_order_idx" ON "pages_blocks_lean_results_comparisons" USING btree ("_order");
  CREATE INDEX "pages_blocks_lean_results_comparisons_parent_id_idx" ON "pages_blocks_lean_results_comparisons" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_lean_results_comparisons_locale_idx" ON "pages_blocks_lean_results_comparisons" USING btree ("_locale");
  CREATE INDEX "pages_blocks_lean_results_order_idx" ON "pages_blocks_lean_results" USING btree ("_order");
  CREATE INDEX "pages_blocks_lean_results_parent_id_idx" ON "pages_blocks_lean_results" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_lean_results_path_idx" ON "pages_blocks_lean_results" USING btree ("_path");
  CREATE INDEX "pages_blocks_lean_results_locale_idx" ON "pages_blocks_lean_results" USING btree ("_locale");
  CREATE INDEX "_pages_v_blocks_warranty_intro_order_idx" ON "_pages_v_blocks_warranty_intro" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_warranty_intro_parent_id_idx" ON "_pages_v_blocks_warranty_intro" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_warranty_intro_path_idx" ON "_pages_v_blocks_warranty_intro" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_warranty_intro_locale_idx" ON "_pages_v_blocks_warranty_intro" USING btree ("_locale");
  CREATE INDEX "_pages_v_blocks_marketing_analysis_items_order_idx" ON "_pages_v_blocks_marketing_analysis_items" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_marketing_analysis_items_parent_id_idx" ON "_pages_v_blocks_marketing_analysis_items" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_marketing_analysis_items_locale_idx" ON "_pages_v_blocks_marketing_analysis_items" USING btree ("_locale");
  CREATE INDEX "_pages_v_blocks_marketing_analysis_order_idx" ON "_pages_v_blocks_marketing_analysis" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_marketing_analysis_parent_id_idx" ON "_pages_v_blocks_marketing_analysis" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_marketing_analysis_path_idx" ON "_pages_v_blocks_marketing_analysis" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_marketing_analysis_locale_idx" ON "_pages_v_blocks_marketing_analysis" USING btree ("_locale");
  CREATE INDEX "_pages_v_blocks_company_growth_stats_order_idx" ON "_pages_v_blocks_company_growth_stats" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_company_growth_stats_parent_id_idx" ON "_pages_v_blocks_company_growth_stats" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_company_growth_stats_locale_idx" ON "_pages_v_blocks_company_growth_stats" USING btree ("_locale");
  CREATE INDEX "_pages_v_blocks_company_growth_achievements_order_idx" ON "_pages_v_blocks_company_growth_achievements" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_company_growth_achievements_parent_id_idx" ON "_pages_v_blocks_company_growth_achievements" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_company_growth_achievements_locale_idx" ON "_pages_v_blocks_company_growth_achievements" USING btree ("_locale");
  CREATE INDEX "_pages_v_blocks_company_growth_order_idx" ON "_pages_v_blocks_company_growth" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_company_growth_parent_id_idx" ON "_pages_v_blocks_company_growth" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_company_growth_path_idx" ON "_pages_v_blocks_company_growth" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_company_growth_locale_idx" ON "_pages_v_blocks_company_growth" USING btree ("_locale");
  CREATE INDEX "_pages_v_blocks_company_growth_image_idx" ON "_pages_v_blocks_company_growth" USING btree ("image_id");
  CREATE INDEX "_pages_v_blocks_warranty_features_items_order_idx" ON "_pages_v_blocks_warranty_features_items" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_warranty_features_items_parent_id_idx" ON "_pages_v_blocks_warranty_features_items" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_warranty_features_items_locale_idx" ON "_pages_v_blocks_warranty_features_items" USING btree ("_locale");
  CREATE INDEX "_pages_v_blocks_warranty_features_order_idx" ON "_pages_v_blocks_warranty_features" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_warranty_features_parent_id_idx" ON "_pages_v_blocks_warranty_features" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_warranty_features_path_idx" ON "_pages_v_blocks_warranty_features" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_warranty_features_locale_idx" ON "_pages_v_blocks_warranty_features" USING btree ("_locale");
  CREATE INDEX "_pages_v_blocks_warranty_features_background_image_idx" ON "_pages_v_blocks_warranty_features" USING btree ("background_image_id");
  CREATE INDEX "_pages_v_blocks_lean_intro_points_order_idx" ON "_pages_v_blocks_lean_intro_points" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_lean_intro_points_parent_id_idx" ON "_pages_v_blocks_lean_intro_points" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_lean_intro_points_locale_idx" ON "_pages_v_blocks_lean_intro_points" USING btree ("_locale");
  CREATE INDEX "_pages_v_blocks_lean_intro_order_idx" ON "_pages_v_blocks_lean_intro" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_lean_intro_parent_id_idx" ON "_pages_v_blocks_lean_intro" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_lean_intro_path_idx" ON "_pages_v_blocks_lean_intro" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_lean_intro_locale_idx" ON "_pages_v_blocks_lean_intro" USING btree ("_locale");
  CREATE INDEX "_pages_v_blocks_lean_intro_image_idx" ON "_pages_v_blocks_lean_intro" USING btree ("image_id");
  CREATE INDEX "_pages_v_blocks_lean_principles_principles_order_idx" ON "_pages_v_blocks_lean_principles_principles" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_lean_principles_principles_parent_id_idx" ON "_pages_v_blocks_lean_principles_principles" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_lean_principles_principles_locale_idx" ON "_pages_v_blocks_lean_principles_principles" USING btree ("_locale");
  CREATE INDEX "_pages_v_blocks_lean_principles_order_idx" ON "_pages_v_blocks_lean_principles" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_lean_principles_parent_id_idx" ON "_pages_v_blocks_lean_principles" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_lean_principles_path_idx" ON "_pages_v_blocks_lean_principles" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_lean_principles_locale_idx" ON "_pages_v_blocks_lean_principles" USING btree ("_locale");
  CREATE INDEX "_pages_v_blocks_lean_tools_tools_order_idx" ON "_pages_v_blocks_lean_tools_tools" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_lean_tools_tools_parent_id_idx" ON "_pages_v_blocks_lean_tools_tools" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_lean_tools_tools_locale_idx" ON "_pages_v_blocks_lean_tools_tools" USING btree ("_locale");
  CREATE INDEX "_pages_v_blocks_lean_tools_order_idx" ON "_pages_v_blocks_lean_tools" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_lean_tools_parent_id_idx" ON "_pages_v_blocks_lean_tools" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_lean_tools_path_idx" ON "_pages_v_blocks_lean_tools" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_lean_tools_locale_idx" ON "_pages_v_blocks_lean_tools" USING btree ("_locale");
  CREATE INDEX "_pages_v_blocks_lean_results_stats_order_idx" ON "_pages_v_blocks_lean_results_stats" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_lean_results_stats_parent_id_idx" ON "_pages_v_blocks_lean_results_stats" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_lean_results_stats_locale_idx" ON "_pages_v_blocks_lean_results_stats" USING btree ("_locale");
  CREATE INDEX "_pages_v_blocks_lean_results_comparisons_order_idx" ON "_pages_v_blocks_lean_results_comparisons" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_lean_results_comparisons_parent_id_idx" ON "_pages_v_blocks_lean_results_comparisons" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_lean_results_comparisons_locale_idx" ON "_pages_v_blocks_lean_results_comparisons" USING btree ("_locale");
  CREATE INDEX "_pages_v_blocks_lean_results_order_idx" ON "_pages_v_blocks_lean_results" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_lean_results_parent_id_idx" ON "_pages_v_blocks_lean_results" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_lean_results_path_idx" ON "_pages_v_blocks_lean_results" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_lean_results_locale_idx" ON "_pages_v_blocks_lean_results" USING btree ("_locale");`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "pages_blocks_warranty_intro" CASCADE;
  DROP TABLE "pages_blocks_marketing_analysis_items" CASCADE;
  DROP TABLE "pages_blocks_marketing_analysis" CASCADE;
  DROP TABLE "pages_blocks_company_growth_stats" CASCADE;
  DROP TABLE "pages_blocks_company_growth_achievements" CASCADE;
  DROP TABLE "pages_blocks_company_growth" CASCADE;
  DROP TABLE "pages_blocks_warranty_features_items" CASCADE;
  DROP TABLE "pages_blocks_warranty_features" CASCADE;
  DROP TABLE "pages_blocks_lean_intro_points" CASCADE;
  DROP TABLE "pages_blocks_lean_intro" CASCADE;
  DROP TABLE "pages_blocks_lean_principles_principles" CASCADE;
  DROP TABLE "pages_blocks_lean_principles" CASCADE;
  DROP TABLE "pages_blocks_lean_tools_tools" CASCADE;
  DROP TABLE "pages_blocks_lean_tools" CASCADE;
  DROP TABLE "pages_blocks_lean_results_stats" CASCADE;
  DROP TABLE "pages_blocks_lean_results_comparisons" CASCADE;
  DROP TABLE "pages_blocks_lean_results" CASCADE;
  DROP TABLE "_pages_v_blocks_warranty_intro" CASCADE;
  DROP TABLE "_pages_v_blocks_marketing_analysis_items" CASCADE;
  DROP TABLE "_pages_v_blocks_marketing_analysis" CASCADE;
  DROP TABLE "_pages_v_blocks_company_growth_stats" CASCADE;
  DROP TABLE "_pages_v_blocks_company_growth_achievements" CASCADE;
  DROP TABLE "_pages_v_blocks_company_growth" CASCADE;
  DROP TABLE "_pages_v_blocks_warranty_features_items" CASCADE;
  DROP TABLE "_pages_v_blocks_warranty_features" CASCADE;
  DROP TABLE "_pages_v_blocks_lean_intro_points" CASCADE;
  DROP TABLE "_pages_v_blocks_lean_intro" CASCADE;
  DROP TABLE "_pages_v_blocks_lean_principles_principles" CASCADE;
  DROP TABLE "_pages_v_blocks_lean_principles" CASCADE;
  DROP TABLE "_pages_v_blocks_lean_tools_tools" CASCADE;
  DROP TABLE "_pages_v_blocks_lean_tools" CASCADE;
  DROP TABLE "_pages_v_blocks_lean_results_stats" CASCADE;
  DROP TABLE "_pages_v_blocks_lean_results_comparisons" CASCADE;
  DROP TABLE "_pages_v_blocks_lean_results" CASCADE;
  ALTER TABLE "product_categories" DROP COLUMN "sort_order";
  ALTER TABLE "_product_categories_v" DROP COLUMN "version_sort_order";
  DROP TYPE "public"."enum_pages_blocks_warranty_features_items_icon";
  DROP TYPE "public"."enum_pages_blocks_lean_tools_tools_icon";
  DROP TYPE "public"."enum__pages_v_blocks_warranty_features_items_icon";
  DROP TYPE "public"."enum__pages_v_blocks_lean_tools_tools_icon";`)
}
