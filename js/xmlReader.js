// A function to write data to a div
function writeData(data, divLocation){
	document.getElementById(divLocation).innerHTML = data;
}

// A function to open an existing XML file
function openXMLFile(filename)
{
	xmlhttp = new XMLHttpRequest();   
	xmlhttp.open("GET", filename, false);
	xmlhttp.send();
	xmlDoc = xmlhttp.responseXML;

	return xmlDoc;
}

// A function to read route data from the XML file and diplay that data to the user
function displayRoute()
{
	var file = openXMLFile("data/time_data.xml");
	var route = file.getElementsByTagName("ROUTE");
	var data = "";	
	var rPos = "";
		
	for (i = 0; i < route.length; i++)
	{
	  	if (i == route.length - 1) {
	  		rPos = "ui-last-child";
  		}
  		else if (i == 0) {
	  		rPos = "ui-first-child";
  		}
  		else {
  			rPos = "";
  		}
  		data += "<li data-corners=\"false\" data-shadow=\"false\" data-iconshadow=\"true\" data-wrapperels=\"div\" data-icon=\"arrow-r\" data-iconpos=\"right\" ";
	   	data += "data-theme=\"d\" class=\"ui-btn ui-btn-icon-right ui-li-has-arrow ui-li " + rPos + " ui-btn-up-d\">";
	   	data += "<div class=\"ui-btn-inner ui-li\"><div class=\"ui-btn-text\">";
	   	data += "<a data-param=\"" + i + "\" data-page=\"busStop\" href=\"#busStops\" class=\"ui-link-inherit\" onclick=\"javascript: setShuttleBusData(this);\">";
	   	data += route[i].getElementsByTagName("DIRECTION")[0].childNodes[0].nodeValue;
	   	data += "</a></div><span class=\"ui-icon ui-icon-arrow-r ui-icon-shadow\">&nbsp;</span></div></li>";
	}
	
	writeData(data, "ulBusRoutes");
}

// A function to read stop data from the XML file and display that data to the uer
function displayStop(routeID){
	var file = openXMLFile("data/time_data.xml");
	var route = file.getElementsByTagName("ROUTE");
	var data = "";
	var rPos = "";
	
	if(!(routeID >= 0 && routeID <= route.length)){
		routeID = 0;
	}
	
	var stop = route[routeID].getElementsByTagName("STOP");
	
	for (i = 0; i < stop.length; i++)
	{ 
	  	if (i == stop.length - 1) {
	  		rPos = "ui-last-child";
  		}
  		else if (i == 0) {
	  		rPos = "ui-first-child";
  		}
  		else {
  			rPos = "";
  		}
  		data += "<li data-corners=\"false\" data-shadow=\"false\" data-iconshadow=\"true\" data-wrapperels=\"div\" data-icon=\"arrow-r\" data-iconpos=\"right\" ";
  		data += "data-theme=\"d\" class=\"ui-btn ui-btn-icon-right ui-li-has-arrow ui-li " + rPos + " ui-btn-up-d\">";
	   	data += "<div class=\"ui-btn-inner ui-li\"><div class=\"ui-btn-text\">";
	   	data += "<a data-param=\"" + routeID + "-" + i + "\" data-page=\"busTime\" href=\"#busTimes\" class=\"ui-link-inherit\" onclick=\"javascript: setShuttleBusData(this);\">";
	   	data += stop[i].getElementsByTagName("LOCATION")[0].childNodes[0].nodeValue;
	   	data += "</a></div><span class=\"ui-icon ui-icon-arrow-r ui-icon-shadow\">&nbsp;</span></div></li>";
	}
	
	writeData(data, "ulBusStops");
}

// A function to read time data from the XML file and display that data to the uer
function displayTime(routeID, stopID) {
	
	var file = openXMLFile("data/time_data.xml");
	var route = file.getElementsByTagName("ROUTE");
	var data = "", data1 = "", data2 = "";
	
	if(!(routeID >= 0 && routeID <= route.length)){
		routeID = 0;
	}
	
	var stop = route[routeID].getElementsByTagName("STOP");
	
	if(!(stopID >= 0 && stopID <= stop.length)){
		stopID = 0;
	}
	
	var curTime = new Date();
	var curHr = curTime.getHours();
	var curMin = curTime.getMinutes();
	
	data += "<p>Shuttle Bus from <br/><b>" + route[routeID].getElementsByTagName("DIRECTION")[0].childNodes[0].nodeValue + "</b><br/><br/>";
	data += "Estimated Shuttle bus arrival time at: <b>" + stop[stopID].getElementsByTagName("LOCATION")[0].childNodes[0].nodeValue + "</b>";
	data += "<br/><br/>Current time: <b>" + formatTimeData(curHr, curMin) + "</b></p>";
	
	var schedule = stop[stopID].getElementsByTagName("SCHEDULE");
	var timeTable;
	var hour;
	var min;
	
	var defaultLength = 5;  // config file required
	var counter = 0;
	
	for(var t = 0; t < schedule.length; t++)
	{
		timeTable = schedule[t].getElementsByTagName("TIME");	
		
		counter = 0;   	
		for (var i = 0; i < timeTable.length; i++)
		{				
			hour = timeTable[i].getElementsByTagName("HOUR")[0].childNodes[0].nodeValue;
		   	min = timeTable[i].getElementsByTagName("MINUTE")[0].childNodes[0].nodeValue;
		 
			if(isAfterCurrentTime(hour, min))
		   	{
		   		if(counter == 0) {
		   			data1 += "Next bus <b>@" + formatTimeData(hour,min) + " - <font id=\"nextBusTime1\" size=\"4\">" + waitingTime(hour,min) + "</b></font>";
		   		}
		   		else {
				  	data2 += "<li class=\"ui-li ui-li-static ui-btn-up-c ui-corner-top\">@";
				  	data2 += formatTimeData(hour,min) + " in " + waitingTime(hour,min);
				   	data2 += "</li>";    	
			   	}
			   	counter++;
			   	
			   	if(counter == defaultLength){ i = timeTable.length; }
			}
		}
		
		data += data1 + "<br/><br/>Other bus arrival times: <ul id=\"ulBusTimes\" class=\"ui-listview ui-listview-inset ui-corner-all ui-shadow\">" + data2 + "</ul>";
	}
	
	writeData(data, "divBusTimes");
}

// A functionto format the time data into either PM or AM and return the result as a String
function formatTimeData(hours, minutes){
	var myDate = new Date();
	
	myDate.setHours(hours, minutes, 00, 00);
	
	var time = myDate;
	
	if((hours % 12) == 0){
		time = ((myDate.getHours() % 12) + 12) + ":";
	}
	else{
		time = (myDate.getHours() % 12) + ":";
	}
	
	if(minutes < 10){
		time += "0" + myDate.getMinutes();
	}
	else{
		time += myDate.getMinutes();
	}
	
	if((hours % 24) < 12){	
		time += " AM";
	}
	else{
		time += " PM";	
	}
	
	return time;
}

// A function to calculate how long a user has to wait for the next shuttlebus based on the data provided
function waitingTime(hours, minutes){
	
	if(hours < 0){ hours = 0; }
	if(hours > 23) { hours %= 24; }
	
	if(minutes < 0){ minutes = 0; }
	if(minutes > 59){ minutes %= 60; }
	
	var curTime = new Date();
	var curHr = curTime.getHours();
	var curMin = curTime.getMinutes();
	var timeLeft, hoursLeft, minutesLeft;
	
	if(hours >= curHr)
	{
		hoursLeft = hours - curHr;
	}
	else{
		hoursLeft = 24 - (curHr - hours);
	}

	if(minutes >= curMin){
		minutesLeft = minutes - curMin;
	}
	else{
		minutesLeft = 60 - (curMin - minutes);
		
		if(hoursLeft > 0){ hoursLeft--; }
		else{ hoursLeft = 23; }
	}
	
	if (hoursLeft == 0) {
		timeLeft = minutesLeft + " mins.";
	}
	else {   
		timeLeft = hoursLeft + " hr. " + minutesLeft + " mins left";
	}

	return timeLeft;
	//writeData(timeLeft, "divWait");
}

// A function to check hours and minutes against current time
function isAfterCurrentTime(hours, minutes){
	
	var currentTime = new Date();
	var currentHours = currentTime.getHours();
	var currentMinutes = currentTime.getMinutes();
	
	var busTime = hours + "" + minutes;
	var curTime = currentHours + "" + currentMinutes;
	
	if(busTime >= curTime){
		return true;
	}
	else {
		return false;	
	}
}

Date.prototype.getControlFmt = function() {
	var hh = "" + d.getHours();
	var mm = "" + d.getMinutes();
	if (hh.length == 1) {
		dd = "0" + dd;
	}
	if (mm.length == 1) {
		mm = "0" + mm;
	}
	return hh + ":" + mm;
};
