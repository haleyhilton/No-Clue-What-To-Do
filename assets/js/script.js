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