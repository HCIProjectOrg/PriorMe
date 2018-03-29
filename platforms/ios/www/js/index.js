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
// var messageForm = document.getElementById('message-form');
// var messageInput = document.getElementById('new-post-message');

/*
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
*/

var app = {
    // Application Constructor
    initialize: function() {
        console.log('In here 1');
        this.bindEvents();
        console.log('In here 2');
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        console.log('In here 3');
        document.addEventListener('deviceready', this.onDeviceReady, false);
        console.log('In here 4');
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        console.log('Received Device Ready Event');
        console.log('calling setup push');
        app.setupPush();
    },
    setupPush: function() {
        console.log('calling push init');
        var push = PushNotification.init({
            "android": {
                "senderID": "XXXXXXXX"
            },
            "browser": {},
            "ios": {
                "sound": true,
                "vibration": true,
                "badge": true
            },
            "windows": {}
        });
        console.log('after init');

        push.on('registration', function(data) {
            console.log('registration event: ' + data.registrationId);

            var oldRegId = localStorage.getItem('registrationId');
            if (oldRegId !== data.registrationId) {
                // Save new registration ID
                localStorage.setItem('registrationId', data.registrationId);
                // Post registrationId to your app server as the value has changed
            }

            var parentElement = document.getElementById('registration');
            var listeningElement = parentElement.querySelector('.waiting');
            var receivedElement = parentElement.querySelector('.received');

            listeningElement.setAttribute('style', 'display:none;');
            receivedElement.setAttribute('style', 'display:block;');
        });

        push.on('error', function(e) {
            console.log("push error = " + e.message);
        });

        push.on('notification', function(data) {
            console.log('notification event');
            navigator.notification.alert(
                data.message,         // message
                null,                 // callback
                data.title,           // title
                'Ok'                  // buttonName
            );
       });
    }
};

// app.initialize();

// // Saves message on form submit.
// messageForm.onsubmit = function(e) {
//     e.preventDefault();
//     var text = messageInput.value;
//     if (text) {
//         newPostForCurrentUser(text).then(function() {
//             myPostsMenuButton.click();
//         });
//         messageInput.value = '';
//         titleInput.value = '';
//     }
// };

// /**
//  * Creates a new post for the current user.
// */
// function newPostForCurrentUser(title, text) {
//     // [START single_value_read]
//     var userId = firebase.auth().currentUser.uid;
//     return firebase.database().ref('/users/' + userId).once('value').then(function(snapshot) {
//       var username = (snapshot.val() && snapshot.val().username) || 'Anonymous';
//       // [START_EXCLUDE]
//       return writeNewPost(firebase.auth().currentUser.uid, username,
//                           firebase.auth().currentUser.photoURL,
//                           title, text);
//       // [END_EXCLUDE]
//       });
//     // [END single_value_read]
// }

// /**
//  * Saves a new post to the Firebase DB.
//  */
// // [START write_fan_out]
// function writeNewPost(uid, username, picture, title, body) {
//     // A post entry.
//     var postData = {
//     author: username,
//     uid: uid,
//     body: body,
//     title: title,
//     starCount: 0,
//     authorPic: picture
//     };
