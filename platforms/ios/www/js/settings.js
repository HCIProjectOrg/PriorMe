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

//saved Settings
var savedexamStudy = "0";
var savedexamStress = "0";
var savedhwStudy = "0";
var savedhwStress = "0";
var savedprojectStudy = "0";
var savedprojectStress = "0";
var savedresearchStudy = "0";
var savedresearchStress = "0";


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

function getSettings(){
    var query = firebase.database().ref("Settings").orderByKey();
    query.once("value", function(snapshot) {
        var name = snapshot.val().Name;
        var email = snapshot.val().Email;
        // document.getElementById("name").innerHTML = "Jesse";
        //document.getElementById("email").innerHTML = email;
    });

    //change setting values 
    var query2 = firebase.database().ref("Priorities").orderByKey();
        query2.once("value", function(snapshot) {
            savedexamStudy = snapshot.val().examStudy;
                //examStudy
                var getexamStudy = "examStudy" + savedexamStudy;
                document.getElementById(getexamStudy).checked = true;

                
            savedexamStress = snapshot.val().examStress;
                //examStress
                var getexamStress = "examStress" + savedexamStress;
                document.getElementById(getexamStress).checked = true;

            savedhwStudy = snapshot.val().hwStudy;
                //hwStudy
                var gethwStudy = "hwStudy" + savedhwStudy;
                document.getElementById(gethwStudy).checked = true;
                 
            savedhwStress = snapshot.val().hwStress;
                //hwStress
                var gethwStress = "hwStress" + savedhwStress;
                document.getElementById(gethwStress).checked = true;

            savedprojectStudy = snapshot.val().projectStudy;
                //projectStudy
                var getprojectStudy = "projectStudy" + savedprojectStudy;
                document.getElementById(getprojectStudy).checked = true;


            savedprojectStress = snapshot.val().projectStress;
                //projectStress
                var getprojectStress = "projectStress" + savedprojectStress;
                document.getElementById(getprojectStress).checked = true;

            savedresearchStudy = snapshot.val().researchStudy;
                //researchStudy
                var getresearchStudy = "researchStudy" + savedresearchStudy;
                document.getElementById(getresearchStudy).checked = true;

            savedresearchStress = snapshot.val().researchStress;
                   //researchStress 
                var getresearchStress = "researchStress" + savedresearchStress;
                document.getElementById(getresearchStress).checked = true;
        });

    // document.getElementById("name").addEventListener("keyup", changeName);
    // document.getElementById("email").addEventListener("keyup", changeEmail);
}


function changeName(){
    //change name or password
    var name = document.getElementById("name").innerHTML = name;
    var email = document.getElementById("email").innerHTML = email;
    console.log("changing name");
    firebase.database().ref('Settings').update({
        Email: email,
        Name: name
    });
}

function changeEmail(){
    //change name or password
    var name = document.getElementById("name").innerHTML = name;
    var email = document.getElementById("email").innerHTML = email;
    console.log("changing email");
    firebase.database().ref('Settings').update({
        Email: email,
        Name: name
    });
}

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

    console.log(exam);

    
    if(exam.valueOf() < 1){
        exam = Number(1);
    }

    if(hw.valueOf() < 1){
        hw = Number(1);
    }

    if(project.valueOf() < 1){
        project = Number(1);
    }

    if(research.valueOf() < 1){
        research = Number(1);
    }

    updatePriorities(exam, examStudy,examStress,  hw, hwStudy,hwStress,   project, projectStudy,projectStress,  research, researchStudy, researchStress).then(function() {});  
};

/*Saves a new message to the Firebase DB.*/
function updatePriorities(exam,examStudy,examStress,  hw, hwStudy, hwStress,  proj, projectStudy,projectStress,  research, researchStudy, researchStress) {
    firebase.database().ref('Priorities').update({
        examPriority: exam,
        examStudy: examStudy, 
        examStress: examStress,
        homeworkPrioirity: hw,
        hwStudy: hwStudy,
        hwStress: hwStress,
        projectPriority: proj,
        projectStudy: projectStudy,
        projectStress: projectStress, 
        researchPriority: research ,
        researchStudy: researchStudy ,
        researchStress: researchStress
    });

    var name = document.getElementById("name").innerHTML = name;
    var email = document.getElementById("email").innerHTML = email;
    console.log("changing settings");
    firebase.database().ref('Settings').update({
        Email: email,
        Name: name
    });

    // getSettings()
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
