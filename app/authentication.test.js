/**
 * https://www.npmjs.com/package/supertest
 */
const request = require('supertest');
const app     = require('./app');
const mongoose = require('mongoose');

const prova = {
  err1: 'Password wrong. ',
  err2: 'User name wrong. ',
};

describe('POST /api/v1/authentications', () => {
  const User = require('./models/user');

  let nameUser = {
    email: 'hamzaui.h01@gmail.com',
    password: 'ciaoComeStai_27'
  };

  let passUser = {
    email: 'hamzaoui.h01@gmail.com',
    password: 'ciaoCmeStai:27'
  };

  let correctUser = {
    email: 'hamzaoui.h01@gmail.com',
    password: 'ciaoComeStai_27'
  };

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

  test('user not found', async () => {
    const response = await request(app)
      .post('/api/v1/authentications')
      .send(nameUser)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(404, {error: 'User name wrong.' });   
  });


  test('password wrong', async () => {
    const response = await request(app)
      .post('/api/v1/authentications')
      .send(passUser)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(400, {success: false, message: 'Authentication failed. Wrong password.', error: 'Password wrong.' })
  });

  test('user correct', async () => {
    const response = await request(app)
      .post('/api/v1/authentications')
      .send(correctUser)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200)  
  });
});