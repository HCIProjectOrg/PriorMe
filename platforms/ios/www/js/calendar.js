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

/*Get date and day*/
function getDate() {
    var d = new Date();
    var n = d.getDate();
    document.getElementById("date").innerHTML = n;
}

function getDay() {
    var d = new Date();
    var weekday = new Array(7);
    weekday[0] = "Sun";
    weekday[1] = "Mon";
    weekday[2] = "Tues";
    weekday[3] = "Wed";
    weekday[4] = "Thur";
    weekday[5] = "Fri";
    weekday[6] = "Sat";

    var n = weekday[d.getDay()];
    document.getElementById("day").innerHTML = n;
}



/**
 * Starts listening for new posts and populates posts lists.
 */
function startDatabaseQueries() {
    var tasknumber = 0; 

    var query = firebase.database().ref("Task").orderByKey();
    query.once("value").then(function(snapshot) {
        snapshot.forEach(function(childSnapshot) {
            tasknumber++;
            var key = childSnapshot.key;

            var pnl = document.getElementById("tasksDiv");
            var taskDiv = document.createElement("div");
            taskDiv.id = key;

             var keyString = key.toString();
             var popUpKey = "P"+keyString;
             console.log("popUpKey: " + popUpKey);
            // childSnapshot.val().Hours
            // taskDiv.innerHTML = tasknumber + " " + childSnapshot.key +  " Due Date: " + childSnapshot.val().Deadline ;

            var html = 
            '<div class="task" onclick=myFunction(\'' + popUpKey + '\')>'+ 
                    '<div class="popuptext" id='+popUpKey+'>' + 
                        '<div class="popupName" >' + 
                            '<p class="namePopUp">' + childSnapshot.key +'</p>' +
                        '</div>'+
                        '<p class="deadlinePopUp">' + "Due: "+ childSnapshot.val().Deadline  +'</p>' +
                        '<p class="detailsPopUp">' + "Details: "+ childSnapshot.val().Details  +'</p>' +
                    '</div>'+
                    '<label class="nameLabel">' + childSnapshot.key  +'</label>' +
            '</div>';

            taskDiv.innerHTML = html;
            pnl.appendChild(taskDiv);
        });
    });
}  

// When the user clicks on <div>, open the popup
function myFunction(keyID) {
    console.log("KEYID: "+ keyID); 
    var popup = document.getElementById(keyID);
    popup.classList.toggle("show");
}



// Saves message on form submit.
messageForm.onsubmit = function(e) {
    e.preventDefault();
    var text = messageInput.value;
    if (text) {
        writeNewPost(text).then(function() {});  
    }
    messageInput.value = '';
};

// Client ID and API key from the Developer Console
      var CLIENT_ID = '1029062203310-91m7cn0eivp6rvtnoiv2mh3kr8g6heso.apps.googleusercontent.com';
      var API_KEY = 'AIzaSyDmf_3DwfR_4ScXV8sYZPcoUQtI65yIq2s';

      // Array of API discovery doc URLs for APIs used by the quickstart
      var DISCOVERY_DOCS = ["https://www.googleapis.com/discovery/v1/apis/calendar/v3/rest"];

      // Authorization scopes required by the API; multiple scopes can be
      // included, separated by spaces.
      var SCOPES = "https://www.googleapis.com/auth/calendar.readonly";

      var authorizeButton = document.getElementById('authorize-button');
      var signoutButton = document.getElementById('signout-button');

      /**
       *  On load, called to load the auth2 library and API client library.
       */
      function handleClientLoad() {
        gapi.load('client:auth2', initClient);
      }

      /**
       *  Initializes the API client library and sets up sign-in state
       *  listeners.
       */
      function initClient() {
        gapi.client.init({
          apiKey: API_KEY,
          clientId: CLIENT_ID,
          discoveryDocs: DISCOVERY_DOCS,
          scope: SCOPES
        }).then(function () {
          // Listen for sign-in state changes.
          gapi.auth2.getAuthInstance().isSignedIn.listen(updateSigninStatus);

          // Handle the initial sign-in state.
          updateSigninStatus(gapi.auth2.getAuthInstance().isSignedIn.get());
          authorizeButton.onclick = handleAuthClick;
          signoutButton.onclick = handleSignoutClick;
        });
      }

      /**
       *  Called when the signed in status changes, to update the UI
       *  appropriately. After a sign-in, the API is called.
       */
      function updateSigninStatus(isSignedIn) {
        if (isSignedIn) {
          // authorizeButton.style.display = 'none';
          // signoutButton.style.display = 'block';
          listUpcomingEvents();
        } else {
          // authorizeButton.style.display = 'block';
          // signoutButton.style.display = 'none';
        }
      }

      /**
       *  Sign in the user upon button click.
       */
      function handleAuthClick(event) {
        gapi.auth2.getAuthInstance().signIn();
      }

      /**
       *  Sign out the user upon button click.
       */
      function handleSignoutClick(event) {
        gapi.auth2.getAuthInstance().signOut();
      }

      /**
       * Append a pre element to the body containing the given message
       * as its text node. Used to display the results of the API call.
       *
       * @param {string} message Text to be placed in pre element.
       */
      function appendPre(message) {
        var pre = document.getElementById('content');
        var textContent = document.createTextNode(message + '\n');
        pre.appendChild(textContent);
      }

      /**
       * Print the summary and start datetime/date of the next ten events in
       * the authorized user's calendar. If no events are found an
       * appropriate message is printed.
       */
      function listUpcomingEvents() {
        gapi.client.calendar.events.list({
          'calendarId': 'primary',
          'timeMin': (new Date()).toISOString(),
          'showDeleted': false,
          'singleEvents': true,
          'maxResults': 10,
          'orderBy': 'startTime'
        }).then(function(response) {
          var events = response.result.items;
          appendPre('Upcoming events:');

          if (events.length > 0) {
            for (i = 0; i < events.length; i++) {
              var event = events[i];
              var when = event.start.dateTime;
              if (!when) {
                when = event.start.date;
              }
              appendPre(event.summary + ' (' + when + ')')
            }
          } else {
            appendPre('No upcoming events found.');
          }
        });
      }