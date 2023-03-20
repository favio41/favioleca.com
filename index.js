function changeSpeed(speed) {
  [...document.getElementsByTagName("animate")].forEach((element) => {
    element.setAttribute("dur", speed + "s");
  });
}

document.getElementById("speed").onchange = function (event) {
  var speed = event.target.value;
  changeSpeed(speed);
};

changeSpeed(document.getElementById("speed").value);
