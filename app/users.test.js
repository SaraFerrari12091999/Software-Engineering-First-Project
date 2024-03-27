const request = require('supertest');
const app     = require('./app');
const mongoose = require('mongoose');
const jwt = require("jsonwebtoken");


const prova = {
  err1: 'Make the password longer. ',
  err2: 'Use both lowercase and uppercase letters. ',
  err3: 'Include at least one number. ',
  err4: 'Include at least one special character. '
};

describe('GET /api/v1/users', () => {

  let userSpy;
  let userSpyFindById;

  beforeAll( () => {
    const User = require('./models/user');
    userSpy = jest.spyOn(User, 'find').mockImplementation((criterias) => {
      return [{
        id: "646238b39741945424b75b7b",
        email: 'hamzaoui.h01@gmail.com'
      }];
    });
    userSpyFindById = jest.spyOn(User, 'findById').mockImplementation((id) => {
      if (id=="646238b39741945424b75b7b")
        return {
          id: "646238b39741945424b75b7b",
          email: 'hamzaoui.h01@gmail.com'
        };
      else
        return {};
    });
  });

  afterAll(async () => {
    userSpy.mockRestore();
    userSpyFindById.mockRestore();
  });
  
  test('GET /api/v1/users should respond with an array of users', async () => {
    return request(app)
      .get('/api/v1/users')
      .expect('Content-Type', /json/)
      .expect(200)
      .then( (res) => {
        if(res.body && res.body[0]) {
          expect(res.body[0]).toEqual({
            self: '/api/v1/users/646238b39741945424b75b7b',
            email: 'hamzaoui.h01@gmail.com'
          });
        }
      });
  });

  test('GET /api/v1/users/:id should respond with json', async () => {
    return request(app)
      .get('/api/v1/users/646238b39741945424b75b7b')
      .expect('Content-Type', /json/)
      .expect(200, {
          self: '/api/v1/users/646238b39741945424b75b7b',
          email: 'hamzaoui.h01@gmail.com'
        });
  });

});

describe('GET /api/v1/users/telefoni/:telefono', () => {
  let userSpy, userSpy2;
  let userSpyFindById;

  beforeAll( () => {
    const User = require('./models/user');
    userSpy = jest.spyOn(User, 'find').mockImplementation((criterias) => {
      return [{
        id: "646238b39741945424b75b7a",
        email: 'hamzaoui.h02@gmail.com',
        coordX: '30.22',
        coordY: '21.55'
      }];
    });

    userSpyFindById = jest.spyOn(User, 'findOne').mockImplementation((criterias) => {
      if (criterias.telefono === "1234567891")
        return {
          id: "646238b39741945424b75b7a",
          email: 'hamzaoui.h02@gmail.com',
          coordX: '30.22',
          coordY: '21.55'
        };
      else
        return {};
    });
  });

  afterAll(async () => {
    userSpy.mockRestore();
    userSpyFindById.mockRestore();
  });

    test('the telephone number is shorter', async()=>{

      const response = await request(app)
        .get('/api/v1/users/telefoni/123469023') 
        .expect('Content-Type',/json/)
        .expect(400,{error: 'Numero di telefono non valido'})
  
  });

  test('the telephone number is long', async()=>{

    const response = await request(app)
      .get('/api/v1/users/telefoni/12346902573') 
      .expect('Content-Type',/json/)
      .expect(400,{error: 'Numero di telefono non valido'})

});
  
  test('the telephone number is valid', async () => {
  
    const response = await request(app)
      .get('/api/v1/users/telefoni/1234567891')
      .expect('Content-Type', /json/)
      .expect(200)
      .then( (res) => {
        if(res.body && res.body[0]) {
            expect(res.body[0]).toEqual({
              self: '/api/v1/users/646238b39741945424b75b7a',
              email: 'hamzaoui.h02@gmail.com',
              lat: '30.22',
              long: '21.55'
            });
            }
        });

   
  });    

  test('the telephone number is not found', async()=>{

    const response = await request(app)
      .get('/api/v1/users/telefoni/1234690257') 
      .expect('Content-Type',/json/)
      .expect(404,{error: 'Numero di telefono non trovato'})

});

});

describe('POST /api/v1/users', () => {
  const User = require('./models/user');
  

  let savedUser = {
    nomeCognome: 'Prova Testing',
    email: 'provatesting@gmail.com',
    telefono: '9098765430',
    password: 'Password123/',
    checkPassword: 'Password123/',
    chx: true

  };

  let finalUser = {
    nomeCognome: "Gigi d'Alessio",
    email: 'gigidalessio@gmail.com',
    telefono: '1234567891',
    password: 'Trekse1/',
    checkPassword: 'Trekse1/',
    chx: true
  };

  beforeAll(async () => {
    let connection;
    let newUser;
    jest.setTimeout(8000);
    jest.unmock('mongoose');
    connection = mongoose.connect('mongodb+srv://andreivoinea:nNtbdh6ZTWB9Xclr@treksec1.lfljmoa.mongodb.net/', {useNewUrlParser: true, useUnifiedTopology: true});
    console.log('Database connected!');
    newUser = User.create(savedUser);

    const email = 'gigidalessio@gmail.com';

    try {
      const deletedUser = await User.findOneAndDelete({ email });
      if (deletedUser) {
        console.log('Deleted User:', deletedUser);
      } else {
        console.log('User not found');
      }
    } catch (error) {
      console.error(error);
    }
  });

  afterAll( async () => {
    const email = 'provatesting@gmail.com';
    try {
      const deletedUser = await User.findOneAndDelete({ email });
      if (deletedUser) {
        console.log('Deleted User:', deletedUser);
      } else {
        console.log('User not found');
      }
    } catch (error) {
      console.error(error);
    }

    mongoose.connection.close(true);
    console.log("Database connection closed");
  });

  test('user already registered', async () => {
    const response = await request(app)
      .post('/api/v1/users')
      .send(savedUser)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(409, {error: 'User already exists.'});
    
  });

  test('nome vuoto', async () => {
    const response = await request(app)
      .post('/api/v1/users')
      .send({
        nomeCognome: "",
        email: "",
        telefono: "",
        password: "",
        checkPassword: "",
        chx: false  
      })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(400, {errorNome: 'Insert a name and a surname.'})
  });

  test('telefono vuoto', async () => {
    const response = await request(app)
      .post('/api/v1/users')
      .send({
        nomeCognome: "Gigi d'Alessio",
        email: "",
        telefono: "",
        password: "",
        checkPassword: "" ,
        chx: false  
      })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(400, {errorTelefono: 'Insert a mobile number.'})
  });

  test('email vuota', async () => {
    const response = await request(app)
      .post('/api/v1/users')
      .send({
        nomeCognome: "Gigi d'Alessio",
        email: "",
        telefono: "1234567891",
        password: "",
        checkPassword: "",
        chx: false  
      })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(400, {errorEmail: 'Insert an email.'})

  });

  test('password vuota', async () => {
    const response = await request(app)
      .post('/api/v1/users')
      .send({
        nomeCognome: "Gigi d'Alessio",
        email: "gigidalessio@gmail.com",
        telefono: "1234567891",
        password: "",
        checkPassword: "",
        chx: false  
      })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(400, {errorsPassword: 'Insert a valid password.'})
  });

  

  test('nome non valido', async () => {
    const response = await request(app)
      .post('/api/v1/users')
      .send({
        nomeCognome: 'Gigi09',
        email: 'gigidalessio@gmail.com',
        telefono: '1234567891',
        password: 'Trekse1/',
        checkPassword: 'Trekse1/',
        chx: false  
      })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(400, {errorNome: 'Insert only letters.'})

  });

  /*
  test('nome corretto',async () =>{

    const respose = await request(app)
    .post('/api/v1/users')
    .send({
        nomeCognome: 'Gigi Alessio',
        email: 'gigidalessio@gmail.com',
        telefono: '1234567891',
        password: 'Trekse1/',
        checkPassword: 'Trekse1/',
        chx: false 

    })
    .set('Accept', 'application/json')
    .expect('Content-Type',/json/)
    .expect(200,{errorNome: 'go to the next check.'})

  });

  test('numero corretto', async () =>{

    const respose = await request(app)
    .post('/api/v1/users')
    .send({
      nomeCognome: 'Gigi Alessio',
      email: 'gigidalessio@gmail.com',
      telefono: '2343289456',
      password: 'Trekse1/',
      checkPassword: 'Trekse1/',
      chx: false 

    })
    .set('Accept','application/json')
    .expect('Content-Type',/json/)
    .except(200,{errorNome: 'go to the next check number.'})
  });
*/
  test('telefono non valido', async () => {
    const response = await request(app)
      .post('/api/v1/users')
      .send({
        nomeCognome: "Gigi d'Alessio",
        email: 'gigidalessio@gmail.com',
        telefono: '1342easd12',
        password: 'Trekse1/',
        checkPassword: 'Trekse1/',
        chx: false  
      })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(400, {errorTelefono: 'Insert only digits.'})

  });


  test('telefono lungo', async () => {
    const response = await request(app)
      .post('/api/v1/users')
      .send({
        nomeCognome: "Gigi d'Alessio",
        email: 'gigidalessio@gmail.com',
        telefono: '12345678903',
        password: 'Trekse1/',
        checkPassword: 'Trekse1/',
        chx: false  
      })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(400, {errorTelefono: 'Insert 10 digits.'})
    
  });

  test('telefono corto', async () => {
    const response = await request(app)
      .post('/api/v1/users')
      .send({
        nomeCognome: "Gigi d'Alessio",
        email: 'gigidalessio@gmail.com',
        telefono: '123456789',
        password: 'Trekse1/',
        checkPassword: 'Trekse1/',
        chx: false  
      })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(400, {errorTelefono: 'Insert 10 digits.'})
    
  });


  test('email non valida [@]', async () => {
    const response = await request(app)
      .post('/api/v1/users')
      .send({
        nomeCognome: "Gigi d'Alessio",
        email: 'gigidalessiogmail.com',
        telefono: '1234567891',
        password: 'Trekse1/',
        checkPassword: 'Trekse1/',
        chx: false  
      })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(400, {errorEmail: 'Not a valid email.'})
    
  });


  test('email non valida [.]', async () => {
    const response = await request(app)
      .post('/api/v1/users')
      .send({
        nomeCognome: "Gigi d'Alessio",
        email: 'gigidalessio@gmail',
        telefono: '1234567891',
        password: 'Trekse1/',
        checkPassword: 'Trekse1/',
        chx: false  
      })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(400, {errorEmail: 'Not a valid email.'})
    
  });

  /*
  test('email corretta', async () =>{

    const respose = await request(app)
    .post('/api/v1/users')
    .send({
      nomeCognome: 'Gigi Alessio',
      email: 'gigidalessio@gmail.com',
      telefono: '2343289456',
      password: 'Trekse1/',
      checkPassword: 'Trekse1/',
      chx: false 

    })
    .set('Accept','application/json')
    .expect('Content-Type',/json/)
    .except(200,{errorNome: 'go to the next check email.'})
  });
*/
  
  test('password non valida', async () => {
    const response = await request(app)
      .post('/api/v1/users')
      .send({
        nomeCognome: "Gigi d'Alessio",
        email: 'gigidalessio@gmail.com',
        telefono: '1234567891',
        password: 'trek',
        checkPassword: 'trek',
        chx: false  
      })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/);

    expect(response.status).toBe(400);
    expect(response.body.errorsPassword).toContain(prova.err1);
    expect(response.body.errorsPassword).toContain(prova.err2);
    expect(response.body.errorsPassword).toContain(prova.err3);
    expect(response.body.errorsPassword).toContain(prova.err4);
    
  });


  test('password non valida2', async () => {
    const response = await request(app)
      .post('/api/v1/users')
      .send({
        nomeCognome: "Gigi d'Alessio",
        email: 'gigidalessio@gmail.com',
        telefono: '1234567891',
        password: 'trek12',
        checkPassword: 'trek12',
        chx: false  
      })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/);

    expect(response.status).toBe(400);
    expect(response.body.errorsPassword).toContain(prova.err1);
    expect(response.body.errorsPassword).toContain(prova.err2);
    expect(response.body.errorsPassword).toContain(prova.err4);

  });

  test('password non valida3', async () => {
    const response = await request(app)
      .post('/api/v1/users')
      .send({
        nomeCognome: "Gigi d'Alessio",
        email: 'gigidalessio@gmail.com',
        telefono: '1234567891',
        password: 'Trek12',
        checkPassword: 'Trek12',
        chx: false  
      })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/);

    expect(response.status).toBe(400);
    expect(response.body.errorsPassword).toContain(prova.err1);
    expect(response.body.errorsPassword).toContain(prova.err4);
    
  });

  test('password non valida4', async () => {
    const response = await request(app)
      .post('/api/v1/users')
      .send({
        nomeCognome: "Gigi d'Alessio",
        email: 'gigidalessio@gmail.com',
        telefono: '1234567891',
        password: 'Trek12/',
        checkPassword: 'Trek12/',
        chx: false  
      })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/);

    expect(response.status).toBe(400);
    expect(response.body.errorsPassword).toContain(prova.err1);

  });



  test('password e checkPassword non concordi', async () => {
    const response = await request(app)
      .post('/api/v1/users')
      .send({
        nomeCognome: "Gigi d'Alessio",
        email: 'gigidalessio@gmail.com',
        telefono: '1234567891',
        password: 'Treksec12/',
        checkPassword: 'Treksec12',
        chx: false  
      })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(400, {errorCheck: 'Passwords do not match.'});
  });

  /*
  test('password corretta', async () =>{

    const respose = await request(app)
    .post('/api/v1/users')
    .send({
      nomeCognome: 'Gigi Alessio',
      email: 'gigidalessio@gmail.com',
      telefono: '2343289456',
      password: 'Trekse1/',
      checkPassword: 'Trekse1/',
      chx: false 

    })
    .set('Accept','application/json')
    .expect('Content-Type',/json/)
    .except(200,{errorNome: 'go to the next check password.'})
  });
*/
  
  test('checkBox non compilato', async () => {
    const response = await request(app)
      .post('/api/v1/users')
      .send({
        nomeCognome: "Gigi d'Alessio",
        email: 'gigidalessio@gmail.com',
        telefono: '1234567891',
        password: 'Treksec123/',
        checkPassword: 'Treksec123/',
        chx: false  
      })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(400, {errorBox: 'Accept the usage terms.'});
  });

  test('registrazione avvenuta', async () =>{

    const respose = await request(app)
    .post('/api/v1/users')
    .send({
      nomeCognome: 'Gigi Alessio',
      email: 'gigidalessio@gmail.com',
      telefono: '2343289456',
      password: 'Trekse1/',
      checkPassword: 'Trekse1/',
      chx: true 

    })
    .set('Accept','application/json')
    .expect('Content-Type',/json/)
    .except(200,{errorNome: 'user registration success.'})
  });


  test('should create a new user', async () => {
  
    const response = await request(app)
      .post('/api/v1/users')
      .send(finalUser)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(201)
    
  });

  test('the telephone number is wrong', async()=>{

      const response = await request(app)
        .post('/api/v1/users/telefoni/:telefono')
        .send({
          telefono: '123469023'
        }) 
        .set('Accept','application/json')
        .expect('Content-Type',/json/)
        .except(400,{error: 'Numero di telefono non valido'})

  })

  test('the telephone number is true', async () => {
 
    const response = await request(app)
      .post('/api/v1/users/telefoni/:telefono')
      .send({
        telefono: '1234567891' //numero valido
      })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(200, {error: 'Numero di telefono valido'})
   
  });    
  

  test('should send a mail to the user user', async () => {
 
    const response = await request(app)
      .post('/api/v1/users/reset-password')
      .send({
        nomeCognome: "Gigi d'Alessio",
        email: 'gigidalessio@gmail.com',
        telefono: '1234567891',
        password: 'Trekse1/',
        checkPassword: 'Trekse1/',
        chx: true
      })
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(201, {error: 'Mail sended'})
   
  });      

  test('should not send a mail to the user', async () => {
 
    const response = await request(app)
      .post('/api/v1/users/reset-password')
      .send({
          email: 'gigidalessiogmail.com',
          password: 'Trekse1/',
        }
      )
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(404, {error: 'Email not found'})

  });
  
});

describe('PUT /api/v1/users/', () => {
  const User = require('./models/user');
    
  let passNotStrong = {
    email: 'hamzaoui.h01@gmail.com',
    newPassword: 'ciao',
    newcheckPassword: 'ciao'
  };

  let passNotMatch = {
    email: 'hamzaoui.h01@gmail.com',
    newPassword: 'ciaoComeStai_3',
    newcheckPassword: 'ciaoComeSti_3'
  };

  let updateUser = {
    email: 'hamzaoui.h01@gmail.com',
    newPassword: 'ciaoComeStai-27',
    newcheckPassword: 'ciaoComeStai-27',
    token : jwt.sign({email: 'hamzaoui.h01@gmail.com'}, 'mysecret', {expiresIn: "10m"})
  };

  

  beforeAll(async () => {
    let connection;
    jest.setTimeout(8000);
    jest.unmock('mongoose');
    connection = mongoose.connect('mongodb+srv://andreivoinea:nNtbdh6ZTWB9Xclr@treksec1.lfljmoa.mongodb.net/', {useNewUrlParser: true, useUnifiedTopology: true});
    console.log('Database connected!');
  });

  afterAll( async () => {
    mongoose.connection.close(true);
    console.log("Database connection closed");
  });

  test('password not stong', async () => {

    const response = await request(app)
      .put('/api/v1/users/reset-password')
      .send(passNotStrong)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(400, {error: 'Password not stong enough'});
    
  });

  test('password not matching', async () => {

    const response = await request(app)
    .put('/api/v1/users/reset-password')
      .send(passNotMatch)
      .set('Accept', 'application/json')
      .expect('Content-Type', /json/)
      .expect(400, {error: 'Passwords do not match.'});
    
  }); 

  test('update password', async () => {
    
    return request(app)
      .put('/api/v1/users/reset-password')
      .set('x-access-token', updateUser.token)
      .set('Accept', 'application/json')
      .send(updateUser)
      .expect('Content-Type', /json/)
      .expect(201, {error: "User updated"});
    
  });
});
