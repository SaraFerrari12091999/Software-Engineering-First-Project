const express = require('express');
const router = express.Router();
const Danger = require('./models/danger'); // get our mongoose model
const User = require('./models/user');


const Pericolo = {
    Orsi: "orso",
    Incendi: "incendio",
    Valanghe: "valanga",
    Caccia: "zona di caccia"
  }

  // stampa di TUTTI i pericoli, indipendentemente dal tipo.
  router.get('', async (req, res) => {
    let dangers; //= await User.find();

        dangers = await Danger.find();


        dangers = dangers.map((entry) => ({
          self: '/api/v1/dangers/' + entry.id,
          id: entry.id,
          type: entry.type,
          latitude: entry.latitude,
          longitude: entry.longitude,
          segnalazioni: entry.segnalazioni,
          onMap: entry.onMap
      }));

    return res.status(200).json(dangers);
    
});


// stampa dei pericoli, in base al tipo di pericolo.
router.get('/:type', async (req, res) => {
    const tipoPericolo = req.params.type;
    console.log(tipoPericolo);
  
    try {
      let dangers = await Danger.find({ type: tipoPericolo });
      //res.json(dangers);
      dangers = dangers.map((entry) => ({
        self: '/api/v1/dangers/' + entry.id,
        type: entry.type,
        latitude: entry.latitude,
        longitude: entry.longitude
    }));

    return res.status(200).json(dangers);
    } catch (error) {
    res.status(500).json({ error: 'Si è verificato un errore durante la ricerca dei pericoli.' });
    }

  });

  //identificazione di un pericolo in base al suo ID
  router.get('/:id', async (req, res) => {
    let dangers = await Danger.findById(req.params.id);
    try{
        console.log(dangers.type);
        return res.status(200).json({
            self: '/api/v1/users/' + dangers.id,
            type: dangers.type,
            latitude: dangers.latitude,
            longitude: dangers.longitude
        });

    } catch (error) {
        res.status(500).json({ error: 'Si è verificato un errore durante la ricerca dei pericoli.' });
    }
    
  });

  // inserimento di un nuovo pericolo
  router.post('', async(req,res) => {
    const tipo = req.body.type;

    if(tipo != Pericolo.Orsi && tipo != Pericolo.Incendi && tipo != Pericolo.Valanghe && tipo != Pericolo.Caccia){
        return res.status(500).json({ error: 'Si è verificato un errore durante la ricerca dei pericoli.' });
    }

    const latitude = req.body.latitude;
    const longitude = req.body.longitude;

    console.log("TIPO = " + tipo);
    console.log("LATITUDE = " + latitude);
    console.log("LONGITUDE = " + longitude);
  
    const findDanger = await Danger.findOne({type: tipo, latitude: latitude, longitude: longitude});
  
    if(!findDanger) {
        const newDanger = await Danger.create(req.body);
        console.log("Danger Added Succesfully!");
        await Danger.updateOne({ _id: newDanger._id }, { $inc: { segnalazioni: 1 } });
    } else {
        await Danger.updateOne({ _id: findDanger._id }, { $inc: { segnalazioni: 1 } });
    }

    return res.status(200).json({prova: 'Pericolo aggiunto'});

  });

  
  router.put('/:id', async(req,res) => {

    const id = req.params.id;
  
    const findDanger = await Danger.findById(id);
  
    if(!findDanger) {
      return res.status(404).json({ prova: 'Pericolo non trovato' });
    } else {
        await Danger.updateOne({ _id: findDanger._id }, {$set: {onMap: !findDanger.onMap} });
    }

    return res.status(200).json({prova: 'Pericolo aggiunto'});

  });


  // cancellazione di un pericolo
  router.delete('/:id', async (req, res) => {
    let dangers = await Danger.findById(req.params.id);
    if (!dangers) {
        res.status(404).send()
        console.log('Danger not found')
        return;
    }
    await dangers.deleteOne()
    console.log('Danger removed!')
    res.status(204).send()
});

  module.exports = router;