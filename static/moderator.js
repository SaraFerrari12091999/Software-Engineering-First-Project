var dangerIDs = {};
var segnalazioni = {};
var data = '';

// La seguente funzione analizza tutti i pericoli, il cui valore
// "onMap" risulti FALSO, in quanto ancora da prendere in considerazione
// dal moderatore.

// Qualora il moderatore avesse premuto il bottone "Ignora", tale pericolo
// verrà cancellato dal DB e non verrà mai mostrato nella mappa.

// Se, invece, preme "Aggiungi", tale pericolo sparirà comunque dalla sua 
// schermata, e non verrà più visto al prossimo refresh della pagina, in quanto
// viene effettuato il controllo su tale variabile.

function getReports(){

  fetch('../api/v1/dangers')
  .then((resp) => {
    data = resp.json();
    return data;
  })
  .then(function(data){
    const jsonContainer = document.getElementById('json-container');
    //essendo che l'output è un array di pericoli, viene analizzato un pericolo alla volta
    console.log(data.length);
    data.forEach(element => {
      const id = element.id;
      let container = dangerIDs[id];
      if(!element.onMap) {
        if (container) {
          if((segnalazioni[id] !== element.segnalazioni) ) {
            // Se il report è già visualizzato, aggiorna solo i contenuti modificati
            const textDiv = container.querySelector('.text');
            textDiv.textContent = "Segnalazione di " + element.type + " nella posizione [" + element.latitude + "," + element.longitude + "]";
            segnalazioni[id] = element.segnalazioni;
            const circle = container.querySelector('.circle');
            circle.textContent = element.segnalazioni;
          }
        } // Altrimenti, imposta la visualizzazione di un nuovo pericolo segnalato dall'utente
        else {
          container = document.createElement('div');
          container.classList.add('container');
          container.setAttribute('data-id', id);
          container.setAttribute('data-lat', element.latitude);
          container.setAttribute('data-lng', element.longitude); 
          dangerIDs[id] = container;
          segnalazioni[id] = element.segnalazioni;
    
          const circle = document.createElement('div');
          circle.classList.add('circle');
          circle.textContent = element.segnalazioni;
    

          const textDiv = document.createElement('div');
          textDiv.classList.add('text');
          textDiv.textContent = "Segnalazione di " + element.type + " nella posizione [" + element.latitude + "," + element.longitude + "]";
          
          const image = document.createElement('img');
          const dangerType = element.type;
          const imageUrl = immagineMappa(dangerType);
          image.classList.add('image');
          image.src = imageUrl;
    
          const contentDiv = document.createElement('div');
          contentDiv.classList.add('content');
    
          const titleDiv = document.createElement('div');
          titleDiv.classList.add('title');
          titleDiv.textContent = 'Segnalazione Pericolo [' + element.type + ']';
    
          const addButton = document.createElement('button');
          addButton.classList.add('add');
          addButton.textContent = 'Aggiungi';
    
          const ignoreButton = document.createElement('button');
          ignoreButton.classList.add('ignore');
          ignoreButton.textContent = 'Ignora';
    
          ignoreButton.addEventListener('click', () => {
            deleteReport(element.id);
          });
    
          addButton.addEventListener('click', () => {
            aggiorna(element.id);
            removeContainer(element.id)
            
          });
    
          contentDiv.appendChild(titleDiv);
          contentDiv.appendChild(textDiv);
          container.appendChild(image);
          container.appendChild(contentDiv);
          container.appendChild(circle);
          container.appendChild(addButton);
          container.appendChild(ignoreButton);
    
        jsonContainer.appendChild(container); 
        }
      }
    });
  })
.catch(error => console.error(error));
};

function immagineMappa(dangerType) {
  const imageMappings = {
    'orso': 'images/orso-removebg-preview.png',
    'incendio': 'images/fire_nobkg.png',
    'valanga': 'images/valanga-removebg-preview.png',
    'zona di caccia': 'images/caccia_prova-removebg-preview.png'
  };
  return imageMappings[dangerType];
}


function deleteReport(reportId) {
  const deleteUrl = `../api/v1/dangers/${reportId}`;

  fetch(deleteUrl, {
    method: 'DELETE',
  })
  .then((response) => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    console.log(`Pericolo con ID ${reportId} ignorato.`);
    removeContainer(reportId);
  })
  .catch((error) => {
    console.error('Errore durante la cancellazione:', error);
  });
}
  
  function removeContainer(reportId) {
    const containerToRemove = dangerIDs[reportId];
    if (containerToRemove) {
      containerToRemove.remove();
      delete dangerIDs[reportId];
    }
  }

  // Questa funzione viene invocata nel momento in cui l'utente preme il bottone "Aggiungi"
  // Questa imposta la variabile "onMap" a TRUE, cosicché possa essere visualizzata
  // Sulla mappa

  function aggiorna(reportId) {
    const update = `/api/v1/dangers/${reportId}`;
    fetch(update, {
      method: 'PUT',
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error('Errore di rete');
        }
        console.log(`Pericolo con ID ${reportId} modificato con successo.`);
      })
      .catch((error) => {
        console.error('Errore durante la modifica:', error);
      });
  }
