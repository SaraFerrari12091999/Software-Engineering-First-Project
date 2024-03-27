//take the coordinates from json object in the sessionStorage
var userCoordinates = JSON.parse(sessionStorage.getItem('userCoordinates'));

var map = L.map('map').setView([0, 0], 13);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

function onLocationFound(e) {
  var radius = e.accuracy / 2;

  L.marker(e.latlng).addTo(map).bindPopup("You are within " + radius + " meters from this point").openPopup();
  L.circle(e.latlng, radius).addTo(map);
}

function onLocationError(e) {
  alert(e.message);
}

map.on('locationfound', onLocationFound);
map.on('locationerror', onLocationError);

function zoomIn() {
  map.zoomIn();
}

function zoomOut() {
  map.zoomOut();
}

function Map(){

    //using the coordinates

    if(userCoordinates){
        var coordX = userCoordinates.coordX;
        var coordY = userCoordinates.coordY;
    
        // Posiziona il marker sulla mappa utilizzando le coordinate utente
        var userLatLng = L.latLng(coordX,coordY);
        L.marker(userLatLng).addTo(map).bindPopup("Posizione Utente").openPopup();
        map.setView(userLatLng, 13);
    
    }else{

        alert("no access to coordinates");
    }
}

function goBack() {
  window.location.href = "../";
}

