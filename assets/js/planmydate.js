var foodOptions = document.querySelector("#food-options");
var entertainmentOptions = document.querySelector("#entertainment-options");
var attractionoptions = document.querySelector("#attraction-options");
var resultsContainer = document.querySelector(".results-container");
var updateBtn = document.querySelector("#updateBtn");
var cityInput = document.querySelector("#city");
var stateInput = document.querySelector("#state");
var dateTypeInput = document.querySelector(".dropdown-options");

//Show data from other page
console.log(JSON.parse(localStorage.getItem("dataFromForm")));
var dataFromForm = JSON.parse(localStorage.getItem("dataFromForm"));
var dateDate = dataFromForm[0];
var place = dataFromForm[1] + " " + dataFromForm[2];
var placeCity = dataFromForm[1];
var placeState = dataFromForm[2];
var what = dataFromForm[3];

//decide what api to call and what to pass into it
var nearbyPlaces = [];
var totalOps = 1;
var currentOps = 0;
var totalOpsArray = [];
if (what == "Attractions") {
    foodOptions.setAttribute("style", "display: none");
    entertainmentOptions.setAttribute("style", "display: none");
    totalOps = 7;
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
    placeState = checkAndConvertStateFormat(placeState);
    getNearbyEntertainment(placeCity, placeState, dateDate);
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
      if (!(status === google.maps.places.PlacesServiceStatus.OK)) {
          totalOps--;
          if (currentOps == totalOps) {
            if (currentOps > 1) {
                console.log("makes it here");
                showResults(totalOpsArray, "attractions");
            }
            if (currentOps == 1) {
                showResults(totalOpsArray, typeOfPlace);
            }
        }
      }
      if (status === google.maps.places.PlacesServiceStatus.OK) {
          console.log(results);
            for (r = 0; r < results.length; r++) {
                totalOpsArray.push(results[r]);
            }
            currentOps++;
            console.log(currentOps + " " + totalOps);
          if (currentOps == totalOps) {
              if (currentOps > 1) {
                  console.log("makes it here");
                  showResults(totalOpsArray, "attractions");
              }
              if (currentOps == 1) {
                  showResults(totalOpsArray, typeOfPlace);
              }
          }
      }
  });
}

//END GOOGLE MAPS API USAGE

//SEAT GEEK API USAGE
//Your app secret is cb9ad030117739bd2955c316867a7cfe25eeff1f11c90bbcfee9aa450747c530
//Client ID: MjY4MjAxMDZ8MTY1MTYwMjA4Mi44Nzc5MjQ3

function getNearbyEntertainment(sgCity, sgState, sgDate) {
    sgCity = sgCity.replace(" ", "-");
    sgState = sgState.replace(" ", "-");
    sgDatePlusOne = moment(sgDate, "YYYY-MM-DD").add(1, 'd').format("YYYY-MM-DD");
    requestUrl = "https://api.seatgeek.com/2/events?venue.state=" + sgState + "&venue.city=" + sgCity + "&datetime_local.gte=" + sgDate + "&datetime_local.lt=" + sgDatePlusOne + "&per_page=100&sort=datetime_local.asc&client_id=MjY4MjAxMDZ8MTY1MTYwMjA4Mi44Nzc5MjQ3";
    fetch(requestUrl)
      .then(function (response) {
          return response.json();
      })
      .then(function (data) {
          showResults(data.events, "entertainment");         
      });
}

//END SEAT GEEK API USAGE

function checkForMultiples(ranArray, len) {
    multiples = false;
    for (r = 0; r < ranArray.length; r++) {
        for (r2 = 0; r2 < ranArray.length; r2++) {
            if (ranArray[r] == ranArray[r2] && r != r2) {
                multiples = true;
            }
        }
    }
    if (multiples) {
        for (m = 0; m < ranArray.length; m++) {
            ranArray[m] = (Math.floor(Math.random() * len))
        }
        ranArray = checkForMultiples(ranArray, len);
    }
    return ranArray;
}

function reorganize(arr) {
    //pick random numbers
    picks = [(Math.floor(Math.random() * arr.length)), (Math.floor(Math.random() * arr.length)), (Math.floor(Math.random() * arr.length)), (Math.floor(Math.random() * arr.length)), (Math.floor(Math.random() * arr.length))];
    //check for same numbers
    picks = checkForMultiples(picks, arr.length);
    //choose which results to show
    for (r = 0; r < picks.length; r++) {
        picks[r] = arr[picks[r]];
    }
    return picks;
}

//functions to dynamically update the html to show the results of a search
function showResults(rslts, ptype) {
    if (rslts.length > 5) {
        rslts = reorganize(rslts);
    }
    console.log(rslts);
    if (ptype == "attractions") {
        var cardsContainer = document.querySelector("#attractionsCardsContainer");
        cardsContainer.innerHTML = "";
        for (i = 0; i < rslts.length; i++) {
            if (rslts[i].business_status == "OPERATIONAL") {
                console.log(rslts[i]);
                if (rslts[i].photos) {
                    createAttractionCard(rslts[i], cardsContainer);
                }
            }
        }
    }
    if (ptype == "entertainment") {
        var cardsContainer = document.querySelector("#entertainmentCardsContainer");
        console.log(rslts);
        cardsContainer.innerHTML = "";
        for (i = 0; i < rslts.length; i++) {
            createEntertainmentCard(rslts[i], cardsContainer);
        }
    }
    if (ptype == "restaurant") {
        var cardsContainer = document.querySelector("#foodCardsContainer");
        cardsContainer.innerHTML = "";
        for (i = 0; i < rslts.length; i++) {
            if (rslts[i].business_status == "OPERATIONAL") {
                console.log(rslts[i]);
                if (rslts[i].photos) {
                    createFoodCard(rslts[i], cardsContainer);
                }
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
    addColTwo.style.padding = "10px";
    //create img
    if (googlePlaceData.photos) {
        var addImg = document.createElement("img");
        addImg.src = googlePlaceData.photos[0].getUrl();
        addImg.style.maxWidth = "250px";
        addImg.style.maxHeight = "250px";
        addImg.style.padding = "10px";
    }
    //create ps
    var addName = document.createElement("h4");
    addName.textContent = googlePlaceData.name;
    addName.style.padding = "10px";

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
function capitalizeFirstLetter (name) {
    var words = name.split(" ");
    var wordArray = []
    for (var word of words) {
        var first = word.substring(0,1).toUpperCase()
        var rest = word.substring(1)
        var newWord = first + rest
        wordArray.push(newWord)
    }
    var finalWord = wordArray.join(" ")
    console.log(finalWord)
    return (finalWord)
}

function createAttractionCard(googlePlaceData, cardsContainer) {
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
    addName.textContent = googlePlaceData.name
    //addName.textContent = capitalizeFirstLetter (googlePlaceData.name)

    var addPRating = document.createElement("p");
    addPRating.textContent = "Rating: " + googlePlaceData.rating + "/5";

    var addPType = document.createElement("p");
    aptype = googlePlaceData.types;
    for (gpd = 0; gpd < aptype.length; gpd++) {
        if (aptype[gpd] == "amusement_park" || aptype[gpd] == "aquarium" || aptype[gpd] == "art_gallery" || aptype[gpd] == "bowling_alley" || aptype[gpd] == "museum" || aptype[gpd] == "zoo" || aptype[gpd] == "park") {
            ptypeActual = aptype[gpd];
        }
    }
    ptypeActual = ptypeActual.replace("_", " ");
    addPType.textContent = capitalizeFirstLetter(ptypeActual);

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
    cardsContainer.appendChild(addAttractionCard);
    cardsContainer.appendChild(addBr);
}

function createEntertainmentCard(seatGeekData, cardsContainer) {
    //create holder div
    var addEntertainmentCard = document.createElement("div");
    addEntertainmentCard.setAttribute("class", "customCardWithoutFlex");
    //create ps
    var addName = document.createElement("h4");
    addName.textContent = seatGeekData.title;

    var addEventType = document.createElement("p");
    et = seatGeekData.type.replace(/_/g, " ");
    et = (et.charAt(0).toUpperCase() + et.slice(1));
    addEventType.textContent = et;

    var addEventTime = document.createElement("p");
    timeMilitary = seatGeekData.datetime_local.slice(11);
    timeFormatted = moment(timeMilitary, "HH:mm:ss").format("h:mma");
    addEventTime.textContent = "Starts at: " + timeFormatted;

    var addVenue = document.createElement("p");
    addVenue.textContent = "Venue: " + seatGeekData.venue.name;

    var addEventURL = document.createElement("a");
    addEventURL.textContent = "See event on SeatGeek";
    addEventURL.href = seatGeekData.url;
    addEventURL.target = "_blank";

    //create br after card
    var addBr = document.createElement("br");

    //append everything to cards container
    addEntertainmentCard.appendChild(addName);
    addEntertainmentCard.appendChild(addEventType);
    addEntertainmentCard.appendChild(addEventTime);
    addEntertainmentCard.appendChild(addVenue);
    addEntertainmentCard.appendChild(addEventURL);
    cardsContainer.appendChild(addEntertainmentCard);
    cardsContainer.appendChild(addBr);
}

function checkAndConvertStateFormat(statey) {
    statey = statey.toLowerCase();
    spelledRight = false;
    whichState = 0;
    //states full name array
    stateFulls = ["alabama", "alaska", "arizona", "arkansas", "california", "colorado", "connecticut", "delaware", "district of columbia", "florida", "georgia", "hawaii", "idaho", "illinois", "indiana", "iowa", "kansas", "kentucky", "louisiana", "maine", "maryland", "massachusetts", "michigan", "minnesota", "mississippi", "missouri", "montana", "nebraska", "nevada", "new hampshire", "new jersey", "new mexico", "new york", "north carolina", "north dakota", "ohio", "oklahoma", "oregon", "pennsylvania", "rhode island", "south carolina", "south dakota", "tennessee", "texas", "utah", "vermont", "virginia", "washington", "west virginia", "wisconsin", "wyoming"];
    //states abr. array
    stateAbrs = ["AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "DC", "FL", "GA", "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD", "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ", "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC", "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY"];
    //check to see if conversion is necessary
    for (st = 0; st < stateAbrs.length; st++) {
        if (statey == stateAbrs[st]) {
            return statey;
        }
    }
    //check to see if state is spelled correctly and if so which position of the array for reference
    for (st = 0; st < stateFulls.length; st++) {
        if (statey == stateFulls[st]) {
            spelledRight = true;
            whichState = st;
        }
    }
    //return the abbreviated state
    return stateAbrs[whichState];
}

updateBtn.addEventListener("click", function() {
    //Show data from other page
    console.log(JSON.parse(localStorage.getItem("dataFromForm")));
    dataFromForm = JSON.parse(localStorage.getItem("dataFromForm"));
    dateDate = dataFromForm[0];
    place = cityInput.value + " " + stateInput.value;
    placeCity = cityInput.value;
    placeState = stateInput.value;
    what = dateTypeInput.value;

    //decide what api to call and what to pass into it
    nearbyPlaces = [];
    totalOps = 1;
    currentOps = 0;
    totalOpsArray = [];
    if (what == "Attractions") {
        foodOptions.setAttribute("style", "display: none");
        entertainmentOptions.setAttribute("style", "display: none");
        attractionoptions.setAttribute("style", "display: block");
        totalOps = 7;
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
        entertainmentOptions.setAttribute("style", "display: block");
        placeState = checkAndConvertStateFormat(placeState);
        getNearbyEntertainment(placeCity, placeState, dateDate);
    }
    if (what == "Food") {
        console.log("gets here");
        entertainmentOptions.setAttribute("style", "display: none");
        attractionoptions.setAttribute("style", "display: none");
        foodOptions.setAttribute("style", "display: block");
        getNearbyPlaces(place, "restaurant", 10000);
    }
})