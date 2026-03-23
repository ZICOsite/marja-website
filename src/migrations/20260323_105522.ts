import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."enum_pages_blocks_cta_title_tag" AS ENUM('h1', 'h2', 'h3', 'h4');
  CREATE TYPE "public"."enum_pages_blocks_features_items_icon" AS ENUM('infinity', 'badgePercent', 'shieldCheck', 'factory');
  CREATE TYPE "public"."enum_pages_blocks_solutions_cards_type" AS ENUM('foundation', 'roof');
  CREATE TYPE "public"."enum_pages_blocks_about_company_features_icon" AS ENUM('shield', 'factory', 'check', 'award', 'zap');
  CREATE TYPE "public"."enum_pages_blocks_about_company_button_type" AS ENUM('reference', 'custom');
  CREATE TYPE "public"."enum__pages_v_blocks_cta_title_tag" AS ENUM('h1', 'h2', 'h3', 'h4');
  CREATE TYPE "public"."enum__pages_v_blocks_features_items_icon" AS ENUM('infinity', 'badgePercent', 'shieldCheck', 'factory');
  CREATE TYPE "public"."enum__pages_v_blocks_solutions_cards_type" AS ENUM('foundation', 'roof');
  CREATE TYPE "public"."enum__pages_v_blocks_about_company_features_icon" AS ENUM('shield', 'factory', 'check', 'award', 'zap');
  CREATE TYPE "public"."enum__pages_v_blocks_about_company_button_type" AS ENUM('reference', 'custom');
  CREATE TYPE "public"."enum_products_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__products_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__products_v_published_locale" AS ENUM('uz', 'ru', 'en', 'tg', 'kk');
  CREATE TYPE "public"."enum_product_categories_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__product_categories_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__product_categories_v_published_locale" AS ENUM('uz', 'ru', 'en', 'tg', 'kk');
  CREATE TYPE "public"."enum_attributes_type" AS ENUM('text', 'number', 'select', 'boolean');
  CREATE TABLE "pages_blocks_features_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"icon" "enum_pages_blocks_features_items_icon" DEFAULT 'shieldCheck',
  	"title" varchar,
  	"description" varchar
  );
  
  CREATE TABLE "pages_blocks_features" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_stats_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar,
  	"label" varchar
  );
  
  CREATE TABLE "pages_blocks_stats" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_solutions_cards" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"title" varchar,
  	"description" varchar,
  	"type" "enum_pages_blocks_solutions_cards_type" DEFAULT 'foundation',
  	"link" varchar DEFAULT '#!'
  );
  
  CREATE TABLE "pages_blocks_solutions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"tagline" varchar DEFAULT 'Готовые системы',
  	"title" varchar DEFAULT 'Комплексные решения',
  	"description" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_about_company_features" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"icon" "enum_pages_blocks_about_company_features_icon" DEFAULT 'shield',
  	"title" varchar,
  	"description" varchar
  );
  
  CREATE TABLE "pages_blocks_about_company" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"title" varchar,
  	"title_highlight" varchar,
  	"description" jsonb,
  	"image_id" integer,
  	"stat_value" varchar,
  	"stat_label" varchar,
  	"button_type" "enum_pages_blocks_about_company_button_type" DEFAULT 'reference',
  	"button_new_tab" boolean,
  	"button_url" varchar,
  	"button_label" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "pages_blocks_clients_clients" (
  	"_order" integer NOT NULL,
  	"_parent_id" varchar NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"logo_id" integer,
  	"name" varchar
  );
  
  CREATE TABLE "pages_blocks_clients" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"heading" varchar DEFAULT 'Наши клиенты',
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_features_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"icon" "enum__pages_v_blocks_features_items_icon" DEFAULT 'shieldCheck',
  	"title" varchar,
  	"description" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_features" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_stats_items" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"value" varchar,
  	"label" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_stats" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_solutions_cards" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"title" varchar,
  	"description" varchar,
  	"type" "enum__pages_v_blocks_solutions_cards_type" DEFAULT 'foundation',
  	"link" varchar DEFAULT '#!',
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_solutions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"tagline" varchar DEFAULT 'Готовые системы',
  	"title" varchar DEFAULT 'Комплексные решения',
  	"description" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_about_company_features" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"icon" "enum__pages_v_blocks_about_company_features_icon" DEFAULT 'shield',
  	"title" varchar,
  	"description" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_about_company" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"label" varchar,
  	"title" varchar,
  	"title_highlight" varchar,
  	"description" jsonb,
  	"image_id" integer,
  	"stat_value" varchar,
  	"stat_label" varchar,
  	"button_type" "enum__pages_v_blocks_about_company_button_type" DEFAULT 'reference',
  	"button_new_tab" boolean,
  	"button_url" varchar,
  	"button_label" varchar,
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_clients_clients" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"logo_id" integer,
  	"name" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_pages_v_blocks_clients" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_path" text NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"heading" varchar DEFAULT 'Наши клиенты',
  	"_uuid" varchar,
  	"block_name" varchar
  );
  
  CREATE TABLE "products_gallery" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer
  );
  
  CREATE TABLE "products_documents" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"file_id" integer
  );
  
  CREATE TABLE "products_documents_locales" (
  	"label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "products_specifications" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"attribute_id" integer,
  	"value" varchar
  );
  
  CREATE TABLE "products_filter_values" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar
  );
  
  CREATE TABLE "products" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"hero_image_id" integer,
  	"sku" varchar,
  	"in_stock" boolean DEFAULT true,
  	"published_at" timestamp(3) with time zone,
  	"generate_slug" boolean DEFAULT true,
  	"slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_products_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "products_locales" (
  	"title" varchar,
  	"short_description" varchar,
  	"description" jsonb,
  	"meta_title" varchar,
  	"meta_image_id" integer,
  	"meta_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "products_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"products_id" integer,
  	"product_categories_id" integer
  );
  
  CREATE TABLE "_products_v_version_gallery" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_products_v_version_documents" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"file_id" integer,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_products_v_version_documents_locales" (
  	"label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_products_v_version_specifications" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"attribute_id" integer,
  	"value" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_products_v_version_filter_values" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"value" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_products_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_hero_image_id" integer,
  	"version_sku" varchar,
  	"version_in_stock" boolean DEFAULT true,
  	"version_published_at" timestamp(3) with time zone,
  	"version_generate_slug" boolean DEFAULT true,
  	"version_slug" varchar,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__products_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "enum__products_v_published_locale",
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "_products_v_locales" (
  	"version_title" varchar,
  	"version_short_description" varchar,
  	"version_description" jsonb,
  	"version_meta_title" varchar,
  	"version_meta_image_id" integer,
  	"version_meta_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_products_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"products_id" integer,
  	"product_categories_id" integer
  );
  
  CREATE TABLE "product_categories_breadcrumbs" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"doc_id" integer,
  	"url" varchar,
  	"label" varchar
  );
  
  CREATE TABLE "product_categories" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"published_at" timestamp(3) with time zone,
  	"generate_slug" boolean DEFAULT true,
  	"slug" varchar,
  	"parent_id" integer,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_product_categories_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "product_categories_locales" (
  	"title" varchar,
  	"description" varchar,
  	"meta_title" varchar,
  	"meta_image_id" integer,
  	"meta_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_product_categories_v_version_breadcrumbs" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"doc_id" integer,
  	"url" varchar,
  	"label" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_product_categories_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_image_id" integer,
  	"version_published_at" timestamp(3) with time zone,
  	"version_generate_slug" boolean DEFAULT true,
  	"version_slug" varchar,
  	"version_parent_id" integer,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__product_categories_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "enum__product_categories_v_published_locale",
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "_product_categories_v_locales" (
  	"version_title" varchar,
  	"version_description" varchar,
  	"version_meta_title" varchar,
  	"version_meta_image_id" integer,
  	"version_meta_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "attribute_groups" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" numeric DEFAULT 0,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "attribute_groups_locales" (
  	"name" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "attributes_options" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar
  );
  
  CREATE TABLE "attributes_options_locales" (
  	"label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "attributes" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"slug" varchar NOT NULL,
  	"type" "enum_attributes_type" DEFAULT 'text' NOT NULL,
  	"unit" varchar,
  	"group_id" integer,
  	"filterable" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "attributes_locales" (
  	"name" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "reviews" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"product_id" integer NOT NULL,
  	"author" varchar NOT NULL,
  	"company" varchar,
  	"rating" numeric NOT NULL,
  	"text" varchar NOT NULL,
  	"approved" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  ALTER TABLE "pages_blocks_cta" ADD COLUMN "title" varchar;
  ALTER TABLE "pages_blocks_cta" ADD COLUMN "title_tag" "enum_pages_blocks_cta_title_tag" DEFAULT 'h2';
  ALTER TABLE "_pages_v_blocks_cta" ADD COLUMN "title" varchar;
  ALTER TABLE "_pages_v_blocks_cta" ADD COLUMN "title_tag" "enum__pages_v_blocks_cta_title_tag" DEFAULT 'h2';
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "products_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "product_categories_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "attribute_groups_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "attributes_id" integer;
  ALTER TABLE "payload_locked_documents_rels" ADD COLUMN "reviews_id" integer;
  ALTER TABLE "pages_blocks_features_items" ADD CONSTRAINT "pages_blocks_features_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_features"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_features" ADD CONSTRAINT "pages_blocks_features_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_stats_items" ADD CONSTRAINT "pages_blocks_stats_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_stats"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_stats" ADD CONSTRAINT "pages_blocks_stats_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_solutions_cards" ADD CONSTRAINT "pages_blocks_solutions_cards_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_solutions_cards" ADD CONSTRAINT "pages_blocks_solutions_cards_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_solutions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_solutions" ADD CONSTRAINT "pages_blocks_solutions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_about_company_features" ADD CONSTRAINT "pages_blocks_about_company_features_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_about_company"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_about_company" ADD CONSTRAINT "pages_blocks_about_company_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_about_company" ADD CONSTRAINT "pages_blocks_about_company_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_clients_clients" ADD CONSTRAINT "pages_blocks_clients_clients_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "pages_blocks_clients_clients" ADD CONSTRAINT "pages_blocks_clients_clients_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages_blocks_clients"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "pages_blocks_clients" ADD CONSTRAINT "pages_blocks_clients_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."pages"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_features_items" ADD CONSTRAINT "_pages_v_blocks_features_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_features"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_features" ADD CONSTRAINT "_pages_v_blocks_features_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_stats_items" ADD CONSTRAINT "_pages_v_blocks_stats_items_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_stats"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_stats" ADD CONSTRAINT "_pages_v_blocks_stats_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_solutions_cards" ADD CONSTRAINT "_pages_v_blocks_solutions_cards_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_solutions_cards" ADD CONSTRAINT "_pages_v_blocks_solutions_cards_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_solutions"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_solutions" ADD CONSTRAINT "_pages_v_blocks_solutions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_about_company_features" ADD CONSTRAINT "_pages_v_blocks_about_company_features_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_about_company"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_about_company" ADD CONSTRAINT "_pages_v_blocks_about_company_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_about_company" ADD CONSTRAINT "_pages_v_blocks_about_company_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_clients_clients" ADD CONSTRAINT "_pages_v_blocks_clients_clients_logo_id_media_id_fk" FOREIGN KEY ("logo_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_clients_clients" ADD CONSTRAINT "_pages_v_blocks_clients_clients_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v_blocks_clients"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_pages_v_blocks_clients" ADD CONSTRAINT "_pages_v_blocks_clients_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_pages_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products_gallery" ADD CONSTRAINT "products_gallery_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "products_gallery" ADD CONSTRAINT "products_gallery_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products_documents" ADD CONSTRAINT "products_documents_file_id_media_id_fk" FOREIGN KEY ("file_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "products_documents" ADD CONSTRAINT "products_documents_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products_documents_locales" ADD CONSTRAINT "products_documents_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."products_documents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products_specifications" ADD CONSTRAINT "products_specifications_attribute_id_attributes_id_fk" FOREIGN KEY ("attribute_id") REFERENCES "public"."attributes"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "products_specifications" ADD CONSTRAINT "products_specifications_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products_filter_values" ADD CONSTRAINT "products_filter_values_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products" ADD CONSTRAINT "products_hero_image_id_media_id_fk" FOREIGN KEY ("hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "products_locales" ADD CONSTRAINT "products_locales_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "products_locales" ADD CONSTRAINT "products_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products_rels" ADD CONSTRAINT "products_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products_rels" ADD CONSTRAINT "products_rels_products_fk" FOREIGN KEY ("products_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products_rels" ADD CONSTRAINT "products_rels_product_categories_fk" FOREIGN KEY ("product_categories_id") REFERENCES "public"."product_categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_products_v_version_gallery" ADD CONSTRAINT "_products_v_version_gallery_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_products_v_version_gallery" ADD CONSTRAINT "_products_v_version_gallery_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_products_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_products_v_version_documents" ADD CONSTRAINT "_products_v_version_documents_file_id_media_id_fk" FOREIGN KEY ("file_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_products_v_version_documents" ADD CONSTRAINT "_products_v_version_documents_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_products_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_products_v_version_documents_locales" ADD CONSTRAINT "_products_v_version_documents_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_products_v_version_documents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_products_v_version_specifications" ADD CONSTRAINT "_products_v_version_specifications_attribute_id_attributes_id_fk" FOREIGN KEY ("attribute_id") REFERENCES "public"."attributes"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_products_v_version_specifications" ADD CONSTRAINT "_products_v_version_specifications_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_products_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_products_v_version_filter_values" ADD CONSTRAINT "_products_v_version_filter_values_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_products_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_products_v" ADD CONSTRAINT "_products_v_parent_id_products_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."products"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_products_v" ADD CONSTRAINT "_products_v_version_hero_image_id_media_id_fk" FOREIGN KEY ("version_hero_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_products_v_locales" ADD CONSTRAINT "_products_v_locales_version_meta_image_id_media_id_fk" FOREIGN KEY ("version_meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_products_v_locales" ADD CONSTRAINT "_products_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_products_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_products_v_rels" ADD CONSTRAINT "_products_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_products_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_products_v_rels" ADD CONSTRAINT "_products_v_rels_products_fk" FOREIGN KEY ("products_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_products_v_rels" ADD CONSTRAINT "_products_v_rels_product_categories_fk" FOREIGN KEY ("product_categories_id") REFERENCES "public"."product_categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "product_categories_breadcrumbs" ADD CONSTRAINT "product_categories_breadcrumbs_doc_id_product_categories_id_fk" FOREIGN KEY ("doc_id") REFERENCES "public"."product_categories"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "product_categories_breadcrumbs" ADD CONSTRAINT "product_categories_breadcrumbs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."product_categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "product_categories" ADD CONSTRAINT "product_categories_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "product_categories" ADD CONSTRAINT "product_categories_parent_id_product_categories_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."product_categories"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "product_categories_locales" ADD CONSTRAINT "product_categories_locales_meta_image_id_media_id_fk" FOREIGN KEY ("meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "product_categories_locales" ADD CONSTRAINT "product_categories_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."product_categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_product_categories_v_version_breadcrumbs" ADD CONSTRAINT "_product_categories_v_version_breadcrumbs_doc_id_product_categories_id_fk" FOREIGN KEY ("doc_id") REFERENCES "public"."product_categories"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_product_categories_v_version_breadcrumbs" ADD CONSTRAINT "_product_categories_v_version_breadcrumbs_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_product_categories_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_product_categories_v" ADD CONSTRAINT "_product_categories_v_parent_id_product_categories_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."product_categories"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_product_categories_v" ADD CONSTRAINT "_product_categories_v_version_image_id_media_id_fk" FOREIGN KEY ("version_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_product_categories_v" ADD CONSTRAINT "_product_categories_v_version_parent_id_product_categories_id_fk" FOREIGN KEY ("version_parent_id") REFERENCES "public"."product_categories"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_product_categories_v_locales" ADD CONSTRAINT "_product_categories_v_locales_version_meta_image_id_media_id_fk" FOREIGN KEY ("version_meta_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_product_categories_v_locales" ADD CONSTRAINT "_product_categories_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_product_categories_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "attribute_groups_locales" ADD CONSTRAINT "attribute_groups_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."attribute_groups"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "attributes_options" ADD CONSTRAINT "attributes_options_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."attributes"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "attributes_options_locales" ADD CONSTRAINT "attributes_options_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."attributes_options"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "attributes" ADD CONSTRAINT "attributes_group_id_attribute_groups_id_fk" FOREIGN KEY ("group_id") REFERENCES "public"."attribute_groups"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "attributes_locales" ADD CONSTRAINT "attributes_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."attributes"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "reviews" ADD CONSTRAINT "reviews_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE set null ON UPDATE no action;
  CREATE INDEX "pages_blocks_features_items_order_idx" ON "pages_blocks_features_items" USING btree ("_order");
  CREATE INDEX "pages_blocks_features_items_parent_id_idx" ON "pages_blocks_features_items" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_features_items_locale_idx" ON "pages_blocks_features_items" USING btree ("_locale");
  CREATE INDEX "pages_blocks_features_order_idx" ON "pages_blocks_features" USING btree ("_order");
  CREATE INDEX "pages_blocks_features_parent_id_idx" ON "pages_blocks_features" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_features_path_idx" ON "pages_blocks_features" USING btree ("_path");
  CREATE INDEX "pages_blocks_features_locale_idx" ON "pages_blocks_features" USING btree ("_locale");
  CREATE INDEX "pages_blocks_stats_items_order_idx" ON "pages_blocks_stats_items" USING btree ("_order");
  CREATE INDEX "pages_blocks_stats_items_parent_id_idx" ON "pages_blocks_stats_items" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_stats_items_locale_idx" ON "pages_blocks_stats_items" USING btree ("_locale");
  CREATE INDEX "pages_blocks_stats_order_idx" ON "pages_blocks_stats" USING btree ("_order");
  CREATE INDEX "pages_blocks_stats_parent_id_idx" ON "pages_blocks_stats" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_stats_path_idx" ON "pages_blocks_stats" USING btree ("_path");
  CREATE INDEX "pages_blocks_stats_locale_idx" ON "pages_blocks_stats" USING btree ("_locale");
  CREATE INDEX "pages_blocks_solutions_cards_order_idx" ON "pages_blocks_solutions_cards" USING btree ("_order");
  CREATE INDEX "pages_blocks_solutions_cards_parent_id_idx" ON "pages_blocks_solutions_cards" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_solutions_cards_locale_idx" ON "pages_blocks_solutions_cards" USING btree ("_locale");
  CREATE INDEX "pages_blocks_solutions_cards_image_idx" ON "pages_blocks_solutions_cards" USING btree ("image_id");
  CREATE INDEX "pages_blocks_solutions_order_idx" ON "pages_blocks_solutions" USING btree ("_order");
  CREATE INDEX "pages_blocks_solutions_parent_id_idx" ON "pages_blocks_solutions" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_solutions_path_idx" ON "pages_blocks_solutions" USING btree ("_path");
  CREATE INDEX "pages_blocks_solutions_locale_idx" ON "pages_blocks_solutions" USING btree ("_locale");
  CREATE INDEX "pages_blocks_about_company_features_order_idx" ON "pages_blocks_about_company_features" USING btree ("_order");
  CREATE INDEX "pages_blocks_about_company_features_parent_id_idx" ON "pages_blocks_about_company_features" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_about_company_features_locale_idx" ON "pages_blocks_about_company_features" USING btree ("_locale");
  CREATE INDEX "pages_blocks_about_company_order_idx" ON "pages_blocks_about_company" USING btree ("_order");
  CREATE INDEX "pages_blocks_about_company_parent_id_idx" ON "pages_blocks_about_company" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_about_company_path_idx" ON "pages_blocks_about_company" USING btree ("_path");
  CREATE INDEX "pages_blocks_about_company_locale_idx" ON "pages_blocks_about_company" USING btree ("_locale");
  CREATE INDEX "pages_blocks_about_company_image_idx" ON "pages_blocks_about_company" USING btree ("image_id");
  CREATE INDEX "pages_blocks_clients_clients_order_idx" ON "pages_blocks_clients_clients" USING btree ("_order");
  CREATE INDEX "pages_blocks_clients_clients_parent_id_idx" ON "pages_blocks_clients_clients" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_clients_clients_locale_idx" ON "pages_blocks_clients_clients" USING btree ("_locale");
  CREATE INDEX "pages_blocks_clients_clients_logo_idx" ON "pages_blocks_clients_clients" USING btree ("logo_id");
  CREATE INDEX "pages_blocks_clients_order_idx" ON "pages_blocks_clients" USING btree ("_order");
  CREATE INDEX "pages_blocks_clients_parent_id_idx" ON "pages_blocks_clients" USING btree ("_parent_id");
  CREATE INDEX "pages_blocks_clients_path_idx" ON "pages_blocks_clients" USING btree ("_path");
  CREATE INDEX "pages_blocks_clients_locale_idx" ON "pages_blocks_clients" USING btree ("_locale");
  CREATE INDEX "_pages_v_blocks_features_items_order_idx" ON "_pages_v_blocks_features_items" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_features_items_parent_id_idx" ON "_pages_v_blocks_features_items" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_features_items_locale_idx" ON "_pages_v_blocks_features_items" USING btree ("_locale");
  CREATE INDEX "_pages_v_blocks_features_order_idx" ON "_pages_v_blocks_features" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_features_parent_id_idx" ON "_pages_v_blocks_features" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_features_path_idx" ON "_pages_v_blocks_features" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_features_locale_idx" ON "_pages_v_blocks_features" USING btree ("_locale");
  CREATE INDEX "_pages_v_blocks_stats_items_order_idx" ON "_pages_v_blocks_stats_items" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_stats_items_parent_id_idx" ON "_pages_v_blocks_stats_items" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_stats_items_locale_idx" ON "_pages_v_blocks_stats_items" USING btree ("_locale");
  CREATE INDEX "_pages_v_blocks_stats_order_idx" ON "_pages_v_blocks_stats" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_stats_parent_id_idx" ON "_pages_v_blocks_stats" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_stats_path_idx" ON "_pages_v_blocks_stats" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_stats_locale_idx" ON "_pages_v_blocks_stats" USING btree ("_locale");
  CREATE INDEX "_pages_v_blocks_solutions_cards_order_idx" ON "_pages_v_blocks_solutions_cards" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_solutions_cards_parent_id_idx" ON "_pages_v_blocks_solutions_cards" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_solutions_cards_locale_idx" ON "_pages_v_blocks_solutions_cards" USING btree ("_locale");
  CREATE INDEX "_pages_v_blocks_solutions_cards_image_idx" ON "_pages_v_blocks_solutions_cards" USING btree ("image_id");
  CREATE INDEX "_pages_v_blocks_solutions_order_idx" ON "_pages_v_blocks_solutions" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_solutions_parent_id_idx" ON "_pages_v_blocks_solutions" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_solutions_path_idx" ON "_pages_v_blocks_solutions" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_solutions_locale_idx" ON "_pages_v_blocks_solutions" USING btree ("_locale");
  CREATE INDEX "_pages_v_blocks_about_company_features_order_idx" ON "_pages_v_blocks_about_company_features" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_about_company_features_parent_id_idx" ON "_pages_v_blocks_about_company_features" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_about_company_features_locale_idx" ON "_pages_v_blocks_about_company_features" USING btree ("_locale");
  CREATE INDEX "_pages_v_blocks_about_company_order_idx" ON "_pages_v_blocks_about_company" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_about_company_parent_id_idx" ON "_pages_v_blocks_about_company" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_about_company_path_idx" ON "_pages_v_blocks_about_company" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_about_company_locale_idx" ON "_pages_v_blocks_about_company" USING btree ("_locale");
  CREATE INDEX "_pages_v_blocks_about_company_image_idx" ON "_pages_v_blocks_about_company" USING btree ("image_id");
  CREATE INDEX "_pages_v_blocks_clients_clients_order_idx" ON "_pages_v_blocks_clients_clients" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_clients_clients_parent_id_idx" ON "_pages_v_blocks_clients_clients" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_clients_clients_locale_idx" ON "_pages_v_blocks_clients_clients" USING btree ("_locale");
  CREATE INDEX "_pages_v_blocks_clients_clients_logo_idx" ON "_pages_v_blocks_clients_clients" USING btree ("logo_id");
  CREATE INDEX "_pages_v_blocks_clients_order_idx" ON "_pages_v_blocks_clients" USING btree ("_order");
  CREATE INDEX "_pages_v_blocks_clients_parent_id_idx" ON "_pages_v_blocks_clients" USING btree ("_parent_id");
  CREATE INDEX "_pages_v_blocks_clients_path_idx" ON "_pages_v_blocks_clients" USING btree ("_path");
  CREATE INDEX "_pages_v_blocks_clients_locale_idx" ON "_pages_v_blocks_clients" USING btree ("_locale");
  CREATE INDEX "products_gallery_order_idx" ON "products_gallery" USING btree ("_order");
  CREATE INDEX "products_gallery_parent_id_idx" ON "products_gallery" USING btree ("_parent_id");
  CREATE INDEX "products_gallery_image_idx" ON "products_gallery" USING btree ("image_id");
  CREATE INDEX "products_documents_order_idx" ON "products_documents" USING btree ("_order");
  CREATE INDEX "products_documents_parent_id_idx" ON "products_documents" USING btree ("_parent_id");
  CREATE INDEX "products_documents_file_idx" ON "products_documents" USING btree ("file_id");
  CREATE UNIQUE INDEX "products_documents_locales_locale_parent_id_unique" ON "products_documents_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "products_specifications_order_idx" ON "products_specifications" USING btree ("_order");
  CREATE INDEX "products_specifications_parent_id_idx" ON "products_specifications" USING btree ("_parent_id");
  CREATE INDEX "products_specifications_attribute_idx" ON "products_specifications" USING btree ("attribute_id");
  CREATE INDEX "products_filter_values_order_idx" ON "products_filter_values" USING btree ("_order");
  CREATE INDEX "products_filter_values_parent_id_idx" ON "products_filter_values" USING btree ("_parent_id");
  CREATE INDEX "products_hero_image_idx" ON "products" USING btree ("hero_image_id");
  CREATE UNIQUE INDEX "products_sku_idx" ON "products" USING btree ("sku");
  CREATE UNIQUE INDEX "products_slug_idx" ON "products" USING btree ("slug");
  CREATE INDEX "products_updated_at_idx" ON "products" USING btree ("updated_at");
  CREATE INDEX "products_created_at_idx" ON "products" USING btree ("created_at");
  CREATE INDEX "products__status_idx" ON "products" USING btree ("_status");
  CREATE INDEX "products_meta_meta_image_idx" ON "products_locales" USING btree ("meta_image_id","_locale");
  CREATE UNIQUE INDEX "products_locales_locale_parent_id_unique" ON "products_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "products_rels_order_idx" ON "products_rels" USING btree ("order");
  CREATE INDEX "products_rels_parent_idx" ON "products_rels" USING btree ("parent_id");
  CREATE INDEX "products_rels_path_idx" ON "products_rels" USING btree ("path");
  CREATE INDEX "products_rels_products_id_idx" ON "products_rels" USING btree ("products_id");
  CREATE INDEX "products_rels_product_categories_id_idx" ON "products_rels" USING btree ("product_categories_id");
  CREATE INDEX "_products_v_version_gallery_order_idx" ON "_products_v_version_gallery" USING btree ("_order");
  CREATE INDEX "_products_v_version_gallery_parent_id_idx" ON "_products_v_version_gallery" USING btree ("_parent_id");
  CREATE INDEX "_products_v_version_gallery_image_idx" ON "_products_v_version_gallery" USING btree ("image_id");
  CREATE INDEX "_products_v_version_documents_order_idx" ON "_products_v_version_documents" USING btree ("_order");
  CREATE INDEX "_products_v_version_documents_parent_id_idx" ON "_products_v_version_documents" USING btree ("_parent_id");
  CREATE INDEX "_products_v_version_documents_file_idx" ON "_products_v_version_documents" USING btree ("file_id");
  CREATE UNIQUE INDEX "_products_v_version_documents_locales_locale_parent_id_uniqu" ON "_products_v_version_documents_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_products_v_version_specifications_order_idx" ON "_products_v_version_specifications" USING btree ("_order");
  CREATE INDEX "_products_v_version_specifications_parent_id_idx" ON "_products_v_version_specifications" USING btree ("_parent_id");
  CREATE INDEX "_products_v_version_specifications_attribute_idx" ON "_products_v_version_specifications" USING btree ("attribute_id");
  CREATE INDEX "_products_v_version_filter_values_order_idx" ON "_products_v_version_filter_values" USING btree ("_order");
  CREATE INDEX "_products_v_version_filter_values_parent_id_idx" ON "_products_v_version_filter_values" USING btree ("_parent_id");
  CREATE INDEX "_products_v_parent_idx" ON "_products_v" USING btree ("parent_id");
  CREATE INDEX "_products_v_version_version_hero_image_idx" ON "_products_v" USING btree ("version_hero_image_id");
  CREATE INDEX "_products_v_version_version_sku_idx" ON "_products_v" USING btree ("version_sku");
  CREATE INDEX "_products_v_version_version_slug_idx" ON "_products_v" USING btree ("version_slug");
  CREATE INDEX "_products_v_version_version_updated_at_idx" ON "_products_v" USING btree ("version_updated_at");
  CREATE INDEX "_products_v_version_version_created_at_idx" ON "_products_v" USING btree ("version_created_at");
  CREATE INDEX "_products_v_version_version__status_idx" ON "_products_v" USING btree ("version__status");
  CREATE INDEX "_products_v_created_at_idx" ON "_products_v" USING btree ("created_at");
  CREATE INDEX "_products_v_updated_at_idx" ON "_products_v" USING btree ("updated_at");
  CREATE INDEX "_products_v_snapshot_idx" ON "_products_v" USING btree ("snapshot");
  CREATE INDEX "_products_v_published_locale_idx" ON "_products_v" USING btree ("published_locale");
  CREATE INDEX "_products_v_latest_idx" ON "_products_v" USING btree ("latest");
  CREATE INDEX "_products_v_autosave_idx" ON "_products_v" USING btree ("autosave");
  CREATE INDEX "_products_v_version_meta_version_meta_image_idx" ON "_products_v_locales" USING btree ("version_meta_image_id","_locale");
  CREATE UNIQUE INDEX "_products_v_locales_locale_parent_id_unique" ON "_products_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_products_v_rels_order_idx" ON "_products_v_rels" USING btree ("order");
  CREATE INDEX "_products_v_rels_parent_idx" ON "_products_v_rels" USING btree ("parent_id");
  CREATE INDEX "_products_v_rels_path_idx" ON "_products_v_rels" USING btree ("path");
  CREATE INDEX "_products_v_rels_products_id_idx" ON "_products_v_rels" USING btree ("products_id");
  CREATE INDEX "_products_v_rels_product_categories_id_idx" ON "_products_v_rels" USING btree ("product_categories_id");
  CREATE INDEX "product_categories_breadcrumbs_order_idx" ON "product_categories_breadcrumbs" USING btree ("_order");
  CREATE INDEX "product_categories_breadcrumbs_parent_id_idx" ON "product_categories_breadcrumbs" USING btree ("_parent_id");
  CREATE INDEX "product_categories_breadcrumbs_locale_idx" ON "product_categories_breadcrumbs" USING btree ("_locale");
  CREATE INDEX "product_categories_breadcrumbs_doc_idx" ON "product_categories_breadcrumbs" USING btree ("doc_id");
  CREATE INDEX "product_categories_image_idx" ON "product_categories" USING btree ("image_id");
  CREATE UNIQUE INDEX "product_categories_slug_idx" ON "product_categories" USING btree ("slug");
  CREATE INDEX "product_categories_parent_idx" ON "product_categories" USING btree ("parent_id");
  CREATE INDEX "product_categories_updated_at_idx" ON "product_categories" USING btree ("updated_at");
  CREATE INDEX "product_categories_created_at_idx" ON "product_categories" USING btree ("created_at");
  CREATE INDEX "product_categories__status_idx" ON "product_categories" USING btree ("_status");
  CREATE INDEX "product_categories_meta_meta_image_idx" ON "product_categories_locales" USING btree ("meta_image_id","_locale");
  CREATE UNIQUE INDEX "product_categories_locales_locale_parent_id_unique" ON "product_categories_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_product_categories_v_version_breadcrumbs_order_idx" ON "_product_categories_v_version_breadcrumbs" USING btree ("_order");
  CREATE INDEX "_product_categories_v_version_breadcrumbs_parent_id_idx" ON "_product_categories_v_version_breadcrumbs" USING btree ("_parent_id");
  CREATE INDEX "_product_categories_v_version_breadcrumbs_locale_idx" ON "_product_categories_v_version_breadcrumbs" USING btree ("_locale");
  CREATE INDEX "_product_categories_v_version_breadcrumbs_doc_idx" ON "_product_categories_v_version_breadcrumbs" USING btree ("doc_id");
  CREATE INDEX "_product_categories_v_parent_idx" ON "_product_categories_v" USING btree ("parent_id");
  CREATE INDEX "_product_categories_v_version_version_image_idx" ON "_product_categories_v" USING btree ("version_image_id");
  CREATE INDEX "_product_categories_v_version_version_slug_idx" ON "_product_categories_v" USING btree ("version_slug");
  CREATE INDEX "_product_categories_v_version_version_parent_idx" ON "_product_categories_v" USING btree ("version_parent_id");
  CREATE INDEX "_product_categories_v_version_version_updated_at_idx" ON "_product_categories_v" USING btree ("version_updated_at");
  CREATE INDEX "_product_categories_v_version_version_created_at_idx" ON "_product_categories_v" USING btree ("version_created_at");
  CREATE INDEX "_product_categories_v_version_version__status_idx" ON "_product_categories_v" USING btree ("version__status");
  CREATE INDEX "_product_categories_v_created_at_idx" ON "_product_categories_v" USING btree ("created_at");
  CREATE INDEX "_product_categories_v_updated_at_idx" ON "_product_categories_v" USING btree ("updated_at");
  CREATE INDEX "_product_categories_v_snapshot_idx" ON "_product_categories_v" USING btree ("snapshot");
  CREATE INDEX "_product_categories_v_published_locale_idx" ON "_product_categories_v" USING btree ("published_locale");
  CREATE INDEX "_product_categories_v_latest_idx" ON "_product_categories_v" USING btree ("latest");
  CREATE INDEX "_product_categories_v_autosave_idx" ON "_product_categories_v" USING btree ("autosave");
  CREATE INDEX "_product_categories_v_version_meta_version_meta_image_idx" ON "_product_categories_v_locales" USING btree ("version_meta_image_id","_locale");
  CREATE UNIQUE INDEX "_product_categories_v_locales_locale_parent_id_unique" ON "_product_categories_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "attribute_groups_updated_at_idx" ON "attribute_groups" USING btree ("updated_at");
  CREATE INDEX "attribute_groups_created_at_idx" ON "attribute_groups" USING btree ("created_at");
  CREATE UNIQUE INDEX "attribute_groups_locales_locale_parent_id_unique" ON "attribute_groups_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "attributes_options_order_idx" ON "attributes_options" USING btree ("_order");
  CREATE INDEX "attributes_options_parent_id_idx" ON "attributes_options" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "attributes_options_locales_locale_parent_id_unique" ON "attributes_options_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "attributes_slug_idx" ON "attributes" USING btree ("slug");
  CREATE INDEX "attributes_group_idx" ON "attributes" USING btree ("group_id");
  CREATE INDEX "attributes_updated_at_idx" ON "attributes" USING btree ("updated_at");
  CREATE INDEX "attributes_created_at_idx" ON "attributes" USING btree ("created_at");
  CREATE UNIQUE INDEX "attributes_locales_locale_parent_id_unique" ON "attributes_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "reviews_product_idx" ON "reviews" USING btree ("product_id");
  CREATE INDEX "reviews_updated_at_idx" ON "reviews" USING btree ("updated_at");
  CREATE INDEX "reviews_created_at_idx" ON "reviews" USING btree ("created_at");
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_products_fk" FOREIGN KEY ("products_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_product_categories_fk" FOREIGN KEY ("product_categories_id") REFERENCES "public"."product_categories"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_attribute_groups_fk" FOREIGN KEY ("attribute_groups_id") REFERENCES "public"."attribute_groups"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_attributes_fk" FOREIGN KEY ("attributes_id") REFERENCES "public"."attributes"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_reviews_fk" FOREIGN KEY ("reviews_id") REFERENCES "public"."reviews"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "payload_locked_documents_rels_products_id_idx" ON "payload_locked_documents_rels" USING btree ("products_id");
  CREATE INDEX "payload_locked_documents_rels_product_categories_id_idx" ON "payload_locked_documents_rels" USING btree ("product_categories_id");
  CREATE INDEX "payload_locked_documents_rels_attribute_groups_id_idx" ON "payload_locked_documents_rels" USING btree ("attribute_groups_id");
  CREATE INDEX "payload_locked_documents_rels_attributes_id_idx" ON "payload_locked_documents_rels" USING btree ("attributes_id");
  CREATE INDEX "payload_locked_documents_rels_reviews_id_idx" ON "payload_locked_documents_rels" USING btree ("reviews_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "pages_blocks_features_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_features" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_stats_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_stats" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_solutions_cards" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_solutions" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_about_company_features" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_about_company" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_clients_clients" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "pages_blocks_clients" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_features_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_features" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_stats_items" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_stats" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_solutions_cards" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_solutions" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_about_company_features" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_about_company" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_clients_clients" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_pages_v_blocks_clients" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "products_gallery" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "products_documents" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "products_documents_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "products_specifications" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "products_filter_values" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "products" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "products_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "products_rels" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_products_v_version_gallery" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_products_v_version_documents" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_products_v_version_documents_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_products_v_version_specifications" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_products_v_version_filter_values" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_products_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_products_v_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_products_v_rels" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "product_categories_breadcrumbs" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "product_categories" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "product_categories_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_product_categories_v_version_breadcrumbs" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_product_categories_v" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "_product_categories_v_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "attribute_groups" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "attribute_groups_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "attributes_options" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "attributes_options_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "attributes" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "attributes_locales" DISABLE ROW LEVEL SECURITY;
  ALTER TABLE "reviews" DISABLE ROW LEVEL SECURITY;
  DROP TABLE "pages_blocks_features_items" CASCADE;
  DROP TABLE "pages_blocks_features" CASCADE;
  DROP TABLE "pages_blocks_stats_items" CASCADE;
  DROP TABLE "pages_blocks_stats" CASCADE;
  DROP TABLE "pages_blocks_solutions_cards" CASCADE;
  DROP TABLE "pages_blocks_solutions" CASCADE;
  DROP TABLE "pages_blocks_about_company_features" CASCADE;
  DROP TABLE "pages_blocks_about_company" CASCADE;
  DROP TABLE "pages_blocks_clients_clients" CASCADE;
  DROP TABLE "pages_blocks_clients" CASCADE;
  DROP TABLE "_pages_v_blocks_features_items" CASCADE;
  DROP TABLE "_pages_v_blocks_features" CASCADE;
  DROP TABLE "_pages_v_blocks_stats_items" CASCADE;
  DROP TABLE "_pages_v_blocks_stats" CASCADE;
  DROP TABLE "_pages_v_blocks_solutions_cards" CASCADE;
  DROP TABLE "_pages_v_blocks_solutions" CASCADE;
  DROP TABLE "_pages_v_blocks_about_company_features" CASCADE;
  DROP TABLE "_pages_v_blocks_about_company" CASCADE;
  DROP TABLE "_pages_v_blocks_clients_clients" CASCADE;
  DROP TABLE "_pages_v_blocks_clients" CASCADE;
  DROP TABLE "products_gallery" CASCADE;
  DROP TABLE "products_documents" CASCADE;
  DROP TABLE "products_documents_locales" CASCADE;
  DROP TABLE "products_specifications" CASCADE;
  DROP TABLE "products_filter_values" CASCADE;
  DROP TABLE "products" CASCADE;
  DROP TABLE "products_locales" CASCADE;
  DROP TABLE "products_rels" CASCADE;
  DROP TABLE "_products_v_version_gallery" CASCADE;
  DROP TABLE "_products_v_version_documents" CASCADE;
  DROP TABLE "_products_v_version_documents_locales" CASCADE;
  DROP TABLE "_products_v_version_specifications" CASCADE;
  DROP TABLE "_products_v_version_filter_values" CASCADE;
  DROP TABLE "_products_v" CASCADE;
  DROP TABLE "_products_v_locales" CASCADE;
  DROP TABLE "_products_v_rels" CASCADE;
  DROP TABLE "product_categories_breadcrumbs" CASCADE;
  DROP TABLE "product_categories" CASCADE;
  DROP TABLE "product_categories_locales" CASCADE;
  DROP TABLE "_product_categories_v_version_breadcrumbs" CASCADE;
  DROP TABLE "_product_categories_v" CASCADE;
  DROP TABLE "_product_categories_v_locales" CASCADE;
  DROP TABLE "attribute_groups" CASCADE;
  DROP TABLE "attribute_groups_locales" CASCADE;
  DROP TABLE "attributes_options" CASCADE;
  DROP TABLE "attributes_options_locales" CASCADE;
  DROP TABLE "attributes" CASCADE;
  DROP TABLE "attributes_locales" CASCADE;
  DROP TABLE "reviews" CASCADE;
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_products_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_product_categories_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_attribute_groups_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_attributes_fk";
  
  ALTER TABLE "payload_locked_documents_rels" DROP CONSTRAINT "payload_locked_documents_rels_reviews_fk";
  
  DROP INDEX "payload_locked_documents_rels_products_id_idx";
  DROP INDEX "payload_locked_documents_rels_product_categories_id_idx";
  DROP INDEX "payload_locked_documents_rels_attribute_groups_id_idx";
  DROP INDEX "payload_locked_documents_rels_attributes_id_idx";
  DROP INDEX "payload_locked_documents_rels_reviews_id_idx";
  ALTER TABLE "pages_blocks_cta" DROP COLUMN "title";
  ALTER TABLE "pages_blocks_cta" DROP COLUMN "title_tag";
  ALTER TABLE "_pages_v_blocks_cta" DROP COLUMN "title";
  ALTER TABLE "_pages_v_blocks_cta" DROP COLUMN "title_tag";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "products_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "product_categories_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "attribute_groups_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "attributes_id";
  ALTER TABLE "payload_locked_documents_rels" DROP COLUMN "reviews_id";
  DROP TYPE "public"."enum_pages_blocks_cta_title_tag";
  DROP TYPE "public"."enum_pages_blocks_features_items_icon";
  DROP TYPE "public"."enum_pages_blocks_solutions_cards_type";
  DROP TYPE "public"."enum_pages_blocks_about_company_features_icon";
  DROP TYPE "public"."enum_pages_blocks_about_company_button_type";
  DROP TYPE "public"."enum__pages_v_blocks_cta_title_tag";
  DROP TYPE "public"."enum__pages_v_blocks_features_items_icon";
  DROP TYPE "public"."enum__pages_v_blocks_solutions_cards_type";
  DROP TYPE "public"."enum__pages_v_blocks_about_company_features_icon";
  DROP TYPE "public"."enum__pages_v_blocks_about_company_button_type";
  DROP TYPE "public"."enum_products_status";
  DROP TYPE "public"."enum__products_v_version_status";
  DROP TYPE "public"."enum__products_v_published_locale";
  DROP TYPE "public"."enum_product_categories_status";
  DROP TYPE "public"."enum__product_categories_v_version_status";
  DROP TYPE "public"."enum__product_categories_v_published_locale";
  DROP TYPE "public"."enum_attributes_type";`)
}
