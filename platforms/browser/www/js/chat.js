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
var oldDate = "date check";

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
   	var date = d.toDateString();
    var time = d.toLocaleTimeString();
    firebase.database().ref('Messages').push({
	    [d]: body,
        Date: date,
        Time: time,
        Sender: sender,
        Message: body
	});
    getNewUpdate();
    var textbox = document.getElementById("new-post-message");
    textbox.value="";
}

function startDatabaseQueries() {
    var tasknumber = 0; 
    var query = firebase.database().ref("Messages").orderByKey();
    query.once("value").then(function(snapshot) {
    snapshot.forEach(function(childSnapshot) {
        tasknumber++;
        var key = childSnapshot.key;
        var mDiv = document.getElementById("messages");
        var taskDiv = document.createElement("div");
        var html = "";
        taskDiv.class = "messageDiv";

        //check for dates
        if(oldDate == childSnapshot.val().Date){
            //don't print the new date
        }
        else{
            //add new date
            html = 
            '<div class="dayStamp">'+ 
                //Day
                '<p class="dayLabel">' + childSnapshot.val().Date  +'</p>' +
            '</div>'; 
        }

        if(childSnapshot.val().Sender  == "user"){
            html = html + 
            '<div class="chatMessage user">'+ 
                //Date
                '<p class="dateParagrahUser">' + childSnapshot.val().Time  +'</p>' +
                '<div class= chatbotMessage >'+
                    //Sender
                    // '<p class="senderParagrah">' + childSnapshot.val().Sender +": " +'</p>' +
                    //Message
                    '<p class="messageParagrah">' + childSnapshot.val().Message  +'</p>' +
                '</div>'+
            '</div>';
        }
        else{
            html = html +  
            '<div class="chatMessage bot">'+ 
                //Date
                '<p class="dateParagrahBot">' + childSnapshot.val().Time  +'</p>' +
                '<div class= chatbotMessage >'+
                    //Sender
                    // '<p class="senderParagrah">' + childSnapshot.val().Sender +": " +'</p>' +
                    //Message
                    '<p class="messageParagrah">' + childSnapshot.val().Message  +'</p>' +
                '</div>'+
            '</div>';  
        }

        oldDate = childSnapshot.val().Date;
        taskDiv.innerHTML = html;   
        mDiv.appendChild(taskDiv);
        });
    });
}

function getNewUpdate(){
    var query = firebase.database().ref("Messages").orderByKey();
    query.once("child_added", function(snapshot) {
        var newPost = snapshot.val();

        var mDiv = document.getElementById("messages");
        var taskDiv = document.createElement("div");
        taskDiv.class = "messageDiv";
        var html = "";
        
        //check for dates
        if(oldDate == newPost.Date){
            //don't print the new date
        }
        else{
            //add new date
            html = 
            '<div class="dayStamp">'+ 
                //Day
                '<p class="dayLabel">' + newPost.Date  +'</p>' +
            '</div>';
            oldDate = newPost.Date;
        }

        html = html + 
        '<div class="chatMessage user">'+ 
            //Date
            '<p class="dateParagrahUser">' + newPost.Time  +'</p>' +
            '<div class= chatbotMessage >'+
                //Sender
                // '<p class="senderParagrah">' + newPost.Sender  +'</p>' +
                //Message
                '<p class="messageParagrah">' + newPost.Message  +'</p>' +
            '</div>'+
        '</div>';

        taskDiv.innerHTML = html;
        mDiv.appendChild(taskDiv);
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
