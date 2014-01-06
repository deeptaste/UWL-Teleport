var gLng="";
var gLat="";
var gDesc="";

function showMap(lat, lng, desc) {
	gLat = lat;
	gLng = lng;
	gDesc = desc;
	
	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(showPosition);
	}
}

function showPosition(position) {
	var curLocation = new google.maps.LatLng(position.coords.latitude, position.coords.longitude);
	
	var map = new google.maps.Map(document.getElementById('map'), {
		mapTypeId : google.maps.MapTypeId.ROADMAP,
		center : curLocation,
		zoom : 11
	});
	
	// Special marker for current location: make it green
	var homeMarker = createMarker(map, curLocation, "YOU ARE HERE");
	
	iconFile = 'http://maps.google.com/mapfiles/ms/icons/green-dot.png';
	homeMarker.setIcon(iconFile);
	
	var placeLoc;
	var uwlBuildings = [['Villiers House', '51.514917', '-0.301628'], ['UWL - Ealing Site', '51.506499', '-0.305235']];
	
	if (gLat != "" && gLng != "") {
		placeLoc = new google.maps.LatLng(gLat, gLng);
		var newMarker = createMarker(map, placeLoc, gDesc);
	}
	else {
		for(i=0; i < uwlBuildings.length; i++) {
			placeLoc = new google.maps.LatLng(uwlBuildings[i][1], uwlBuildings[i][2]);
			createMarker(map, placeLoc, uwlBuildings[i][0]);
		}
	}
	
	// Add a click listener to pop up the infowindow
	google.maps.event.addListener(marker, 'click', function() {
		infowindow.setContent(desc);
		infowindow.open(map, this);
	});
}

function createMarker(map, placeLoc, desc) {
	// Add a new marker to represent the place
	var marker = new google.maps.Marker({
		map : map,
		position : placeLoc,
		title: desc
	});
	// Infowindow popup when user clicks on a map marker
	var infowindow = new google.maps.InfoWindow();
	
	// Add a click listener to pop up the infowindow
	google.maps.event.addListener(marker, 'click', function() {
		infowindow.setContent(desc);
		infowindow.open(map, this);
	});
	
	return marker;
}