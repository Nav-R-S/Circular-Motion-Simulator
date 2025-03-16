let homeButton = document.getElementById("homeButton");
let backButton = document.getElementById("backButton");
let registerButton = document.getElementById("registerButton");

backButton.onclick = function () { 
  window.location.href = "login.html";
};

homeButton.onclick = function () {
  window.location.href = "home.html";
};

registerButton.onclick = function () {
  const newUser = {
    userID: 1,
    username: "Bavaneeth",
    password: "hello123",
  };

  fetch("http://localhost:5000/add-userdata", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(newUser),
  })
    .then((response) => response.json())
    .then((data) => {
      console.log("User added:", data);
    })
    .catch((error) => console.error("Error adding data:", error));
};


