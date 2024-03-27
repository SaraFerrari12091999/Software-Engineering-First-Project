
var foundDanger = {};
var data = '';
let map;
let image;
let timerInterval;

//funzione per aprire e chiudere ka schermata dei filtri
function toggleFiltri(){
    var overlay_filtri = document.querySelector('.overlay_filtri');
    overlay_filtri.classList.toggle('active');

}

function zoomIn() {
    map.zoomIn();
}

function zoomOut() {
    map.zoomOut();
}
//funzione per recurperare dal database le coordinate dei oericoli che l'utente vuole vedere
function getPericoli(){
    var orso = document.getElementById("orso").checked;
    var incendio = document.getElementById("incendio").checked;
    var valanga = document.getElementById("valanga").checked;
    var zonaDiCaccia = document.getElementById("zonaDiCaccia").checked;

    console.log("orso = " + orso);
    console.log("incendio = " + incendio);
    console.log("valanga = " + valanga);
    console.log("zonaDiCaccia = " + zonaDiCaccia);

    if(orso == true){
        fetch(`../api/v1/dangers/orso`, {
            method: 'GET'
        })
        .then((resp) => {
            data = resp.json();
            return data;
        })
        .then(function(data) { 
            foundDanger.self = data.self;
            foundDanger.type = data.telefono;
            foundDanger.coordX = data.coordX;
            foundDanger.coordY = data.coordY;
            console.log(data);
          
        })
          
        .catch(error => console.error(error));
    }

    if(incendio == true){
        fetch(`../api/v1/dangers/incendio`, {
            method: 'GET'
        })
        .then((resp) => {
            data = resp.json();
            return data;
        })
        .then(function(data) { 
            foundDanger.self = data.self;
            foundDanger.type = data.telefono;
            foundDanger.coordX = data.coordX;
            foundDanger.coordY = data.coordY;
            console.log(data);
          
        })
          
        .catch(error => console.error(error));        
    }

    if(valanga == true){
        fetch(`../api/v1/dangers/valanga`, {
            method: 'GET'
        })
        .then((resp) => {
            data = resp.json();
            return data;
        })
        .then(function(data) {
            foundDanger.self = data.self;
            foundDanger.type = data.telefono;
            foundDanger.coordX = data.coordX;
            foundDanger.coordY = data.coordY;
            console.log(data);
          
        })
          
        .catch(error => console.error(error));  
    }

    if(zonaDiCaccia == true){
        fetch(`../api/v1/dangers/zona di caccia`, {
            method: 'GET'
        })
        .then((resp) => {
            data = resp.json();
            return data;
        })
        .then(function(data) {
            foundDanger.self = data.self;
            foundDanger.type = data.telefono;
            foundDanger.coordX = data.coordX;
            foundDanger.coordY = data.coordY;
            console.log(data);
          
        })
          
        .catch(error => console.error(error));  
    }
}

function Sos_Button(){

    window.location.href = "tel:3487156282"; //number of one of the member of the team work, please change if testing the application
}


// Inizializzazione della mappa
function initMap() {
    const mapContainer = document.getElementById('map');
    if (mapContainer) {
      map = L.map('map').setView([0, 0], 13);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 18,
      }).addTo(map);
  
      map.on('locationfound', onLocationFound);
      map.on('locationerror', onLocationError);
  
      map.locate({ setView: true, maxZoom: 16 });
  
    } else {
      console.error('Map container not found.');
    }
  }
                
// Impostazione del marker sulle coordinate dell'utente
function onLocationFound(e) {
    var radius = e.accuracy / 2;

    L.marker(e.latlng).addTo(map).bindPopup("You are within " + radius + " meters from this point").openPopup();
    L.circle(e.latlng, radius).addTo(map);
}

function onLocationError(e) {
    alert(e.message);
}

function toggleMenu() {
    var overlay = document.querySelector('.mappa_prova .overlay');
    overlay.classList.toggle('active');
}

function Segnala_Func(){

    var overlay_segn = document.querySelector('.mappa_prova .overlay .overlay_segn');
    console.log(overlay_segn);
    
    overlay_segn.classList.toggle('active');

}

// la seguente funzione effettua una FETCH dell'operazione GET di
// api/v1/dangers, quindi TUTTI i pericoli, verifica la 
// variabile "onMap" definita nel modello Danger, e modificata dal
// moderatore nel momento in cui preme il bottone "Inserisci".

// Quando ciò accade, tale modifica viene catturata dalla seguente
// funzione, che andrà ad inserire sulla mappa l'immagine
// corrispondente alla tipologia di pericolo segnalato, alle coordinate 
// in cui questo è stato segnalato .

function addImageToMap(){

    fetch('../api/v1/dangers')
    
    .then((resp) => {
      data = resp.json();
      return data;
    })
    .then(function(data){
    
      const jsonContainer = document.getElementById('json-container');

      // essendo che i pericoli possono essere molteplici, tramite la forEach 
      // viene analizzato ogni singolo pericolo
      data.forEach(element => {
        // tale variabile risulta TRUE nel momento in cui il moderatore conferma la segnalazione
        // del pericolo sulla mappa
        if (element.onMap) {
            const latitude = parseFloat(element.latitude); // Parse latitude as float
            const longitude = parseFloat(element.longitude); // Parse longitude as float

          if (map) {
            const dangerType = element.type;
            const imageUrl = immagineMappa(dangerType);
            const imageBounds = [
              [latitude, longitude],
              [latitude + 0.001, longitude + 0.001]
            ];

            image = L.imageOverlay(imageUrl, imageBounds).addTo(map);
            
            deleteReport(element.id);
              
            
          } 
          }
           
        
      });

    
    })
    
    .catch(error => console.error(error));
    };
    

// Funzione che va a impostare un timer a partire dal momento in cui
// il pericolo compare sulla mappa
    function countdownTimer(seconds, callback) {
      const timerInterval = setInterval(() => {
        seconds--;
        if (seconds <= 0) {
          clearInterval(timerInterval);
          callback(true);
        }
      }, 1000);
    }
  


// La seguente funzione viene invocata non appena viene caricata l'immagine 
// sulla mappa. Anche in questo caso viene effettuata una FETCH, ma in questo
// caso dell'operazione DELETE relativa all'ID dello specifico pericolo.

// Prima che venga eliminato, viene richiamato il timer, allo scadere del quale
// l'immagine scomparirà dalla mappa, e il pericolo verrà eliminato definitivamente
// dal DB.

function deleteReport(reportId) {
  const deleteUrl = `../api/v1/dangers/${reportId}`;
  let secs = 10; //a scopo di demo, impostiamo che il pericolo si cancelli automaticamente dalla mappa dopo 10 secondi

  countdownTimer(secs, async (timerResult) => {
    if (timerResult) {
      try {
        const response = await fetch(deleteUrl, {
          method: 'DELETE',
        });

        if (!response.ok) {
          throw new Error('Errore di rete');
        }

        console.log(`Pericolo con ID ${reportId} eliminato con successo.`);
        map.removeLayer(image);
      } catch (error) {
        console.error('Errore durante la cancellazione:', error);
      }
    }
  });
}

function immagineMappa(dangerType) {
    const imageMappings = {
        'orso': 'images/orso-removebg-preview.png',
        'incendio': 'images/fire_nobkg.png',
        'valanga': 'images/valanga-removebg-preview.png',
        'zona di caccia': 'images/caccia_prova-removebg-preview.png'
    };
    
    return imageMappings[dangerType];
    }

document.addEventListener('DOMContentLoaded', function() {
    const directAccessMapContainer = document.getElementById('map');
    if (directAccessMapContainer) {
      initMap();
    }
    
    if (!timerInterval) {
      addImageToMap();
      timerInterval = setInterval(addImageToMap, 20000);
    }
  });
