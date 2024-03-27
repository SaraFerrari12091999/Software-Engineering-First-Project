require('dotenv').config()
const express = require('express');
const router = express.Router();
const User = require('./models/user'); // get our mongoose model
const jwt = require("jsonwebtoken");
const nodeMailer = require('nodemailer');
const Mailgen = require('mailgen');
const user = require('./models/user');

var risp = [];

// Stampa tutti gli utenti che hanno effettuato la registrazione
router.get('', async (req, res) => {
  let users = await User.find();;
  // In particolare, per ogni utente, verranno stampati i campi "self" ed "email"
  users = users.map((entry) => ({
    self: '/api/v1/users/' + entry.id,
    email: entry.email,
    telefono: entry.telefono
  }));

  return res.status(200).json(users);
    
});

// Stampa il signolo utente il cui ID corrisponde a quello indicato nel parametro
router.get('/:id', async (req, res) => {
  let user = await User.findById(req.params.id);

  return res.status(200).json({
      self: '/api/v1/users/' + user.id,
      email: user.email
  });
});

// Registrazione di un nuovo utente
router.post('', async function (req, res, next) {
  let content = req.body;

  // Verifico se il campo "nomeCognome" è vuoto
  if(content.nomeCognome.length === 0) {
    return res.status(400).json({ errorNome: 'Insert a name and a surname.'});
  }

  // Verifico se il campo "telefono" è vuoto
  if(content.telefono.length === 0) {
    return res.status(400).json({ errorTelefono: 'Insert a mobile number.'});
  }

  // Verifico se il campo "email" è vuoto
  if(content.email.length === 0) {
    return res.status(400).json({ errorEmail: 'Insert an email.'});
  }

  // Verifico se il campo "password" è vuoto
  if(content.password.length === 0) {
    return res.status(400).json({errorsPassword: 'Insert a valid password.'});
  }

  // Effettuo una ricerca nel DB per verificare se l'utente è già esistente
  let findUser = await User.findOne({
      email: content.email
  });

  let findNumber = await User.findOne({telefono: content.telefono});

  if(findUser || findNumber) {
      res.status(409).json({ error: 'User already exists.' });
      return;
  };

  // Controllo e notifico un'eventuale presenza di cifre nel campo "nomeCognome"
  if (checkNome(content.nomeCognome)) {
    return res.status(400).json({ errorNome: 'Insert only letters.'});
  }

  /*
  //controllo e notifico che il nome è stato digitato correttamente
  if(!checkNome(content.nomeCognome) && !(content.nomeCognome.length === 0) && !findUser){

    return res.status(200).json({ errorNome: 'go to the next check.'});
  }
*/
  
  // Controllo e notifico un'eventuale presenza di caratteri che non siano cifre nel campo "telefono"
  if(checkTelefonoValid(content.telefono)) {
    return res.status(400).json({ errorTelefono: 'Insert only digits.'});
  }

  // Controllo e notifico un'eventuale anomalia nel numero di cifre inserito nel campo "telefono"
  if(checkTelefonoLength(content.telefono)) {
    return res.status(400).json({ errorTelefono: 'Insert 10 digits.'});
  }

  /*
  //Controllo se è corretto e avviso riguardo la correttezza
  if(!checkNome(content.nomeCognome) && !(content.nomeCognome.length === 0) && !findUser
     && !checkTelefonoValid(content.telefono) && !checkTelefonoLength(content.telefono) && !(content.telefono.length === 0) ) {
    return res.status(200).json({ errorTelefono: 'go to the next check number.'});
  }
*/
  
  // Controllo e notifico un'eventuale assenza di caratteri validi nel campo "email"
  if(checkIfEmailInString(content.email)) {
    return res.status(400).json({ errorEmail: 'Not a valid email.'});
  }

  /*
  //Controllo se è corretto e avviso riguardo la correttezza
  if(!checkNome(content.nomeCognome) && !(content.nomeCognome.length === 0) && !findUser
     && !checkTelefonoValid(content.telefono) && !checkTelefonoLength(content.telefono) && !(content.telefono.length === 0) 
     && !(content.email.length === 0) && !checkIfEmailInString(content.email)) {
    
      return res.status(200).json({ errorEmail: 'go to the next check email.'});
  }
  */
  
  // Controllo e notifico un'eventuale tentativo di salvataggio di una password debole nel campo "password"
  if(checkPasswordStrength(content.password) && risp.length > 0) {
    return res.status(400).json({errorsPassword: risp});
  }


  // Controllo e notifica un'eventuale anomalia tra i campi "password" e "checkPassword"
  if(checkPasswords(content.password, content.checkPassword)) {
    return res.status(400).json({errorCheck: 'Passwords do not match.'});
  }

  /*
  //Controllo se è corretto e avviso riguardo la correttezza
  if(!checkNome(content.nomeCognome) && !(content.nomeCognome.length === 0) && !findUser
     && !checkTelefonoValid(content.telefono) && !checkTelefonoLength(content.telefono) && !(content.telefono.length === 0) 
     && !(content.email.length === 0) && !checkIfEmailInString(content.email)
     && !(content.password.length === 0) && !checkPasswordStrength(content.password) && !checkPasswords(content.password, content.checkPassword)) {
    
      return res.status(200).json({ errorsPassword: 'go to the next check password.'});
  }
*/
  
  if (!content.chx) {
    // Checkbox is checked
    return res.status(400).json({errorBox: 'Accept the usage terms.'});

  }

   //Controllo se è corretto e avviso riguardo la correttezza
   if(!checkNome(content.nomeCognome) && !(content.nomeCognome.length === 0) && !findUser
   && !checkTelefonoValid(content.telefono) && !checkTelefonoLength(content.telefono) && !(content.telefono.length === 0) 
   && !(content.email.length === 0) && !checkIfEmailInString(content.email)
   && !(content.password.length === 0) && !checkPasswordStrength(content.password) && !checkPasswords(content.password, content.checkPassword)
   && content.chx) {
  
    return res.status(200).json({ errorBox: 'user registration success.'});
}
  
  // Se tutte le condizioni precedenti vengono soddisfatte, si procede con la creazione dell'utente
  try{
      let newUser = await User.create(content);
      res.location('/api/v1/users/' + newUser.id);
      return res.status(201).json({
        success: true,
        self: '/api/v1/users/' + newUser.id,
        id: newUser.id,
        email: newUser.email
      });
    } catch(error) {}
      
});

// Operazione invocata periodicamente qualora l'utente abbia effettuato il login, per salvare le coordinate nel DB
router.put('/:id/coordinates', async (req, res) => {
  const userId = req.params.id;
  const coordX = req.body.coordX;
  const coordY = req.body.coordY;
  
  try {

    let user = await User.findById(req.params.id);
    if(user.logIn === true) {
      const updatedUser = await User.findOneAndUpdate(
        { _id: userId },
        { coordX: coordX, coordY: coordY },
        { new: true }
      );
  
      if (!updatedUser) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      return res.status(200).json({
        self: '/api/v1/users/' + updatedUser.id + '/coordinates',
        email: updatedUser.email
    });
  }
} catch (error) {
  // Gestisci gli errori di aggiornamento del database
  console.error(error);
  res.status(500).json({ error: 'Internal server error' });
}

});

//Operazione che permette al moderatore di identificare le coordinate dell'utente, in caso di pericolo.
router.get('/:id/coordinates', async (req, res) => {
  let user = await User.findById(req.params.id);
  return res.status(200).json({
      self: '/api/v1/users/' + user.id,
      email: user.email,
      lat: user.coordX,
      long: user.coordY
  });
});

router.get('/telefoni', async (req, res) => {
  let users = await User.find();;
  // In particolare, per ogni utente, verranno stampati i campi "self", "telefono", "coordinate"
  users = users.map((entry) => ({
    self: '/api/v1/users/telefoni/' + entry.telefono,
    telefono: entry.telefono,
    coordX: entry.coordX,
    coordY: entry.coordY
  }));
  return res.status(200).json(users); 
});

//numero non esistente  nel database oppure esistente
router.get('/telefoni/:telefono', async (req, res) => {

  const telefono = req.params.telefono;

  if (req.params.telefono) {
      const findUser = await User.findOne({telefono: telefono});

      console.log(findUser.id);
      return res.status(200).json({
          self: '/api/v1/users/' + findUser.id,
          telefono: findUser.telefono,
          coordX: findUser.coordX,
          coordY: findUser.coordY,
          success: true,
          error: 'Numero di telefono valido'
      });

  } else {
    return res.status(400).json({ error: 'Numero di telefono non valido' });
  }
  
}); 

router.delete('/:id', async (req, res) => {
    let user = await User.findById(req.params.id);
    if (!user) {
        res.status(404).send()
        console.log('User not found')
        return;
    }
    await user.deleteOne()
    return res.status(204).send()
});


function checkNome(nomeCognome){
    if (nomeCognome.match(/\d/)) { 
        return true;
    }
    return false;
  }

  function checkTelefonoValid(telefono){
    if((telefono.match(/[a-z]/) || telefono.match(/[A-Z]/)) || telefono.match(/[^a-zA-Z\d]/)) {
      return true;
    }
    return false;
}

function checkTelefonoLength(telefono){
    if((telefono).length != 10 ){
      return true;
    }
    return false;
  }

function checkIfEmailInString(text) {
    var re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if(!(text.match(re))){
      return true;
    }
    return false;
  }

async function checkPasswordStrength(password) {
  risp = [];
  var strength = 0;
    
  if (password.length < 8) {
    risp.push("Make the password longer. ");
  } else {
    strength += 1;
  }

  // Check for mixed case
  if (password.match(/[a-z]/) && password.match(/[A-Z]/)) {
    strength += 1;
  } else {
    risp.push("Use both lowercase and uppercase letters. "); 
  }

  // Check for numbers
  if (password.match(/\d/)) {
    strength += 1;
  } else {
    risp.push("Include at least one number. "); 
  }

  // Check for special characters
  if (password.match(/[^a-zA-Z\d]/)) {
    strength += 1;
  } else {
    risp.push("Include at least one special character. "); 
  }

  // Return results
  if (strength < 3) {
    //console.log(risp);
    return risp;
  } 
    
  return false;
  }

  function checkPasswords(password, checkPassword) {
    if (password !== checkPassword) {
      console.log('password sbagliata');
      return true;
    }
    console.log('password ok');
    return false;
  }
  
 // Reset della password di un utente che ha già effettuato la registrazione
router.post('/reset-password',  async (req, res) => {
  // Per effettuare il reset, l'utente deve inserire come campo l'email
  let email = req.body.email;

  // Si cerca l'utente nel DB
  const findUser = await User.findOne({email: email});

  if(!findUser) {
    return res.status(404).json({ error: 'Email not found' });
  }
  //Si genera un token che identifica univocamente l'utente
  let token = jwt.sign({ email: findUser.email }, process.env.SUPER_SECRET, { expiresIn: "10m",});

  const user = await User.findOneAndUpdate(
    { id: findUser.id },
    { token: token},
    { new: true }
  );

  const resetLink = `https://treksec.onrender.com/newPassword.html?token=${token}`;
  sendMailF(findUser.email, resetLink);

  return res.json({token});

});

// Si accede alla pagina di reset password
router.put('/reset-password', async (req, res) => {
  const token = req.body.token;
  const password = req.body.newPassword;
  const checkPassword = req.body.newcheckPassword;
  
  try{

    if(checkPasswordStrength(req.body.newPassword) && risp.length > 0) {
      return res.status(400).json({error: risp});
    }

    if(checkPasswords(req.body.newPassword, req.body.newcheckPassword)) {
      return res.status(400).json({error: 'Passwords do not match.'});
    }
    
    const user = await User.findOneAndUpdate(
      { token: token },
      { password: password, checkPassword: checkPassword, token: undefined },
      { new: true }
    );

    return res.status(201).json("User Updated!");

  } catch(error) {
    return res.status(500).json({ message: 'Si è verificato un errore durante il reset della password. Riprova più tardi.' });
  }

});

  function sendMailF(email, link){
    let config = {
      service : 'gmail',
      auth: {
        user: "treksec.baboo@gmail.com",
        pass: "mtanhszmrkehqcnn"
      },
      tls: {
        rejectUnauthorized: false
      }
    }
    let transporter = nodeMailer.createTransport(config);
  
    let MailGenerator = new Mailgen({
        theme : "default",
        product : {
          name: "Mailgen",
          link : 'https://mailgen.js/'
        }
    })
    
    let response = {
        body: {
            name: 'This is TrekSec app',
            intro: 'You clicked on ResetPassword',
            action: {
                instructions: 'To reset your password, please click here:',
                button: {
                    text: 'Reset your password',
                    link: link
                }
            },
            outro: 'Need help, or have questions? Just ask the "supporto tecnico".'
        }
    }
    
    let mail = MailGenerator.generate(response);
  
    let message = {
      from: 'treksec.baboo@gmail.com', 
      to: email,
      subject: 'Reset Password',
      html: mail,
    }
    // send email
    transporter.sendMail(message)
  }

module.exports = router;