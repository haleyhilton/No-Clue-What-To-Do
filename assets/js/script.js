var img = document.createElement("img");
img.src = "https://pngimg.com/uploads/smiley/smiley_PNG36233.png";
var src = document.getElementById("footer");
src.appendChild(img).style.maxWidth = "100px";
img.style.padding = "10px";

//append text to datepicker
$(function () {
  $('.input-group.date').datepicker({
    orientation: "auto left",
    forceParse: false,
    autoclose: true,
    todayHighlight: true,
    toggleActive: true,
    //this format is needed for seat geek api, would be very complicated to circumnavigate
    format: "yyyy-mm-dd"
  });
});



//form submit functionality
var dataFromForm = [];
var bodyy = document.querySelector("body");
//clear any prior existing dataFromForm locally stored data
if (localStorage.getItem("dataFromForm")) {
  localStorage.setItem("dataFromForm", dataFromForm);
}
var loadPageTwoNormalBtn = document.querySelector("#loadPageTwoNormalBtn");
var loadPageTwoSurpriseBtn = document.querySelector("#loadPageTwoSurpriseBtn");
var dateSelector = document.querySelector("#date-selector");
var cityInput = document.querySelector("#cityInput");
var stateInput = document.querySelector("#stateInput");
var activityInput = document.querySelector("#exampleFormControlSelect1");

loadPageTwoNormalBtn.addEventListener("click", function (event) {
  event.preventDefault();
  //save input data to local storage
  dataFromForm.push(dateSelector.value);
  dataFromForm.push(cityInput.value);
  dataFromForm.push(stateInput.value);
  dataFromForm.push(activityInput.value);
  localStorage.setItem("dataFromForm", JSON.stringify(dataFromForm));

  renderLoadingScreen();
})

loadPageTwoSurpriseBtn.addEventListener("click", function (event) {
  event.preventDefault();
  //save input data to local storage
  dataFromForm.push(dateSelector.value);
  dataFromForm.push(cityInput.value);
  dataFromForm.push(stateInput.value);
  dateTypeOptions = ["Attractions", "Entertainment", "Food"];
  dateTypePick = dateTypeOptions[(Math.floor(Math.random() * 3))];
  dataFromForm.push(dateTypePick);
  localStorage.setItem("dataFromForm", JSON.stringify(dataFromForm));

  renderLoadingScreen();
})

function renderLoadingScreen() {
  //loading screen
  bodyParts = bodyy.children;
  for (i = 0; i < bodyParts.length; i++) {
    bodyParts[i].style.display = "none";
  }
  var addDivForCentering = document.createElement("div");
  addDivForCentering.style.width = "100%";
  addDivForCentering.style.height = "600px";
  addDivForCentering.style.display = "flex";
  addDivForCentering.style.justifyContent = "center";
  addDivForCentering.style.alignItems = "center";
  addDivForCentering.setAttribute("id", "divForCenteringLoadImg");
  bodyy.appendChild(addDivForCentering);
  var divForCenteringLoadImg = document.querySelector("#divForCenteringLoadImg");
  var addLoadImg = document.createElement("img");
  addLoadImg.src = "https://pngimg.com/uploads/smiley/smiley_PNG36233.png";
  addLoadImg.setAttribute("id", "loadImg");
  divForCenteringLoadImg.appendChild(addLoadImg).style.maxWidth = "150px";
  var timeLeft = 250;
  loadImg = document.querySelector("#loadImg");
  startTimer(timeLeft);
}

function startTimer(timeLeft) {
  var start = 0;
  var timeInterval = setInterval(function () {
    timeLeft--;
    start++;
    loadImg.style.transform = "rotate(" + (start * 5) + "deg)";
    if (timeLeft == 0) {
      clearInterval(timeInterval);
      //load page 2
      location.href = "planmydate.html";
    };
  }, 20);
}