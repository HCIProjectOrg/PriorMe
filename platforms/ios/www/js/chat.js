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

// Shortcuts to DOM Elements.
var messageForm = document.getElementById('message-form');
var messageInput = document.getElementById('new-post-message');

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

// Saves message on form submit.
messageForm.onsubmit = function(e) {
    e.preventDefault();
    var text = messageInput.value;
    if (text) {
        writeNewPost(text).then(function() {});  
    }
    messageInput.value = '';
};

/*Saves a new message to the Firebase DB.*/
function writeNewPost(body) {
   	var d = new Date();
    var sender = "user";
   	var date = d.toString();
    firebase.database().ref('Messages').push({
	    [d]: body,
        Sent: date,
        Sender: sender,
        Message: body
	});
    getNewUpdate();
}

function startDatabaseQueries() {
    var tasknumber = 0; 
    var query = firebase.database().ref("Messages").orderByKey();
    query.once("value").then(function(snapshot) {
    snapshot.forEach(function(childSnapshot) {
        tasknumber++;
        var key = childSnapshot.key;
        var pnl = document.getElementById("messages");
        var taskDiv = document.createElement("div");
        taskDiv.id = "divDyna";

            if(childSnapshot.val().Sender  == "user"){
                var html = 
                '<div class="chatMessage user" id="chatMessage">'+ 
                    //Date
                    '<p id="dateParagrah">' + childSnapshot.val().Sent  +'</p>' +
                    //Sender
                    '<p id="senderParagrah">' + childSnapshot.val().Sender  +'</p>' +
                    //Message
                    '<p id="messageParagrah">' + childSnapshot.val().Message  +'</p>' +
                '</div>';

                taskDiv.innerHTML = html;
                pnl.appendChild(taskDiv);
                
            }
            else{
                var html = 
                '<div class="chatMessage bot" id="chatMessage">'+ 
                    //Date
                    '<p id="dateParagrah">' + childSnapshot.val().Sent  +'</p>' +
                    //Sender
                    '<p id="senderParagrah">' + childSnapshot.val().Sender  +'</p>' +
                    //Message
                    '<p id="messageParagrah">' + childSnapshot.val().Message  +'</p>' +
                '</div>';

                taskDiv.innerHTML = html;
                pnl.appendChild(taskDiv);   
            }
        });
    });
}

function getNewUpdate(){
    var query = firebase.database().ref("Messages").orderByKey();
    query.once("child_added", function(snapshot) {
        var newPost = snapshot.val();

        var pnl = document.getElementById("mainDiv");
        var taskDiv = document.createElement("div");
        taskDiv.id = "divDyna";

        var html = 
        '<div class="chatMessage">'+ 
            //Date
            '<p id="dateParagrah">' + newPost.Sent  +'</p>' +
            //Sender
            '<p id="senderParagrah">' + newPost.Sender  +'</p>' +
            //Message
            '<p id="messageParagrah">' + newPost.Message  +'</p>' +
        '</div>';

        taskDiv.innerHTML = html;
        pnl.appendChild(taskDiv);
    }); 
}

  function startDictation() {

    if (window.hasOwnProperty('webkitSpeechRecognition')) {

      var recognition = new webkitSpeechRecognition();

      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.lang = "en-US";
      recognition.start();

      recognition.onresult = function(e) {
        console.log(e.results[0][0].transcript);
        document.getElementById('new-post-message').value = e.results[0][0].transcript;
        recognition.stop();
        document.getElementById('message-form').submit();
      };

      recognition.onerror = function(e) {
        recognition.stop();
      }

    }
  }
