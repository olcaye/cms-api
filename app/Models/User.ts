import Customer from 'App/Models/Customer'

import {
  column,
  BaseModel,
  hasMany,
  HasMany,
  beforeSave
} from '@ioc:Adonis/Lucid/Orm'

import { DateTime } from 'luxon'
import Hash from '@ioc:Adonis/Core/Hash'


export default class User extends BaseModel {
  @hasMany(() => Customer, {
    foreignKey: 'clientId', 
  })
  public customers: HasMany<typeof Customer>
  
  @column({ isPrimary: true })
  public id: number

  @column()
  public full_name: string

  @column()
  public email: string

  @column({ serializeAs: null })
  public password: string

  @column()
  public is_deleted: boolean

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @beforeSave()
  public static async hashPassword(user: User) {
    if(user.$dirty.password) {
      user.password = await Hash.make(user.password);
    }
  }

}
