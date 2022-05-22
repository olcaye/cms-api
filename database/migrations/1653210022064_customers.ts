import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Customers extends BaseSchema {
  protected tableName = 'customers'

  public async up () {
    this.schema.createTable(this.tableName, (table) => {
      table.increments('id')
      table.integer('clientId').unsigned().notNullable().references('id').inTable('users').onDelete('cascade');
      table.string('full_name',180).nullable()
      table.string('email', 255).unique().notNullable()
      table.string('password', 180).notNullable()
      table.date('birth_date').nullable()
      table.boolean('is_deleted').nullable().defaultTo(false)
      

      /**
       * Uses timestamptz for PostgreSQL and DATETIME2 for MSSQL
       */
      table.timestamp('created_at', { useTz: true })
      table.timestamp('updated_at', { useTz: true })
    })
  }

  public async down () {
    this.schema.dropTable(this.tableName)
  }
}
