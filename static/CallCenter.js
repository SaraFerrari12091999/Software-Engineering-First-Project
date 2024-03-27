var foundUser = {};
var data = '';

//gets the user coordinates, by searching in the db the user with the sme phone number (inserted)
function goMap(){
  var telefono = document.getElementById("NumeroTelefono").value;
  console.log(telefono);

  const url = `../api/v1/users/telefoni/${telefono}`;

  console.log(url);

  fetch(url, {
    method: 'GET'
  })

  .then((resp) => {
      data = resp.json();
      return data;
  })

.then(function(data) { 
  foundUser.self = data.self;
  foundUser.telefono = data.telefono;
  foundUser.coordX = data.coordX;
  foundUser.coordY = data.coordY;
  console.log(data);

  sessionStorage.setItem('userCoordinates', JSON.stringify({ coordX: data.coordX, coordY: data.coordY }));
  Enter(data.success );

})
.catch(error => console.error(error));
};


function goBack() {
  window.location.href = "../";
}

function Enter(dato){
  //controllo che l'utente esista nel database e in caso fosse, mostro la mappa con stampate le coordinate dell'utente che ha bisogno si soccorso
  if( dato === true ){
    userCoordinates = JSON.parse(sessionStorage.getItem('userCoordinates'));//sessionStorage
    window.location.href = "./MapCall.html";
    //var paragraph = document.getElementById("p");
    var text = document.createTextNode("lat: " + userCoordinates.coordX + "\nlong: " + userCoordinates.coordY);

    //paragraph.appendChild(text);
  
  }else{
    console.log("L'utente non è stato autenticato correttamente. Gestisci l'errore appropriatamente.");
  }
  return;
}
