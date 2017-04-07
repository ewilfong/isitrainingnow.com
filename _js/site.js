//
//isitrainingnow.com js
//uses: http://code.google.com/p/geo-location-javascript/,
//
//Copyright (c) 2009 Stan Wiechers
//Licensed under the MIT licenses.
//
//Revision: $Rev: 77 $: 
//Author: $Author: isitraining@dynamicstripe.com $:
//Date: $Date: 2011-03-28 14:57:50 -0500  $:    
//
function supports(bool, suffix) {
	var s = "Your browser ";
	if (bool) {
		s += "supports " + suffix + ".";
	} else { 
		s += "does not support " + suffix + ". :(";
	}
	return s;
}

function get_WeatherJSON(loc) {//pass a variable into the function
	// Output returned data
	$("#userLatLon").html('Latitude: '+loc.coords.latitude+', Longitude: '+loc.coords.longitude+', Accuracy: '+loc.coords.accuracy);
	
	var url = "http://api.worldweatheronline.com/free/v1/weather.ashx?q=" + loc.coords.latitude + "," + loc.coords.longitude + "&format=json&num_of_days=0&key=ge2vsdjj3z6qs6ycsjxx3ghk&fx=no&extra=localObsTime&includeLocation=yes";
	
	//var url = "http://www.worldweatheronline.com/feed/weather.ashx?q=" + loc + "&format=json&num_of_days=0&key=ec9eff9d00030223112802&fx=no&extra=localObsTime&includeLocation=yes"
	
	var req = $.ajax({
		url : url,
		dataType : "jsonp",
		timeout : 10000
	});
	
	req.success(function(data) {
		get_weatherCode(data);
	});
	
	req.error(function() {
		show_error();
	});
}

function get_weatherCode(data) {
	var weatherCode = data.data.current_condition[0].weatherCode;
	
	//Append Location
	var areaName = data.data.nearest_area[0].areaName[0].value;
	var country = data.data.nearest_area[0].country[0].value;
	var region = data.data.nearest_area[0].region[0].value;
	
	$("#userLocation").html(areaName+', '+region+', '+country);
	
	//runs through this twice sometimes?
	var conditions = $.ajax({
	        type: "GET",
	        url: "_data/wwoConditionCodes.xml",
	        dataType: "xml"
	    });
	
	conditions.success(function(data) {
		show_condition(data, weatherCode);
	});
	
	conditions.error(function() {
		show_error();
	});
}

function show_condition(conditions, weatherCode) {
	for(i=0; i<conditions.getElementsByTagName("code").length;i++) {
		if(weatherCode == conditions.getElementsByTagName("code")[i].childNodes[0].nodeValue) {
			var description = conditions.getElementsByTagName("description")[i].childNodes[0].nodeValue;
			//$("#live-geolocation").html('weatherCode: ' + weatherCode + ', ' + conditions.getElementsByTagName("code")[i].childNodes[0].nodeValue);
		}
	}
	
	if(description) {
		if(description.match("rain") || description.match("Rain")) {
			$('<div id="answer-yes">Yes</div>').replaceAll('#answer_wrap');
		} else {
			$('<div id="answer-no">No</div>').replaceAll('#answer_wrap');
		}
		$("#conditionDescription").html(description);
		document.getElementById("userLocation").style.display = "block";
		document.getElementById("showDetails").style.display = "block";
		document.getElementById("shareThis").style.display = "block";
		document.getElementById("ads").style.display = "block";
		document.getElementById("footer").style.display="block";
	} else {
		$("#conditionDescription").html('condition code not found');
	}
}

function show_error() {
	$("#live-geolocation").html('Unable to determine your current weather.');
}

function initialize() {
//	if(0) {
	if (geo_position_js.init()) {
		//Geolocation is supported
		geo_position_js.getCurrentPosition(get_WeatherJSON, show_error,{enableHighAccuracy:true});
	} else {
		//Geolocation is not supported, ask for manual imput
		$("#live-geolocation").html(supports(false, "geolocation"));
		/* //Needs to be implemented
		$(".submit").click(function() {
			var zip = $("#zipcode").val();
			get_WeatherJSON(zip);
		});
		document.getElementById("location-form").style.display = "block";
		*/
	}
}
