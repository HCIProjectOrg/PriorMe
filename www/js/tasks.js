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


/**
 * Starts listening for new posts and populates posts lists.
 */
 function startDatabaseQueries() {
    var tasknumber = 0; 
    var taskKeys = [];
    var taskNames = [];
    var taskDeadlines = [];
    var taskDetails = [];
    var taskType = [];
    var taskHours = [];
    var taskPriorities =[];

    var examPriority = 0;
    var homeworkPriority = 0;
    var projectPriority = 0;
    var researchPriority = 0;


    var query = firebase.database().ref("Task").orderByKey();

    query.once("value").then(

    //store task data from DB
    function(snapshot) {
        snapshot.forEach(function(childSnapshot) {
            //console.log("TASK");
            taskKeys.push(childSnapshot.key);
            taskNames.push(childSnapshot.val().Name);
            taskDeadlines.push(childSnapshot.val().Deadline);
            taskDetails.push(childSnapshot.val().Details);
            taskHours.push(childSnapshot.val().Hours);
            taskType.push(childSnapshot.val().TaskType);
            //console.log(taskKeys[0]);
            //console.log(taskNames[0]);
            //console.log(taskDeadlines[0]);
            //console.log(taskDetails[0]);
            //console.log(taskHours[0]);
            //console.log(taskType[0]);
        });
    }).then(

    //get priority data from DB
    function(){
        var query2 = firebase.database().ref("Priorities");
        query2.once("value").then(

            function(snapshot){
                examPriority = snapshot.val().examPriority;
                homeworkPriority = snapshot.val().homeworkPrioirity;
                projectPriority = snapshot.val().projectPriority;
                researchPriority = snapshot.val().researchPriority;
            }

            ).then(

            //sort tasks then displayed based on ordering
            function(){
                //associate priorities with given categories
                for(var i=0; i<taskKeys.length; i++){
                    if(taskType[i]=="exam"){
                        taskPriorities.push(examPriority);
                    }else if(taskType[i]=="homework"){
                        taskPriorities.push(homeworkPriority);
                    }else if(taskType[i]=="project"){
                        taskPriorities.push(projectPriority);
                    }else if(taskType[i]=="research"){
                        taskPriorities.push(researchPriority);
                    }else{
                        taskPriorities.push(5);
                    }
                }

                for(var i=0; i<taskPriorities.length; i++){
                    for(var j = 0; j<taskPriorities.length; j++){
                        if(taskPriorities[i]>taskPriorities[j]){
                            var temp = taskDeadlines[i];
                            taskDeadlines[i] = taskDeadlines[j];
                            taskDeadlines[j] = temp;

                            temp = taskKeys[i];
                            taskKeys[i] = taskKeys[j];
                            taskKeys[j] = temp;

                            temp = taskHours[i];
                            taskHours[i] = taskHours[j];
                            taskHours[j] = temp;

                            temp = taskNames[i];
                            taskNames[i] = taskNames[j];
                            taskNames[j] = temp;

                            temp = taskDetails[i];
                            taskDetails[i] = taskDetails[j];
                            taskDetails[j] = temp;

                            temp = taskType[i];
                            taskType[i] = taskType[j];
                            taskType[j] = temp;

                            temp = taskPriorities[i];
                            taskPriorities[i] = taskPriorities[j];
                            taskPriorities[j] = temp;
                        }
                    }
                }
                
                //display
                for(var i=0; i<taskKeys.length; i++){
                    tasknumber++;
                    var key = taskKeys[i];

                    var pnl = document.getElementById("mainDiv");
                    var taskDiv = document.createElement("div");
                    taskDiv.id = key;

                    var keyString = key.toString();
                    var popUpKey = "P"+keyString;

                    var html = 
                    '<div class="task" onclick=myFunction(\'' + popUpKey + '\')>'+ 
                    '<div class="popuptext" id='+popUpKey+'>' + 
                    '<div class="popupName" >' + 
                    '<p class="namePopUp">' + taskNames[i] +'</p>' +
                    '</div>'+
                    '<p class="deadlinePopUp">' + "Due: "+ taskDeadlines[i]  +'</p>' +
                    '<p class="detailsPopUp">' + "Details: "+ taskDetails[i]  +'</p>' +
                    '</div>'+
                    '<label class="tasknumberLabel">' + tasknumber + " "+ '</label>' +
                    '<label class="nameLabel">' + taskNames[i]  +'</label>' +
                    '</br>'+
                    '<label class="deadlineLabel">' + "Due: "+ taskDeadlines[i]  +'</label>' +
                    '</div>';

                    taskDiv.innerHTML = html;
                    pnl.appendChild(taskDiv);
                }
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
    var popup = document.getElementById(keyID);
    popup.classList.toggle("show");
}
