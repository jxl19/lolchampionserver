const express = require('express');
const mongoose = require('mongoose');
var request = require('request');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const app = express();
const { PORT, DATABASE_URL } = require('./config.js');
mongoose.Promise = global.Promise;
const { Champion } = require('./models')
const championRouter = require('./championRouter');
app.use(express.static('public'));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Content-Type,Authorization');
    res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE');
    if (req.method === 'OPTIONS') {
      return res.send(204);
    }
    next();
  });

app.use('/lol', championRouter);

app.get('/champion', (req, res) => {
    Champion
        .find()
        .then(champions => {
            res.json({
                champions: champions.map(
                    (champions) => champions)
            });
        })
        .catch(err => {
            console.error(err);
            res.status(500).json({ message: 'Internal server error' });
        });
});

let server;

function runServer(databaseUrl = DATABASE_URL, port = PORT) {
    return new Promise((resolve, reject) => {
        mongoose.connect(databaseUrl, err => {
            if (err) {
                return reject(err);
            }
            server = app.listen(port, () => {
                console.log(`Server started on port: ${port}`);
                console.log(databaseUrl);
                resolve();
            })
                .on('error', err => {
                    reject(err);
                });
        });
    });
}

function closeServer() {
    return mongoose.disconnect().then(() => {
        return new Promise((resolve, reject) => {
            console.log('Closing server');
            server.close(err => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve();
            });
        });
    });
}

if (require.main === module) {
    runServer().catch(err => console.error(err));
}

module.exports = { app, runServer, closeServer };
