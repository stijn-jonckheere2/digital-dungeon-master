const firebase = require('firebase');

// server.js
const express = require('express');
const app = express();
const path = require('path');
const cron = require('cron');
const http = require('http');
const uuidv1 = require("uuid").v1;

const cronUser = 'cronjob@ddm.be';
const cronPassword = 'Cr0nj0b2017!';
var cronToken = "";

/*firebase.initializeApp({
  apiKey: "AIzaSyA8J2ryEam-6m4WAoM3k1CT75ylhQPUWLQ",
  authDomain: "digital-dungeon-master.firebaseapp.com",
  databaseURL: "https://digital-dungeon-master.firebaseio.com",
  projectId: "digital-dungeon-master",
  storageBucket: "digital-dungeon-master.appspot.com",
  messagingSenderId: "165971576370",
});

  // firebase.initializeApp({
  //   apiKey: "AIzaSyBqhxlpbErCF557lZd0-0qsXPubgMZzC_4",
  //   authDomain: "digital-dungeon-master-dev.firebaseapp.com",
  //   databaseURL: "https://digital-dungeon-master-dev.firebaseio.com",
  //   projectId: "digital-dungeon-master-dev",
  //   storageBucket: "digital-dungeon-master-dev.appspot.com",
  //   messagingSenderId: "259994406067"
  // });

// Automated jobs

var job1 = new cron.CronJob({
  cronTime: '00 30 23 * * 5',
  // cronTime: '10 * * * * *',
  onTick: function () {
    console.log('Adding a new story recap...');

    firebase.auth().signInWithEmailAndPassword(cronUser, cronPassword).then(
      (response) => {
        firebase.auth().currentUser.getIdToken()
          .then(
          (token) => {
            console.log('Authenticated with firebase');
            createNewRecap();
          }
          );
      })
      .catch(
      error => console.log("Auth failed for cronuser", error)
      );
  },
  start: true,
});

function createNewRecap() {
  const recap = {
    "id": uuidv1().toString(),
    "createdBy": "cronUser",
    "createdOn": new Date().toISOString(),
    "modifiedBy": "cronUser",
    "modifiedOn": new Date().toISOString(),
    "recap": ""
  };

  var ref = firebase.database().ref().child("/recaps/" + recap.id + "-recap");

  ref.set(recap, function(response){
    console.log("Response from firebase:", response);
  });

}*/

// Run the app by serving the static files
// in the dist directory
app.use(express.static(__dirname + '/dist'));

// For all GET requests, send back index.html
// so that PathLocationStrategy can be used
app.get('/*', function (req, res) {
  res.sendFile(path.join(__dirname + '/dist/index.html'));
});

// Start the app by listening on the default
// Heroku port
app.listen(process.env.PORT || 8080);