/**
 * https://www.npmjs.com/package/supertest
 */
const request = require('supertest');
const app     = require('./app');
const mongoose = require('mongoose');

const Danger = require('./models/danger');

describe('GET /api/v1/dangers', () => {

    let dangerSpy;
    let dangerSpyFindById;
  
    beforeAll( () => {
      dangerSpy = jest.spyOn(Danger, 'find').mockImplementation((criterias) => {
        return [{
          id: "646238b39741945424b75b7b",
          type: "incendio",
          latitude: "20.45",
          longitude: "33.12",
          segnalazioni: "4",
          onMap: false
        }];
      });
      dangerSpyFindById = jest.spyOn(Danger, 'findById').mockImplementation((id) => {
        if (id=="646238b39741945424b75b7b")
            return {
                id: "646238b39741945424b75b7b",
                type: "incendio",
                latitude: "20.45",
                longitude: "33.12",
                segnalazioni: "4",
                onMap: false
            };
        else
          return {};
      });
    });
  
    afterAll(async () => {
        dangerSpy.mockRestore();
        dangerSpyFindById.mockRestore();
    });
    
    test('GET /api/v1/dangers should respond with an array of dangers', async () => {
      return request(app)
        .get('/api/v1/dangers')
        .expect('Content-Type', /json/)
        .expect(200)
        .then( (res) => {
            if(res.body && res.body[0]) {
              expect(res.body[0]).toEqual({
                self: '/api/v1/dangers/646238b39741945424b75b7b',
                id: '646238b39741945424b75b7b',
                type: 'incendio',
                latitude: '20.45',
                longitude: '33.12',
                segnalazioni: '4',
                onMap: false
              });
            }
          });
    });

    test('GET /api/v1/dangers/:type should respond with array of dangers with the same type', async () => {
        return request(app)
        .get('/api/v1/dangers/incendio')
        .expect('Content-Type', /json/)
        .expect(200)
        .then( (res) => {
            if(res.body && res.body[0]) {
                expect(res.body[0]).toEqual({
                    self: '/api/v1/dangers/646238b39741945424b75b7b',
                    type: 'incendio',
                    latitude: '20.45',
                    longitude: '33.12'
                });
                }
            });
    });


  
  });


describe('POST /api/v1/dangers', () => {
  let connection;


    let sconosciuto = {
        type: "sconosciuto",
        latitude: "11.11",
        longitude: "22.22"
    }

    let incendio = {
        type: "incendio",
        latitude: "11.11",
        longitude: "22.22"
    }

    beforeAll(async () => {
        //let newDanger;
        jest.setTimeout(8000);
        jest.unmock('mongoose');
        connection = mongoose.connect('mongodb+srv://andreivoinea:nNtbdh6ZTWB9Xclr@treksec1.lfljmoa.mongodb.net/', {useNewUrlParser: true, useUnifiedTopology: true});
        console.log('Database connected!');
        //newDanger = Danger.create(savedUser);
    
      });

    afterAll( async () => {
        mongoose.connection.close(true);
        console.log("Database connection closed");
    });

    test('undefined type of danger', async () => {
        const response = await request(app)
          .post('/api/v1/dangers')
          .send(sconosciuto)
          .set('Accept', 'application/json')
          .expect('Content-Type', /json/)
          .expect(400, {error: 'Si è verificato un errore durante la ricerca dei pericoli.'});
        
      });

    test('defined type of danger', async () => {
        const response = await request(app)
          .post('/api/v1/dangers')
          .send(incendio)
          .set('Accept', 'application/json')
          .expect('Content-Type', /json/)
          .expect(200, {prova: 'Pericolo aggiunto'});
        
      });

})



describe('PUT /api/v1/users/:id', () => {

  let connection;

  let dangerTest = {
    type: 'incendio',
    latitude: '20.45',
    longitude: '33.12'
  }

  let newDanger;
  
  
    beforeAll( async () => {
      jest.setTimeout(8000);
        jest.unmock('mongoose');
        connection = mongoose.connect('mongodb+srv://andreivoinea:nNtbdh6ZTWB9Xclr@treksec1.lfljmoa.mongodb.net/', {useNewUrlParser: true, useUnifiedTopology: true});
        console.log('Database connected!');
        newDanger = Danger.create(dangerTest);
      
    });
  
    afterAll(async () => {
      const id = newDanger.id;
      console.log(id);
      const deletedUser = await Danger.findOneAndDelete({ id });
      mongoose.connection.close(true);
      console.log("Database connection closed");
    });

    test('PUT /api/v1/dangers should respond with an array of dangers', async () => {
      return request(app)
        .put('/api/v1/dangers/123')
        .expect('Content-Type', /json/)
        .expect(404, {prova: 'Pericolo non trovato'})
    });

    test('PUT /api/v1/dangers/:type should respond with array of dangers with the same type', async () => {
      return request(app)
      .put(`/api/v1/dangers/${newDanger._id}`)
      .expect('Content-Type', /json/)
      .expect(200, {prova: 'Pericolo aggiunto'})
  });
})
