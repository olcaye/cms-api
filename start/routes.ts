/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer'
|
*/

import Route from '@ioc:Adonis/Core/Route'

Route.get('/', async () => {
  return { hello: 'world' }
})


// /api group
Route.group(() => {

  // Main group for /api/customer/
  Route.group(() => {

    // group for /api/customer/ with auth
    Route.group(() => {
        Route.get('/', 'CustomersController.index')
        Route.get('/:id/', 'CustomersController.show')
        Route.get('/:id/delete', 'CustomersController.delete')
    }).middleware('auth')

      // group for /api/customer/ without auth
    Route.group(() => {
        Route.post('/register', 'CustomersController.store');
        Route.post('/login', 'CustomersController.login');
    })


  }).prefix('/customers')


  // Main group for /api/client/
  Route.group(() => {


    // group for /api/client/ without auth
    Route.group(() => {
      Route.get('/', 'UsersController.index');
      Route.get('/delete', 'UsersController.delete');
      Route.post('/update', 'UsersController.update');
      Route.get('/logout', 'UsersController.logout');
    }).middleware('auth');

    // group for /api/client/ with auth
    Route.group(() => {
        Route.post('/register', 'UsersController.store');
        Route.post('/login', 'UsersController.login');
    })

   
  }).prefix('/client')


}).prefix('/api/')
