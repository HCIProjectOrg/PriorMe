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
        writeNewPost(text);  
		setTimeout(function () {send(text).then(function() {})}, 2000);
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

function send(msg){
	
	console.log("msg %o", msg);
	var text = msg;
	$.ajax({
		type: "POST",
		url: "https://api.api.ai/v1/query?v=20150910",
		contentType: "application/json; charset=utf-8",
		dataType: "json",
		headers: {
			"Authorization": "Bearer " + "b4d343db05bd4886bdb0f9408b9e43ab"
		},
		data: JSON.stringify({query: text, lang: "en", sessionId: "1234567890"}),
		success: function(data){
			console.log("response %o", data);
			setResponse(JSON.stringify(data,undefined,2));
		},
		error: function(){
			console.log("Error");	
		}
	});

	setTimeout(function() {getDialogFlowUpdate();},2000);								
}

function setResponse(val){
	var response = JSON.parse(val);
	console.log("set %o", response);
	var htmlTxt = "<span>" + response.result.fulfillment.speech + "</span> </br>";
	if(response.result.fulfillment.data != null || response.result.fulfillment.data != undefined){
		var tableTxt = "<table class='matrix'>";		
					
		tableTxt += "<tr><th></th>";
		for(var i in response.result.fulfillment.data.cols){
			tableTxt += "<th>" + response.result.fulfillment.data.cols[i] + "</th>";
		}
					
		tableTxt += "</tr>";
		for(var i in response.result.fulfillment.data.rows){
			tableTxt += "<tr>";
			for(var j in response.result.fulfillment.data.rows[i])
				tableTxt += "<td>" + response.result.fulfillment.data.rows[i][j] + "</td>";
			tableTxt += "</tr>";
		}
								
		tableTxt += "</table>";
		htmlTxt += tableTxt;	
	}
				
	$("#chat_div").chatbox("option", "boxManager").addMsg("PriorMe",htmlTxt);
}
function getDialogFlowUpdate(){
	firebase.database().ref('Messages').once('value', snapshot => {
        const todoList = snapshot.val();
        const keys = Object.keys(todoList || {});

		const key = keys[keys.length-1];
		   let item = todoList[key];
           
		   
		   var mDiv = document.getElementById("messages");
        var taskDiv = document.createElement("div");
        taskDiv.class = "messageDiv";
        var html = "";
        
        //check for dates
        if(oldDate == item.Date){
            //don't print the new date
        }
        else{
            //add new date
            html = 
            '<div class="dayStamp">'+ 
                //Day
                '<p class="dayLabel">' + item.Date  +'</p>' +
            '</div>';
            oldDate = item.Date;
        }

		//Commit to github
		var msg = item.Message;
		msg = msg.replace(/\n/g, "<br>");
					
        html = html + 
        '<div class="chatMessage user">'+ 
            //Date
            '<p class="dateParagrahUser">' + item.Time  +'</p>' +
            '<div class= chatbotMessage >'+
                //Sender
                // '<p class="senderParagrah">' + newPost.Sender  +'</p>' +
                //Message
                '<p class="messageParagrah">' + msg /*item.Message*/  +'</p>' +
            '</div>'+
        '</div>';

        taskDiv.innerHTML = html;
        mDiv.appendChild(taskDiv);
		});
}

function startDatabaseQueries() {
	//Committ to github
	send("Hi");
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

		//Commit to github
		var msg = childSnapshot.val().Message;
		msg = msg.replace(/\n/g, "<br>");
		
        if(childSnapshot.val().Sender  == "user"){
            html = html + 
            '<div class="chatMessage user">'+ 
                //Date
                '<p class="dateParagrahUser">' + childSnapshot.val().Time  +'</p>' +
                '<div class= chatbotMessage >'+
                    //Sender
                    // '<p class="senderParagrah">' + childSnapshot.val().Sender +": " +'</p>' +
                    //Message
                    '<p class="messageParagrah">' + msg /*childSnapshot.val().Message*/  +'</p>' +
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
                    '<p class="messageParagrah">' + msg /*childSnapshot.val().Message*/  +'</p>' +
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
