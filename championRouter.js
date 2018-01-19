const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
mongoose.Promise = global.Promise;
const { Champion } = require('./models');
router.use(bodyParser.json());

router.get('/', (req,res) => {
    Champion
    .find()
    .exec()
    .then(champions => {
        console.log("username: " + champions);
        res.status(200).json(champions.map(champions => champions.allChamps()));   
    })
    .catch(err => {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    });
})


router.get('/restaurants', (req, res) => {
    Champion
      .find()
      // we're limiting because restaurants db has > 25,000
      // documents, and that's too much to process/return
      .limit(10)
      // success callback: for each restaurant we got back, we'll
      // call the `.serialize` instance method we've created in
      // models.js in order to only expose the data we want the API return.
      .then(champions => {
          console.log(champions);
        res.json({
            champions: champions.map(
            (champions) => champions.allChamps())
        });
      })
      .catch(err => {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
      });
  });

router.post('/', (req, res) => {
    console.log(req.body);
    Champion
        .create({
            type: req.body.type,
            format: req.body.format,
            version: req.body.version,
            data: req.body.data,
        })
        .then(champions => {
            res.status(201).json(champions.allChamps());
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({ error: 'Something went wrong' });
        });
});

module.exports = router;