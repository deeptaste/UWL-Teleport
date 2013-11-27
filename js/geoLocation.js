function showMap() {
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
	var homeMarker = new google.maps.Marker({
		map: map,
		position: curLocation, 
		title: "YOU ARE HERE"
	});
	
	iconFile = 'http://maps.google.com/mapfiles/ms/icons/green-dot.png';
	homeMarker.setIcon(iconFile);
	
	// Infowindow popup when user clicks on a map marker
	var infowindow = new google.maps.InfoWindow();
	
	var uwlBuildings = [['Villiers House', '51.514917', '-0.301628'], ['UWL - Ealing Site', '51.506499', '-0.305235']];
	
	for(i=0; i < uwlBuildings.length; i++) {
		createMarker(map, uwlBuildings[i][0], uwlBuildings[i][1], uwlBuildings[i][2]);
	}
}

function createMarker(map, desc, lat, lng) {
	// Add a new marker to represent the place
	var placeLoc = new google.maps.LatLng(lat, lng);
	
	var marker = new google.maps.Marker({
		map : map,
		position : placeLoc,
		title: desc
	});

	// Add a click listener to pop up the infowindow
	google.maps.event.addListener(marker, 'click', function() {
		infowindow.setContent(desc);
		infowindow.open(map, this);
	});
}