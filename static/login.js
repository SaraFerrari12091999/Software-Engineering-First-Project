var loggedUsers = {};
var data = '';

function insertValueLogin(){

var email = document.getElementById("email").value;
var password = document.getElementById("password").value;

fetch('../api/v1/authentications',{

  method:'POST',
  headers: {'Content-Type': 'application/json'},
  body: JSON.stringify({email:email, password:password}),

})

.then((resp) => {
  data = resp.json();
  return data;
})
 

.then(function(data){
  loggedUsers.token = data.token;
  loggedUsers.email = data.email;
  loggedUsers.id = data.id;
  loggedUsers.self = data.self;

  console.log(data.success);
  
  sessionStorage.setItem('loggedUsers', loggedUsers.id); // Salvataggio dei dati nel session storage
  sessionStorage.setItem('loggedUserToken', loggedUsers.token); // Salvataggio dei dati nel session storage
  Enter(data.success);     

  sessionStorage.setItem('isLoggedUser', data.success);

})
.catch(error => console.error(error));
};

function goBack() {
  window.location.href = "../";
}

function ResetPasswordPage(){
   window.location.href = "./resetPassword.html";
};

function updateCoordinates() {
  
  const loggedUsersData = sessionStorage.getItem('loggedUsers'); // Recupero dei dati dal session storage
  const token = sessionStorage.getItem('loggedUserToken'); // Salvataggio dei dati nel session storage
  const success = sessionStorage.getItem('isLoggedUser');

  console.log(success);
  if(success){
    console.log("TRUE");
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const coordX = position.coords.latitude;
            const coordY = position.coords.longitude;
    
            fetch('../api/v1/users/' + loggedUsersData + '/coordinates', {
              method: 'PUT',
              headers: {
                'Content-Type': 'application/json',
                'x-access-token': token
              },
              body: JSON.stringify({ coordX, coordY }),
            })
    
    
              .then((response) => response.json())
              .then((data) => {
                console.log('Risposta dal server:', data);
              })
              .catch((error) => {
                // Gestisci gli errori di rete o altri errori
                console.error(error);
              });
          },
          (error) => {
            // Gestisci gli errori di geolocalizzazione
            console.error(error);
          }
        );
      } else {
        // Il browser non supporta la geolocalizzazione
        console.error('Geolocation is not supported by this browser.');
      }
      setTimeout(updateCoordinates, 20000);
    } else {
      console.log("FALSO");
    }
  return;
  }


function Enter(dato){

  if(dato === true){
    updateCoordinates();
    //setInterval(updateCoordinates, 20000);
    window.location.href = "./map.html";
    
  }else{
    console.log("L'utente non è stato autenticato correttamente. Gestisci l'errore appropriatamente.");
  }
  return;
}

async function prova2() {
  try{
  const loggedUsersData = sessionStorage.getItem('loggedUsers'); // Recupero dei dati dal session storage
  const response = await fetch(`api/v1/users/${loggedUsersData}/coordinates`); // Esegui la richiesta GET per ottenere le coordinate
  const data = await response.json(); 

  
  const latitude = data.lat;
  const longitude = data.long;

  await creaNuovoPericolo(latitude, longitude);

} catch (error) {
  console.error('Si è verificato un errore durante l\'esecuzione dell\'operazione:', error);
}

}


async function creaNuovoPericolo(latitude, longitude) {
  try {
    const tipoPericolo = document.getElementById("opzioni").value;
    
    const response = await fetch('/api/v1/dangers', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        type: tipoPericolo,
        latitude: latitude,
        longitude: longitude
      }) 
    });

  } catch (error) {
    console.error('Si è verificato un errore durante la creazione del pericolo:', error);
  }
}