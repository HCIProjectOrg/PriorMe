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
    var taskDaysLeft = [];

    var examPriority = 0;
    var homeworkPriority = 0;
    var projectPriority = 0;
    var researchPriority = 0;

    var query = firebase.database().ref("Task").orderByKey();

    query.once("value").then(

    //store task data from DB
    function(snapshot) {
        //get current date, we only want tasks that have not yet passed
        var today = new Date();
        var todayDay = Number(today.getDate());
        var todayMonth = Number((today.getMonth()+1));
        var todayYear = Number(today.getFullYear());
        snapshot.forEach(function(childSnapshot) {

            var taskDate = childSnapshot.val().Deadline.toString();
            taskDate += " ";
            var taskDateYear = Number(taskDate.substring(0,4));
            var taskDateMonth = Number(taskDate.substring(5,7));
            var taskDateDay = Number(taskDate.substring(8,10));


            //only push tasks that have not yet happened
            if(taskDateDay!=NaN && taskDateMonth!=NaN && taskDateYear!=NaN){
                //year is higher, so we want to display
                if(taskDateYear > todayYear){
                    taskKeys.push(childSnapshot.key);
                    taskNames.push(childSnapshot.val().Name);
                    taskDeadlines.push(childSnapshot.val().Deadline);
                    taskDetails.push(childSnapshot.val().Details);
                    taskHours.push(childSnapshot.val().Hours);
                    taskType.push(childSnapshot.val().TaskType);
                    taskDaysLeft.push( 365*(taskDateYear-todayYear) + 31*Math.abs(taskDateMonth-todayMonth) + Math.abs(taskDateDay-todayDay) );
                }else if(taskDateYear == todayYear && (taskDateMonth > todayMonth || (taskDateDay >= todayDay && taskDateMonth==todayMonth))){
                    /*
                    Task is in the current year AND:

                    The task in a future month
                    OR
                    The task is in the same month and future day
                    */
                    taskKeys.push(childSnapshot.key);
                    taskNames.push(childSnapshot.val().Name);
                    taskDeadlines.push(childSnapshot.val().Deadline);
                    taskDetails.push(childSnapshot.val().Details);
                    taskHours.push(childSnapshot.val().Hours);
                    taskType.push(childSnapshot.val().TaskType);
                    taskDaysLeft.push( 365*(taskDateYear-todayYear) + 31*Math.abs(taskDateMonth-todayMonth) + Math.abs(taskDateDay-todayDay) );
                }
            }
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
                }).then(

                    //sort tasks then displayed based on ordering
                    function(){
                        var minDays = 1000000000;

                        for(var i=0; i<taskKeys.length;i++){
                            if(taskDaysLeft[i]<minDays){
                                minDays = taskDaysLeft[i];
                            }
                        }

                        //associate priorities with given categories
                        for(var i=0; i<taskKeys.length; i++){
                            var priority;
                            if(taskType[i]=="exam"){
                                priority = examPriority;
                            }else if(taskType[i]=="homework"){
                                priority = homeworkPriority;
                            }else if(taskType[i]=="project"){
                                priority = projectPriority;
                            }else if(taskType[i]=="research"){
                                priority = researchPriority;
                            }else{
                                priority = 5;
                            }

                            //scale based on how much time is left, in comparison to the minimun number of days;
                            taskPriorities.push(priority * (1/Math.abs(taskDaysLeft[i]-minDays)));
                        }

                        //sort
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
                            '<p class="detailsPopUp">' + "Hours: "+ taskHours[i]  +'</p>' +
                            '<p class="detailsPopUp">' + "Type: "+ taskType[i]  +'</p>' +
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

// <<<<<<< HEAD

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



// // When the user clicks on <div>, open the popup
// function myFunction(keyID) {


//     console.log("KEYID: "+ keyID); 
//     //if yes send push notification
//     console.log("Alert1");
    
//     cordova.plugins.notification.local.hasPermission(function (granted) {
//         console.log('Permission has been granted: ' + granted);
//     });

//     // let notification = new apn.Notification();
//     // var popup = document.getElementById(keyID);
//     // popup.classList.toggle("show");
//     cordova.plugins.notification.local.schedule({
//         title: 'My first notification',
//         text: 'Thats pretty easy...',
//         foreground: true,
//         trigger: { in: 1, unit: 'second' }
//     });
//     console.log("Alert2"); 
//     // notification.alert = "Hello, world!";
//     // console.log("Alert2"); 
//     // notification.badge = 1;
//     // console.log("Alert3"); 
//     // notification.topic = "io.github.node-apn.test-app";
//     // console.log("Alert4"); 
//     // apnProvider.send(notification, deviceToken).then( (result) => {
//     //     console.log("YAYYY"); 
//     // });
//     // console.log("Alert5"); 
// // =======
// When the user clicks on <div>, open the popup
function myFunction(keyID) {
    var popup = document.getElementById(keyID);
    popup.classList.toggle("show");
// >>>>>>> 6feec06d0a5390477105c89e1fda49824cb8ae01
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

