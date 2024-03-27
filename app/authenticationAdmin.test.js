/**
 * https://www.npmjs.com/package/supertest
 */
const request = require('supertest');
const app     = require('./app');
const mongoose = require('mongoose');

const prova = {
  err1: 'Password wrong. ',
  err2: 'Admin name wrong. ',
};

describe('POST /api/v1/authenticationsAdmin', () => {
  const Admin = require('./models/admin');

  let nameAdmin = {
    admin_email: 'johs@example.com',
    admin_password: 'Provaadmin1'
  };


  let passAdmin = {
    admin_email: 'provaadmin@gmail.com',
    admin_password: 'Ciao Mondo'
  }

  let correctAdmin = {

    admin_email: 'provaadmin@gmail.com',
    admin_password: 'Provaadmin1'

  }

  let connection;

  beforeAll(async () => {
    jest.setTimeout(8000);
    jest.unmock('mongoose');
    connection = mongoose.connect('mongodb+srv://andreivoinea:nNtbdh6ZTWB9Xclr@treksec1.lfljmoa.mongodb.net/', {useNewUrlParser: true, useUnifiedTopology: true});
    console.log('Database connected!');
    
  });

  afterAll( async () => {

    mongoose.connection.close(true);
    console.log("Database connection closed");
  });

  test('admin not found', async () => {

    const response = await request(app)
      .post('/api/v1/authenticationsAdmin')
      .send(nameAdmin)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(404, {error: 'Admin name wrong.'});
    
  });


  test('password wrong', async () => {
  
    const response = await request(app)
      .post('/api/v1/authenticationsAdmin')
      .send(passAdmin)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(400, {error: 'Password wrong.'})

  });

  test('admin correct', async () => {
  
    const response = await request(app)
      .post('/api/v1/authenticationsAdmin')
      .send(correctAdmin)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)
    
  });
  

});
