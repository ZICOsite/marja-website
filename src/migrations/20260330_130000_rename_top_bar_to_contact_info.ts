import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
  // Migration 20260330_115004 already created contact_info_* and dropped top_bar_* tables.
  // On a fresh database those tables won't exist, so this rename becomes a no-op.
  const check = await db.execute(sql`
    SELECT EXISTS (
      SELECT 1 FROM information_schema.tables
      WHERE table_schema = 'public' AND table_name = 'top_bar'
    ) AS "exists"
  `)
  // @ts-ignore
  if (!check.rows[0]?.exists) return

  await db.execute(sql`
   ALTER TABLE "top_bar_addresses_locales" DROP CONSTRAINT "top_bar_addresses_locales_parent_id_fk";
  ALTER TABLE "top_bar_phones" DROP CONSTRAINT "top_bar_phones_parent_id_fk";
  ALTER TABLE "top_bar_addresses" DROP CONSTRAINT "top_bar_addresses_parent_id_fk";

  DROP INDEX "top_bar_phones_order_idx";
  DROP INDEX "top_bar_phones_parent_id_idx";
  DROP INDEX "top_bar_addresses_order_idx";
  DROP INDEX "top_bar_addresses_parent_id_idx";
  DROP INDEX "top_bar_addresses_locales_locale_parent_id_unique";

  ALTER TABLE "top_bar" RENAME TO "contact_info";
  ALTER TABLE "top_bar_phones" RENAME TO "contact_info_phones";
  ALTER TABLE "top_bar_addresses" RENAME TO "contact_info_addresses";
  ALTER TABLE "top_bar_addresses_locales" RENAME TO "contact_info_addresses_locales";

  ALTER TABLE "contact_info_phones" ADD CONSTRAINT "contact_info_phones_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."contact_info"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "contact_info_addresses" ADD CONSTRAINT "contact_info_addresses_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."contact_info"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "contact_info_addresses_locales" ADD CONSTRAINT "contact_info_addresses_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."contact_info_addresses"("id") ON DELETE cascade ON UPDATE no action;

  CREATE INDEX "contact_info_phones_order_idx" ON "contact_info_phones" USING btree ("_order");
  CREATE INDEX "contact_info_phones_parent_id_idx" ON "contact_info_phones" USING btree ("_parent_id");
  CREATE INDEX "contact_info_addresses_order_idx" ON "contact_info_addresses" USING btree ("_order");
  CREATE INDEX "contact_info_addresses_parent_id_idx" ON "contact_info_addresses" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "contact_info_addresses_locales_locale_parent_id_unique" ON "contact_info_addresses_locales" USING btree ("_locale","_parent_id");`)
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   ALTER TABLE "contact_info_addresses_locales" DROP CONSTRAINT "contact_info_addresses_locales_parent_id_fk";
  ALTER TABLE "contact_info_phones" DROP CONSTRAINT "contact_info_phones_parent_id_fk";
  ALTER TABLE "contact_info_addresses" DROP CONSTRAINT "contact_info_addresses_parent_id_fk";

  DROP INDEX "contact_info_phones_order_idx";
  DROP INDEX "contact_info_phones_parent_id_idx";
  DROP INDEX "contact_info_addresses_order_idx";
  DROP INDEX "contact_info_addresses_parent_id_idx";
  DROP INDEX "contact_info_addresses_locales_locale_parent_id_unique";

  ALTER TABLE "contact_info" RENAME TO "top_bar";
  ALTER TABLE "contact_info_phones" RENAME TO "top_bar_phones";
  ALTER TABLE "contact_info_addresses" RENAME TO "top_bar_addresses";
  ALTER TABLE "contact_info_addresses_locales" RENAME TO "top_bar_addresses_locales";

  ALTER TABLE "top_bar_phones" ADD CONSTRAINT "top_bar_phones_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."top_bar"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "top_bar_addresses" ADD CONSTRAINT "top_bar_addresses_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."top_bar"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "top_bar_addresses_locales" ADD CONSTRAINT "top_bar_addresses_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."top_bar_addresses"("id") ON DELETE cascade ON UPDATE no action;

  CREATE INDEX "top_bar_phones_order_idx" ON "top_bar_phones" USING btree ("_order");
  CREATE INDEX "top_bar_phones_parent_id_idx" ON "top_bar_phones" USING btree ("_parent_id");
  CREATE INDEX "top_bar_addresses_order_idx" ON "top_bar_addresses" USING btree ("_order");
  CREATE INDEX "top_bar_addresses_parent_id_idx" ON "top_bar_addresses" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "top_bar_addresses_locales_locale_parent_id_unique" ON "top_bar_addresses_locales" USING btree ("_locale","_parent_id");`)
}
