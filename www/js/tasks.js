/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
"use strict";

// Shortcuts to DOM Elements.
var messageForm = document.getElementById('message-form');
var messageInput = document.getElementById('new-post-message');
var apn = require('apn');

var options = {
  token: {
    key: "js/APNsAuthKey_FY7JV87M7A.p8",
    cert:"aps_development.cer",
    keyId: "FY7JV87M7A",
    teamId: "UE6S3WWHDC"
  },
  proxy: {
    host: "10.0.1.45",
    port: 3000
  },
  production: false
};

var deviceToken = "6ba9156b77ca416f158c2bcfc4d8d6897101461ebe8fa246d29bf25a91e58373";
var myDevice = new apn.Device(deviceToken);
let apnProvider = new apn.Provider(options);


var app = {
    // Application Constructor
    initialize: function() {
        document.addEventListener('deviceready', this.onDeviceReady.bind(this), false);
    },

    // deviceready Event Handler
    //
    // Bind any cordova events here. Common events are:
    // 'pause', 'resume', etc.
    onDeviceReady: function() {
        this.receivedEvent('deviceready');
    },

    // Update DOM on a Received Event
    receivedEvent: function(id) {
        var parentElement = document.getElementById(id);
        var listeningElement = parentElement.querySelector('.listening');
        var receivedElement = parentElement.querySelector('.received');

        listeningElement.setAttribute('style', 'display:none;');
        receivedElement.setAttribute('style', 'display:block;');

        console.log('Received Event: ' + id);
    }
};

app.initialize();


/**
 * Starts listening for new posts and populates posts lists.
 */
function startDatabaseQueries() {
    var tasknumber = 0; 
    var tasks = [];
    var query = firebase.database().ref("Task").orderByKey();
    query.once("value").then(function(snapshot) {
        snapshot.forEach(function(childSnapshot) {
            tasknumber++;
            var key = childSnapshot.key;

            var pnl = document.getElementById("mainDiv");
            var taskDiv = document.createElement("div");
            taskDiv.id = key;

             var keyString = key.toString();
             var popUpKey = "P"+keyString;
             // console.log("popUpKey: " + popUpKey);
            // childSnapshot.val().Hours
            // taskDiv.innerHTML = tasknumber + " " + childSnapshot.key +  " Due Date: " + childSnapshot.val().Deadline ;

            var html = 
            '<div class="task" onclick=myFunction(\'' + popUpKey + '\')>'+ 
                    '<div class="popuptext" id='+popUpKey+'>' + 
                        '<div class="popupName" >' + 
                            '<p class="namePopUp">' + childSnapshot.val().Name +'</p>' +
                        '</div>'+
                        '<p class="deadlinePopUp">' + "Due: "+ childSnapshot.val().Deadline  +'</p>' +
                        '<p class="detailsPopUp">' + "Details: "+ childSnapshot.val().Details  +'</p>' +
                    '</div>'+
                    '<label class="tasknumberLabel">' + tasknumber + " "+ '</label>' +
                    '<label class="nameLabel">' + childSnapshot.val().Name   +'</label>' +
                    '</br>'+
                    '<label class="deadlineLabel">' + "Due: "+ childSnapshot.val().Deadline  +'</label>' +
            '</div>';

            taskDiv.innerHTML = html;
            pnl.appendChild(taskDiv);

            dueDate(childSnapshot.val().Deadline);
            tasks.push(childSnapshot.val().Deadline);
            console.log("alert1");
            console.log(tasks[0]);
            console.log("alert2");
        });
    });
}  


    // firebase.database().ref('Task').once('value').then(function(snapshot) {
    //     var name = snapshot.key() || 'Anonymous';
    //     document.getElementById('nameLabel').innerText = name;
    //     var deadline = snapshot.val().Deadline || 'Anonymous';
    //     document.getElementById('deadlineLabel').innerText = deadline;
    //     var hours = snapshot.val().Hours || 'Anonymous';
    //     document.getElementById('hoursLabel').innerText = hours;
    //     var type = snapshot.val().TaskType || 'Anonymous';
    //     document.getElementById('taskTypeLabel').innerText = type;
    // });

    // firebase.database().ref('Task/HomeWork1').once('value').then(function(snapshot) {
    //     var name = snapshot.val().Hours || 'Anonymous';
    //     document.getElementById('hoursLabel').innerText = name;
    //     var deadline = snapshot.val().Deadline || 'Anonymous';
    //     document.getElementById('deadlineLabel').innerText = deadline;
    //     var hours = snapshot.val().Hours || 'Anonymous';
    //     document.getElementById('hoursLabel').innerText = hours;
    //     var type = snapshot.val().TaskType || 'Anonymous';
    //     document.getElementById('taskTypeLabel').innerText = type;
    // });

// When the user clicks on <div>, open the popup
function myFunction(keyID) {
    console.log("KEYID: "+ keyID); 
    //if yes send push notification
    console.log("Alert1");
    let notification = new apn.Notification();
    var popup = document.getElementById(keyID);
    popup.classList.toggle("show");
    console.log("Alert2"); 
    // notification.alert = "Hello, world!";
    // console.log("Alert2"); 
    // notification.badge = 1;
    // console.log("Alert3"); 
    // notification.topic = "io.github.node-apn.test-app";
    // console.log("Alert4"); 
    // apnProvider.send(notification, deviceToken).then( (result) => {
    //     console.log("YAYYY"); 
    // });
    // console.log("Alert5"); 
}

//check if task is due tomorrow
function dueDate(Deadline){
    //get tomorrow's date
    var today = new Date();
    var tomorrow = new Date(today.getTime() + (24 * 60 * 60 * 1000));
    var year = tomorrow.getFullYear();
    var month = tomorrow.getMonth()+1;
    if (month < 10){
        month = "0"+month;
    }
    var day = tomorrow.getDate();
    var check = year + "-" + month + "-"+ day;

    //see if the dates are equal
    if(Deadline == check){
        console.log("SOMETHING'S DUE TOMORROW");
    }
}

