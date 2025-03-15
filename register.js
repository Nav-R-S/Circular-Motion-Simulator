let homeButton = document.getElementById("homeButton");
let backButton = document.getElementById("backButton");

backButton.onclick = function () { 
  window.location.href = "profile.html";
};

homeButton.onclick = function () {
  window.location.href = "home.html";
};
