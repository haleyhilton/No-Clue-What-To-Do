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





//form submit functionality
var dataFromForm = [];
//clear any prior existing dataFromForm locally stored data
if (localStorage.getItem("dataFromForm")) {
  localStorage.setItem("dataFromForm", dataFromForm);
}
var loadPageTwoNormalBtn = document.querySelector("#loadPageTwoNormalBtn");
var dateSelector = document.querySelector("#date-selector");
var cityInput = document.querySelector("#cityInput");
var stateInput = document.querySelector("#stateInput");
var activityInput = document.querySelector("#exampleFormControlSelect1");
loadPageTwoNormalBtn.addEventListener("click", function(event) {
  event.preventDefault();
  //save input data to local storage
  dataFromForm.push(dateSelector.value);
  dataFromForm.push(cityInput.value);
  dataFromForm.push(stateInput.value);
  dataFromForm.push(activityInput.value);
  localStorage.setItem("dataFromForm", JSON.stringify(dataFromForm));
  //load page 2
  location.href = "planmydate.html";
})