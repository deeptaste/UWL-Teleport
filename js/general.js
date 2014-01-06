$(document).bind("mobileinit", function(){
  $.extend(  $.mobile , {
   defaultPageTransition: 'none'
  });
});

$(document).on("pageshow", "#busRoutes", function() {
    displayRoute();
});

$(document).on("pageshow", "#maps", function() {
    var lngVal = $('#siteLatLng').attr('lng-val');
	var latVal = $('#siteLatLng').attr('lat-val');
	var descVal = $('#siteLatLng').attr('desc-val');
    showMap(lngVal, latVal, descVal);
});

$(document).on("pageshow", "#busStops", function() {
     var routeId = $('#routeIdForStop').attr('data-val');
     displayStop(routeId);
});

$(document).on("pageshow", "#busTimes", function() {
	var routeId = $('#routeIdForTime').attr('data-val');
	var stopId = $('#stopIdForTime').attr('data-val');
    displayTime(routeId, stopId);
});

function setShuttleBusData(obj) {
	var param = obj.getAttribute("data-param");
	
	if(obj.getAttribute("data-page") == "busStop") {
		$('#routeIdForStop').attr( 'data-val',param);
	}
	
	if(obj.getAttribute("data-page") == "busTime") {
		$('#routeIdForTime').attr( 'data-val',param.split("-")[0]);
		$('#stopIdForTime').attr( 'data-val',param.split("-")[1]);
	}
}

function resetShuttleBusData(obj) {
	$('#routeIdForTime').attr( 'data-val','');
	$('#stopIdForTime').attr( 'data-val','');
}

$(document).on("pageshow", "#buildingSites", function() {
	displaySite();
});

$(document).on("pageshow", "#siteDepartments", function() {
     var siteId = $('#siteIdForDepartment').attr( 'data-val');
     displayDepartments(siteId);
});

$(document).on("pageshow", "#departmentDetails", function() {
    var siteId = $('#siteIdForDetails').attr( 'data-val');
	var departmentId = $('#departmentIdForDetails').attr( 'data-val');
	displayDepartmentDetails(siteId, departmentId);
});

function setBuildingSiteData(obj) {
	var param = obj.getAttribute("data-param");
	
	if(obj.getAttribute("data-page") == "siteDepartment") {
		$('#siteIdForDepartment').attr( 'data-val',param);
		
		$('#siteLatLng').attr( 'lat-val',obj.getAttribute("data-lat"));
		$('#siteLatLng').attr( 'lng-val',obj.getAttribute("data-lng"));
		$('#siteLatLng').attr( 'desc-val',obj.getAttribute("data-desc"));
		
	}
	
	if(obj.getAttribute("data-page") == "departmentDetail") {
		$('#siteIdForDetails').attr( 'data-val',param.split("-")[0]);
		$('#departmentIdForDetails').attr( 'data-val',param.split("-")[1]);
	}
}

function openInAppBrowser(link) {
	window.open(link, '_blank', 'location=yes');
}
