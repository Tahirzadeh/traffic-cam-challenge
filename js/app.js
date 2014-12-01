// List of Seattle Traffic Cameras
// http://data.seattle.gov/resource/65fc-btcc.json

//put your code here to create the map, fetch the list of traffic cameras
//and add them as markers on the map
//when a user clicks on a marker, you should pan the map so that the marker
//is at the center, and open an InfoWindow that displays the latest camera
//image
//you should also write the code to filter the set of markers when the user
//types a search phrase into the search box

"use strict";

$(document).ready(function() {

    var mapElem = document.getElementById('map');
    var center = {lat: 47.6, lng: -122.3} //centers map at location
    var map = new google.maps.Map(mapElem, { //constructs google map
        center: center,
        zoom: 12
    });
    var infoWindow = new google.maps.InfoWindow();
    var cameras;
    var markers = [];

    $.getJSON('http://data.seattle.gov/resource/65fc-btcc.json') //gets camera data array
    .done(function(data) {
		cameras = data;
		data.forEach(function(cameras) { //sets marker positions
			var marker = new google.maps.Marker({
				position: {
					lat: Number(cameras.location.latitude),
					lng: Number(cameras.location.longitude)
				},
				map: map
			});
			markers.push(marker);

		    google.maps.event.addListener(marker, 'click', function() { //content for infoWindow on click
		        var html = '<p>' + cameras.cameralabel + '</p>';
		       	html += '<img src="' + cameras.imageurl.url + '"/>';
		        infoWindow.setContent(html);
		        infoWindow.open(map, this);
		        map.panTo(this.getPosition());
		    });

		    google.maps.event.addListener(map, 'click', function(){
				infoWindow.close(); //closes infoWindow when click occurs
			});

			$('#search').bind('search keyup', function() { //search function for camera filter
				var searchString = cameras.cameralabel.toLowerCase().indexOf(this.value.toLowerCase());
				if(searchString >= 0){
					marker.setMap(map);
				}
				else {
					marker.setMap(null);
				}
			});
		});
	})

	.fail(function(error) { //fail function
        console.log('error');
        alert("There is an error.")
    })

    $('#map').height($(window).height() - $('#map').position().top - 20); //sets size window
});