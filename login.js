let loginContentContainer = document.getElementById("loginContentContainer");
let signOut = document.getElementById("signOutDiv");

if (sessionStorage.getItem("LoggedOn")) {
  loginContentContainer.style.display = "none";
  signOut.style.display = "flex"; // Show the sign out div if logged in
} else {
  loginContentContainer.style.display = "flex"; // Show the login content container
  signOut.style.display = "none"; 
}

signOut.onclick = function () {
  sessionStorage.removeItem("LoggedOn"); 
  sessionStorage.removeItem("userID"); 
  loginContentContainer.style.display = "flex"; 
  signOut.style.display = "none"; 
  window.location.href = "login.html"; 
  window.location.reload(); 
}


let homeButton = document.getElementById("homeButton");

homeButton.onclick = function () {
  window.location.href = "home.html";
};

document.getElementById('loginForm').addEventListener('submit', async function (event) {
  event.preventDefault(); // Prevent the form from submitting and refreshign the page like it normally would
  
  const username = document.getElementById("loginUsername").value;
  const password = document.getElementById("loginPassword").value;

  if (!username || !password) {
      alert('Please fill in all fields');
      return;
  }

  try {
    const response = await fetch("http://localhost:3000/checkUserDetails", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }), // Send username and password as JSON
    });

    const data = await response.json(); // Get the JSON data from the response

    console.log("Response data:", data); // Log the response data

    if (response.ok) {
      // checks if the response is successful
      if (data.message === "Login successful") {

        sessionStorage.setItem("userID", data.userID); // Store the username (or any other necessary data)
        sessionStorage.setItem("LoggedOn", true); // Store the login state

        window.location.href = "home.html"; // Redirect to the home page after successful login
      } else {
        alert("User does not exist or incorrect password");
      }
    } else {
      alert("Error: " + data.error || "Something went wrong");
    }
  } catch (error) {
    alert("Error: " + error.message);
  }

});
