var foodOptions = document.querySelector("#food-options");
var entertainmentOptions = document.querySelector("#entertainment-options");
var attractionoptions = document.querySelector("#attraction-options");
var resultsContainer = document.querySelector(".results-container");

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
    getNearbyPlaces(place, "amusement_park", 10000);
    getNearbyPlaces(place, "aquarium", 10000);
    getNearbyPlaces(place, "art_gallery", 10000);
    getNearbyPlaces(place, "bowling_alley", 10000);
    getNearbyPlaces(place, "museum", 10000);
    getNearbyPlaces(place, "park", 10000);
    getNearbyPlaces(place, "zoo", 10000);
}
if (what == "Entertainment") {
    foodOptions.setAttribute("style", "display: none");
    attractionoptions.setAttribute("style", "display: none");
    //entertainment things here
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
    if (ptype == "amusement_park" || ptype == "aquarium" || ptype == "art_gallery" || ptype == "bowling_alley" || ptype == "museum" || ptype == "park" || ptype == "zoo") {
        var cardsContainer = document.querySelector("#attractionsCardsContainer");
        console.log(cardsContainer);
        for (i = 0; i < rslts.length; i++) {
            if (rslts[i].business_status == "OPERATIONAL") {
                createAttractionCard(rslts[i], cardsContainer, ptype);
            }
        }
    }
    if (ptype == "placeholder") {
        var cardsContainer = document.querySelector("#entertainmentCardsContainer");
        for (i = 0; i < rslts.length; i++) {
            createEntertainmentCard(rslts[i], cardsContainer);
        }
    }
    if (ptype == "restaurant") {
        var cardsContainer = document.querySelector("#foodCardsContainer");
        console.log(cardsContainer);
        for (i = 0; i < rslts.length; i++) {
            if (rslts[i].business_status == "OPERATIONAL") {
                createFoodCard(rslts[i], cardsContainer);
            }
        }
    }
}

function createFoodCard(googlePlaceData, cardsContainer) {
    //create holder div
    var addFoodCard = document.createElement("div");
    addFoodCard.setAttribute("class", "customCard");
    var addColOne = document.createElement("div");
    var addColTwo = document.createElement("div");
    //create img
    if (googlePlaceData.photos) {
        var addImg = document.createElement("img");
        addImg.src = googlePlaceData.photos[0].getUrl();
        addImg.style.maxWidth = "250px";
        addImg.style.maxHeight = "250px";
    }
    //create ps
    var addName = document.createElement("h4");
    addName.textContent = googlePlaceData.name;

    var addPRating = document.createElement("p");
    addPRating.textContent = "Rating: " + googlePlaceData.rating + "/5";

    var addPPrice = document.createElement("p");
    addPPrice.textContent = "Price level: " + googlePlaceData.price_level;

    var addPAddress = document.createElement("p");
    addPAddress.textContent = "Address: " + googlePlaceData.vicinity;

    //create br after card
    var addBr = document.createElement("br");

    //append everything to cards container
    addColOne.appendChild(addName);
    if (googlePlaceData.photos) {
        addColOne.appendChild(addImg);
    }
    addColTwo.appendChild(addPRating);
    addColTwo.appendChild(addPPrice);
    addColTwo.appendChild(addPAddress);
    addFoodCard.appendChild(addColOne);
    addFoodCard.appendChild(addColTwo);
    cardsContainer.appendChild(addFoodCard);
    cardsContainer.appendChild(addBr);
}

function createAttractionCard(googlePlaceData, cardsContainer, ptype) {
    console.log(googlePlaceData.name + " " + ptype);
    //create holder div
    var addAttractionCard = document.createElement("div");
    addAttractionCard.setAttribute("class", "customCard");
    var addColOne = document.createElement("div");
    var addColTwo = document.createElement("div");
    //create img
    if (googlePlaceData.photos) {
        var addImg = document.createElement("img");
        addImg.src = googlePlaceData.photos[0].getUrl();
        addImg.style.maxWidth = "250px";
        addImg.style.maxHeight = "250px";
    }
    //create ps
    var addName = document.createElement("h4");
    addName.textContent = googlePlaceData.name;

    var addPRating = document.createElement("p");
    addPRating.textContent = "Rating: " + googlePlaceData.rating + "/5";

    var addPType = document.createElement("p");
    ptype = ptype.replace("_", " ");
    addPType.textContent = ptype;

    var addPAddress = document.createElement("p");
    addPAddress.textContent = "Address: " + googlePlaceData.vicinity;

    //create br after card
    var addBr = document.createElement("br");

    //append everything to cards container
    addColOne.appendChild(addName);
    if (googlePlaceData.photos) {
        addColOne.appendChild(addImg);
    }
    addColTwo.appendChild(addPType);
    addColTwo.appendChild(addPRating);
    addColTwo.appendChild(addPAddress);
    addAttractionCard.appendChild(addColOne);
    addAttractionCard.appendChild(addColTwo);
    console.log("cc: " + cardsContainer + " aac: " + addAttractionCard);
    cardsContainer.appendChild(addAttractionCard);
    cardsContainer.appendChild(addBr);
}

//SEAT GEEK API USAGE
//Your app secret is cb9ad030117739bd2955c316867a7cfe25eeff1f11c90bbcfee9aa450747c530
//Client ID: MjY4MjAxMDZ8MTY1MTYwMjA4Mi44Nzc5MjQ3