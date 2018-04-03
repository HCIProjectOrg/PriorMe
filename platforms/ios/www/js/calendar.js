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

"use strict";
var Calendar = function(cal) {
  var date = new Date();
  var format = cal.Format;

  this.divId = cal.ParentID;
  this.Days = cal.Days;
  this.Months = cal.Months;
  this.CurrentMonth = date.getMonth();
  this.CurrentYear = date.getFullYear();

  typeof(format) == 'string' ? this.format = format.charAt(0).toUpperCase() : 'M';
};

// Proceeds to next month
Calendar.prototype.nextMonth = function() {
  this.CurrentMonth = ++this.CurrentMonth % 12;
  if(this.CurrentMonth == 0){ this.nextYear(); }
  this.updateCalendar();
};

// Proceeds to previous month
Calendar.prototype.previousMonth = function() {
  this.CurrentMonth = (this.CurrentMonth + 11) % 12;
  if(this.CurrentMonth == 11) { this.previousYear(); }
  this.updateCalendar();
};

// Proceeds to next year
Calendar.prototype.nextYear = function() {
  this.CurrentYear++;
  this.updateCalendar();
}  

// Proceeds to previous year
Calendar.prototype.previousYear = function() {
  this.CurrentYear--;
  this.updateCalendar();
}

// Displays the current month
Calendar.prototype.showCurrent = function() {
  this.Calendar(this.CurrentYear, this.CurrentMonth);
};

Calendar.prototype.selectDate = function(cell){
  var selected = document.querySelector("#selecteddate");
  if(selected) selected.setAttribute('id', "currentmonthdates");
  cell.setAttribute('id', "selecteddate");

  var d = new Date(this.CurrentYear, this.CurrentMonth, Number(cell.innerHTML));
  document.getElementById("date").innerHTML = d.getDate();
  document.getElementById("day").innerHTML = this.Days[d.getDay()];
}

Calendar.prototype.updateCalendar = function() {
  // Displays the current month
  var c = this;
  c.showCurrent();
  
  // Calls the apropriate functions once the button is clicked
  getId('btnPrev').onclick = function(){ c.previousMonth(); };
  getId('btnPrevYr').onclick = function(){ c.previousYear(); };
  getId('btnNext').onclick = function(){ c.nextMonth(); };
  getId('btnNextYr').onclick = function(){ c.nextYear(); };

  // Allow user to select a particualr date
  var cells = document.querySelectorAll("#currentmonthdates");
  for (var i = 0; i < cells.length; i++) {
    cells[i].onclick = function() { c.selectDate(this); };
  }
}

// Calculates and displays a month based on the year
Calendar.prototype.Calendar = function(y, m) {
  typeof(y) == 'number' ? this.CurrentYear = y : null;
  typeof(m) == 'number' ? this.CurrentMonth = m : null;

  var d = new Date();

  // 1st day of the selected month
  var firstDayOfCurrentMonth = new Date(y, m, 1).getDay();

  // Last date of the selected month
  var lastDateOfCurrentMonth = new Date(y, m+1, 0).getDate();

  // Last day of the previous month
  var lastDateOfLastMonth = m == 0 ? new Date(y-1, 11, 0).getDate() : new Date(y, m, 0).getDate();

  // Write selected month and year. This HTML goes into <div id="month"></div>
  var monthandyearhtml = '<span id="monthandyearspan">' + this.Months[m] + '   ' + y + '</span>';
  
  var html = '<table>';
  // Write the header of the days of the week
  html += '<tr>';
  for(var i=0; i < 7;i++) {
    html += '<th class="daysheader">' + this.Days[i] + '</th>';
  }
  html += '</tr>';

  var p, dm;
  if(this.format == 'M') { p = dm = 1; }
  else { p = dm = firstDayOfCurrentMonth == 0 ? -6 : 1; }

  var cellvalue;
  for (var date, i=0, z0=0; z0<6; z0++) {
    html += '<tr>';
    for (var z0a = 0; z0a < 7; z0a++) {
      date = i + dm - firstDayOfCurrentMonth;
      // Dates from prev month
      if (date < 1){
        cellvalue = lastDateOfLastMonth - firstDayOfCurrentMonth + p++;
        html += '<td id="prevmonthdates">' + (cellvalue) +
              // '<span id="cellvaluespan">' + (cellvalue) + '</span><br/>' + 
              // '<ul id="cellvaluelist"><li>apples</li><li>bananas</li><li>pineapples</li></ul>' + 
            '</td>';
      // Dates from next month
      } else if ( date > lastDateOfCurrentMonth){
        html += '<td id="nextmonthdates">' + (p++) + '</td>';
      } else if (y == d.getFullYear() && m == d.getMonth() && date == d.getDate()) {
        html += '<td id="currentmonthdates" class="todaysdate">' + (date) + '</td>';
        p = 1;
      // Current month dates
      } else {
        html += '<td id="currentmonthdates">' + (date) + '</td>';
        p = 1;
      }
      
      if (i % 7 == 6 && date >= lastDateOfCurrentMonth) {
        z0 = 10; // no more rows
      }
      i++;
    }
    html += '</tr>';
  }

  // Closes table
  html += '</table>';

  // Write HTML to the div
  document.getElementById("monthandyear").innerHTML = monthandyearhtml;
  document.getElementById(this.divId).innerHTML = html;
};

// Displays the initial calendar when the window is loaded
window.onload = function() {
  // Creates a calendar object
  var c = new Calendar({
    ParentID:"divcalendartable",
    Days:['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'],
    Months:['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December' ],
    Format:'dd/mm/yyyy'
  });

  c.updateCalendar();
  var d = new Date();
  document.getElementById("date").innerHTML = d.getDate();
  document.getElementById("day").innerHTML = c.Days[d.getDay()];

}

// Get element by id
function getId(id) {
  return document.getElementById(id);
}

/**
 * Starts listening for new posts and populates posts lists.
 */
function startDatabaseQueries() {
    var tasknumber = 0; 

    var query = firebase.database().ref("To_Do").orderByKey();
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
                        '<p class="deadlinePopUp">' + "Due: "+ childSnapshot.val().DaysLeft  +'</p>' +
                        '<p class="detailsPopUp">' + "Details: "+ childSnapshot.val().TaskName  +'</p>' +
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