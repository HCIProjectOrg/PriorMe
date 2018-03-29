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

//settings 
var examStudy = "0";
var examStress = "0";
var hwStudy = "0";
var hwStress = "0";
var projectStudy = "0";
var projectStress = "0";
var researchStudy = "0";
var researchStress = "0";



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
Settingsform.onsubmit = function(e) {
    //get values from radio buttons
    // console.log(isChecked(examStudy));
    // console.log(isChecked(examStress));
    examStudy = isChecked('examStudy');
    examStress = isChecked('examStress');
    hwStudy = isChecked('hwStudy');
    hwStress = isChecked('hwStress');
    projectStudy = isChecked('projectStudy');
    projectStress = isChecked('projectStress');
    researchStudy = isChecked('researchStudy');
    researchStress = isChecked('researchStress');

    var exam = Number(examStudy)+Number(examStress);
    var hw = Number(hwStudy)+Number(hwStress);
    var project = Number(projectStudy)+Number(projectStress);
    var research = Number(researchStudy)+Number(researchStress);

    updatePriorities(exam, hw, project, research).then(function() {});  
};

/*Saves a new message to the Firebase DB.*/
function updatePriorities(exam, hw, proj, research) {
    firebase.database().ref('Priorities').update({
        examPriority: exam,
        homeworkPrioirity: hw,
        projectPriority: proj,
        researchPriority: research
    });
}

function isChecked(checkboxName){
    var submittedVal = document.getElementsByName(checkboxName);
    var submitted = "0";
    for(var i = 0; i < submittedVal.length; i++){
        if(submittedVal[i].checked){
            submitted = submittedVal[i].value;
            console.log(submitted); 
            return submitted;
        }
    }
}
