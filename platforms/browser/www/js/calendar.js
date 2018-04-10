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

        // console.log('Received Event: ' + id);
    }
};

app.initialize();

/**
 * Starts listening for new posts and populates posts lists.
 */
function startDatabaseQueries(c, date) {
    var timespan = 7, tasknumber = 0, homework_p = 1;
    var exam_p = 1, project_p = 1, research_p = 1;
    var tasknumber = 0;
    var y = c.CurrentYear;
    var m = c.CurrentMonth;
    var lastDateOfCurrentMonth = new Date(y, m+1, 0).getDate();
    document.getElementById("tasksDiv").innerHTML = "";

    var init_query = firebase.database().ref("Priorities");
    init_query.once("value").then(
      function(snapshot){
        homework_p = snapshot.val().homeworkPrioirity;
        exam_p = snapshot.val().examPriority;
        project_p = snapshot.val().projectPriority;
        research_p = snapshot.val().researchPriority;
      }
    );

    var query = firebase.database().ref("Task").orderByKey();
    query.once("value").then(function(snapshot) {
        snapshot.forEach(function(childSnapshot) {
            if(childSnapshot.val().TaskType == "homework") timespan = homework_p + 2;
            else if(childSnapshot.val().TaskType == "exam") timespan = exam_p + 2;
            else if(childSnapshot.val().TaskType == "project") timespan = project_p + 2;
            else if(childSnapshot.val().TaskType == "research") timespan = research_p + 2;

            if (// if a week doesn't spill into the next month
                (y == Number(childSnapshot.val().Deadline.substring(0,4)) &&
                (m+1) == Number(childSnapshot.val().Deadline.substring(5,7)) &&
                date <= Number(childSnapshot.val().Deadline.substring(8,10)) &&
                Number(childSnapshot.val().Deadline.substring(8,10)) <= (date+timespan)) ||
                // if week spills into the next month
                (y == Number(childSnapshot.val().Deadline.substring(0,4)) &&
                (m+2) == Number(childSnapshot.val().Deadline.substring(5,7)) &&
                lastDateOfCurrentMonth < (date+timespan) &&
                Number(childSnapshot.val().Deadline.substring(8,10)) <= ((date+timespan)%lastDateOfCurrentMonth)) ||
                // if week spills into the next year
                ((y+1) == Number(childSnapshot.val().Deadline.substring(0,4)) &&
                (m+1) == 12 &&
                lastDateOfCurrentMonth < (date+timespan) &&
                Number(childSnapshot.val().Deadline.substring(8,10)) <= ((date+timespan)%lastDateOfCurrentMonth))
                )
            {
              tasknumber++;
              var key = childSnapshot.key;

              var pnl = document.getElementById("tasksDiv");
              var taskDiv = document.createElement("div");
              taskDiv.id = key;

               var keyString = key.toString();
               var popUpKey = "P"+keyString;
               console.log("popUpKey: " + popUpKey);

              var html = 
              '<div class="task" >'+ 
                      '<div class="popuptext" id='+popUpKey+'>' + 
                          '<div class="popupName" >' + 
                              '<p class="namePopUp">' + childSnapshot.val().Name +'</p>' +
                          '</div>'+
                          '<p class="deadlinePopUp">' + "Due: "+ childSnapshot.val().Deadline  +'</p>' +
                          '<p class="detailsPopUp">' + "Task: "+ childSnapshot.val().TaskType  +'</p>' +
                          '<p class="detailsPopUp">' + "Estimated Hours: "+ childSnapshot.val().Hours  +'</p>' +
                      '</div>'+
                      '<label class="nameLabel" onclick=myFunction(\'' + popUpKey + '\')>' + childSnapshot.val().Name  +'</label>' +
                      '<input class="deleteButton" type="image" src="../img/delete.png" />'+ 
                      // '<img class="deleteButton" src="../img/delete.png" alt="Delete">'+

              '</div>';

              taskDiv.innerHTML = html;
              pnl.appendChild(taskDiv);
            }
        });
    });
}  

// When the user clicks on <div>, open the popup
function myFunction(keyID) {
    console.log("KEYID: "+ keyID); 
    var popup = document.getElementById(keyID);
    popup.classList.toggle("show");
}

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

  startDatabaseQueries(this,d.getDate());
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
  var date;
  for (row=0; row<6; row++) {
    html += '<tr>';
    for (var col = 0; col < 7; col++) {
      date = ((7*row)+col) + dm - firstDayOfCurrentMonth;
      // Dates from prev month
      if (date < 1){
        cellvalue = lastDateOfLastMonth - firstDayOfCurrentMonth + p++;
        html += '<td id="prevmonthdates">' + (cellvalue) +
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
      
      if (((7*row)+col) % 7 == 6 && date >= lastDateOfCurrentMonth) {
        row = 10; // no more rows
      }
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
// window.onload = function() {
function startCalendar() { 
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
  startDatabaseQueries(c, d.getDate());
}

// Get element by id
function getId(id) {
  return document.getElementById(id);
}