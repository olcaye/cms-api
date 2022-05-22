import { DateTime } from 'luxon'
import Hash from '@ioc:Adonis/Core/Hash'
import { beforeSave, belongsTo,  BelongsTo  } from '@ioc:Adonis/Lucid/Orm'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'
import User from 'App/Models/User'

export default class Customer extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column({ columnName: 'clientId' })
  public clientId: number

  @belongsTo(() => User)
  public client: BelongsTo<typeof User>

  @column()
  public full_name: string

  @column({ isPrimary: true })
  public email: string

  @column({ serializeAs: null })
  public password: string

  @column.dateTime({ autoCreate: false })
  public birth_date: DateTime

  @column()
  public is_deleted: boolean

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @beforeSave()
  public static async hassPassword(customer: Customer) {
    if(customer.$dirty.password) {
      customer.password = await Hash.make(customer.password);
    }
  }
}