const express = require('express');
const mongoose = require('mongoose');
var request = require('request');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();
const app = express();
const { PORT, DATABASE_URL } = require('./config.js');
mongoose.Promise = global.Promise;
const {Champions} = require('./models')
const championRouter = require('./championRouter');
app.use(express.static('public'));
app.use(cookieParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use('/lol', championRouter); 

app.get('/restaurants', (req, res) => {
    Champions
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
            (champions) => champions)
        });
      })
      .catch(err => {
        console.error(err);
        res.status(500).json({ message: 'Internal server error' });
      });
  });

//https://discussion.developer.riotgames.com/questions/2722/static-data-rate-limit-exceeded-bug.html
//ddragon as a way to cover the limit.. mm
//static limited to 10 req per hour
//You can make even simpler if you want - make 1 request to static data (to get a list of champions/runes/masteries or whatever you need) when the program starts. Store the response as a global variable (or at least something with a wide scope) and use that variable whenever needed.
function getJson(myid, callback) {
    // Set the headers
    var api_key = 'RGAPI-72911b64-a7ea-41d4-bd5f-f8537b184bf7';
    // var headers = {
    //     "Accept": "application/json",
    //     "Content-Type": "application/json",
    // }
    // Configure the request

    var options = {
        url: `https://na1.api.riotgames.com/lol/static-data/v3/champions?locale=en_US&tags=format&dataById=false&api_key=${api_key}`,
        method: 'GET',
        json: true
    }

    // Start the request
    request(options, function (error, response, body) {
        // console.log(response.statusCode);
        // console.log(response);
        if (!error && response.statusCode == 200) {
            callback(body);
        }
        else
            console.log("error:" + error);
    })
}
//create mongodb for it.  save it in mongo
//can this send post req to mongodb?
//we can have the link run if ddragon version and version on file does not match
// app.get('/test', function(req, res) {
//     getJson(req.params.id, function(data) {
//         console.log('here');
//         $.ajax({
//             type: 'POST',
//             url: '/lol',      
//             processData: false,
//             data: JSON.stringify(data),
//             contentType: "application/json",
//             success: res.send('ok')
//           })
//     });
// });

//we can just run a random endpoint off our original app that runs a get req to this server that asks riot servers for info
//put this inside of getjson in the app.get?
//change url to our own server link
// var myJSONObject = { ... };
// request({
//     url: "http://josiahchoi.com/myjson",
//     method: "POST",
//     json: true,   // <--Very important!!!
//     body: myJSONObject
// }, function (error, response, body){
//     console.log(response);
// });

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
