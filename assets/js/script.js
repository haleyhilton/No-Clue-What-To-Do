var img = document.createElement("img");
img.src = "http://public.media.smithsonianmag.com/legacy_blog/smiley-face-1.jpg";
var src = document.getElementById("header");
src.appendChild(img).style.maxWidth = "200px";
img.style.padding = "10px";



var dateInputEl = $('#datetimepicker')

$('#datetimepicker').click(function () {
    $('#date-selector').datepicker({
      changeMonth: true,
      changeYear: true,
    });
  });

  //append text to datepicker



//GOOGLE MAPS API USAGE

var whereTo;

function getNearbyPlaces(address, typeOfPlace, searchRadius) {
  //typeOfPlace is a defined category by google: https://developers.google.com/maps/documentation/javascript/supported_types
  //searchRadius is in meters
  address = address.replace(/\s/g, '%20');
  var requestUrl = "https://maps.googleapis.com/maps/api/geocode/json?address=" + address + "&key=AIzaSyAJYaSoyJpEW8-eq6dfHoB7Dvv8dKm84-U";
  
  fetch(requestUrl)
      .then(function (response) {
          return response.json();
      })
      .then(function (data) {
          whereTo = data.results[0].geometry.location;
          performNearbySearch(typeOfPlace, searchRadius);         
      });
};

function performNearbySearch(typeOfPlace, searchRadius) {
  var whereToNow = new google.maps.LatLng(whereTo.lat, whereTo.lng);

  var map = new google.maps.Map(
      document.getElementById('map'), {center: whereToNow, zoom: 15});

  var request = {
    location: whereToNow,
    radius: searchRadius,
    type: typeOfPlace
  };

  var service = new google.maps.places.PlacesService(map);

  service.nearbySearch(request, function(results, status) {
      if (status === google.maps.places.PlacesServiceStatus.OK) {
          for (var i = 0; i < results.length; i++) {
              console.log(results[i]);
          }
      }
  });
}

//test:
/* var testBtn = document.querySelector("#testBtn");
testBtn.addEventListener("click", function() {
  getNearbyPlaces("92065", "restaurant", 7000);
}); */

//END GOOGLE MAPS API USAGE