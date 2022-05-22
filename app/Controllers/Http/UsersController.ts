import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User';
import { schema,rules } from '@ioc:Adonis/Core/Validator'
import { DateTime } from 'luxon'
import Hash from '@ioc:Adonis/Core/Hash'

export default class UsersController {
    public async index({response, auth}: HttpContextContract) {
            return response.json
            (
                {
                    data: await User.find(auth.use('api').user!.id) 
                }
            )
     }


    // register new client
    public async store({request,response}: HttpContextContract) {
        const newUserSchema = schema.create({
           full_name: schema.string({ trim: true, escape: true }, [
            rules.alpha({allow: ['space']}),
            rules.minLength(6) 
          ]),
          email: schema.string({ trim: true, escape: true }, [
            rules.unique({ table: 'users', column: 'email' }),
            rules.email()
          ]),
          password: schema.string({ trim: true }, [
              rules.confirmed(),
              rules.minLength(6),
              rules.notIn(['123456'])
            ])
        })
  
          const payload = await request.validate({ 
            schema : newUserSchema,
            messages:  {
              required: 'The {{ field }} is required to create a new account',
              'email.unique': 'This email is already in use.',
              'minLength': 'This area must be longer than {{ options.minLength }} characters',
              },
          
          })
            const user = await User.create(payload);
            return response.created(user) 
    }

    // login for client
    public async login({request,response, auth}: HttpContextContract) {
            
            const newUserSchema = schema.create({
                email: schema.string({ trim: true, escape: true }, [
                   rules.required(),
                   rules.email()
                ]),
                password: schema.string({ trim: true }, [
                    rules.minLength(6),
                  ])
              })
     
              const payload = await request.validate({ 
                 schema : newUserSchema,
                 messages:  {
                   'email.required': 'This email field can not be empty.',
                   'minLength': 'This area must be longer than {{ options.minLength }} characters',
                   },
               })
     

              try {
                 const data = await auth.use('api').attempt(payload.email, payload.password, {
                   expiresIn: '6h',
                 })
                 
                 data['id'] = auth.use('api').user!.id;
                 return response.send(data);
     
               } catch {
                
                 return response.badRequest('Invalid credentials')
               }
    }

    public async logout({response, auth}: HttpContextContract) {

        try {
            await auth.use('api').revoke()
            return { revoked: true}  
        } catch (error){
            return response.json({'status' : false})
        }
    }


    public async delete({response, auth}: HttpContextContract) {

        try {
            const user = await User.findOrFail(auth.use('api').user!.id)
            await user.delete()
            return response.json({'status' : true})
        } catch (error){
            return response.json({'status' : false})
        }
    }

    public async update({response, auth, request}: HttpContextContract) {
        const user = await User.findOrFail(auth.use('api').user!.id)
        user.updatedAt = DateTime.local();
        user.full_name = request.input('full_name');

        const updateUserSchema = schema.create({
            full_name: schema.string({ trim: true, escape: true }, [
                rules.alpha({allow: ['space']}),
                rules.minLength(6) 
            ]),
            password: schema.string.optional([
                rules.confirmed(),
                rules.minLength(6),
                rules.notIn(['123456']),
                rules.requiredIfExistsAny(['old_password', 'password_confirmation'])
            ]),
            old_password: schema.string.optional([
                rules.minLength(6),
                rules.notIn(['123456']),
                rules.requiredIfExistsAny(['old_password', 'password_confirmation'])
            ])

         })

         await request.validate({ 
            schema : updateUserSchema,
            messages:  {
              'minLength': 'This area must be longer than {{ options.minLength }} characters',
              },
          })
       
        
        if (await Hash.verify(user.password, request.input('old_password'))) {
            if(request.input('old_password') == request.input('password')) {
                return response.json({'status' : 'old and new password are same.'})
            }
            user.password = request.input('password');
        } else {
            return response.json({'status' : 'please check your password.'})
        } 

        try {
            await user.save();
            return response.json({'status' : true})
        } catch (error){
            return response.json({'status' : false})
        }
    }

}
