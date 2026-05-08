import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db }: MigrateUpArgs): Promise<void> {
    // Migration code
}

export async function down({ db }: MigrateDownArgs): Promise<void> {
    // Migration code
}
