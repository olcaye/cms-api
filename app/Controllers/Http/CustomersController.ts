import type { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import User from 'App/Models/User';



export default class CustomersController {
    public async index({response, auth}: HttpContextContract) {
        const client = await User.find(auth.use('api').user!.id)
        const customers = await client?.related('customers').query()
        return response.json({ data: customers })
    }

    public async show({response, auth, params}: HttpContextContract) {
        const client = await User.find(auth.use('api').user!.id)
        const customer = await client?.related('customers').query().where('id', params.id)
        return response.json({ data: customer })
    }

    public async delete({response, auth, params}: HttpContextContract) {
        try {
            const client = await User.find(auth.use('api').user!.id)
            const affectedRows = await client?.related('customers').query().where('id', params.id).delete();
            if(affectedRows![0] > 0) {
                return response.json({'status' : true })
            } else {
                return response.json({'status' : 'No Affected Rows' })
            }
            
        
        } catch (error){
            return response.json({'status' : false})
        }
    }


}
