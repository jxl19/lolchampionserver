const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
mongoose.Promise = global.Promise;
const { Champions } = require('../models');
router.use(bodyParser.json());

router.get('/', (req,res) => {
    Champions
    .find()
    .exec()
    .then(champions => {
        console.log("username: " + recipes);
        res.status(200).json(recipes.map(recipes => recipes.allChamps()));   
    })
    .catch(err => {
        console.error(err);
        res.status(500).json({ error: 'Internal server error' });
    });
})

router.post('/', (req, res) => {
    console.log(req.body);
    Champions
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