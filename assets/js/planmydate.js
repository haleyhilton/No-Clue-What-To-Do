var foodOptions = document.querySelector("#food-options");
var entertainmentOptions = document.querySelector("#entertainment-options");
var attractionoptions = document.querySelector("#attraction-options");
var resultsContainer = document.querySelector("#results-container");

//Show data from other page
console.log(JSON.parse(localStorage.getItem("dataFromForm")));
var dataFromForm = JSON.parse(localStorage.getItem("dataFromForm"));
var place = dataFromForm[1] + " " + dataFromForm[2];
var what = dataFromForm[3];

//decide what api to call and what to pass into it
var nearbyPlaces = [];
if (what == "Attractions") {
    foodOptions.setAttribute("style", "display: none");
    entertainmentOptions.setAttribute("style", "display: none");
    //attraction things here
}
if (what == "Entertainment") {
    foodOptions.setAttribute("style", "display: none");
    attractionoptions.setAttribute("style", "display: none");
    //Entertainment things here
}
if (what == "Food") {
    entertainmentOptions.setAttribute("style", "display: none");
    attractionoptions.setAttribute("style", "display: none");
    getNearbyPlaces(place, "restaurant", 10000);
}

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
          console.log(results);
          showResults(results, typeOfPlace);
      }
  });
}

//END GOOGLE MAPS API USAGE

//functions to dynamically update the html to show the results of a search
function showResults(rslts, ptype) {
    if (ptype == "placeholder") {
        for (i = 0; i < rslts.length; i++) {
            createAttractionCard(rslts[i]);
        }
    }
    if (ptype == "placeholder") {
        for (i = 0; i < rslts.length; i++) {
            createEntertainmentCard(rslts[i]);
        }
    }
    if (ptype == "restaurant") {
        for (i = 0; i < rslts.length; i++) {
            createFoodCard(rslts[i]);
        }
    }
}

function createFoodCard() {
    //create holder div
    var addFoodCard = document.createElement("div");
    
    //create ps
    var addPOpen = document.createElement("p");
    addPOpen.innerHTML = "open now"
    //append everything to results container
    
}