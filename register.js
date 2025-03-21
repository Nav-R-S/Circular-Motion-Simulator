let homeButton = document.getElementById("homeButton");
let backButton = document.getElementById("backButton");
let registerButton = document.getElementById("registerButton");

backButton.onclick = function () { 
  window.location.href = "login.html";
};

homeButton.onclick = function () {
  window.location.href = "home.html";
};

document.getElementById('registerForm').addEventListener('submit', async function (event) {
  event.preventDefault(); // Prevent the form from submitting and refreshign the page like it normally would

  const username = document.getElementById("registerUsername").value;
  const password = document.getElementById("registerPassword").value;
  const passwordConfirm = document.getElementById("registerConfirmPassword").value;
  let userID = 0;

  if (!username || !password || !passwordConfirm) {
      alert('Please fill in all fields');
      return;
  }

  if (password !== passwordConfirm) {
      alert('Passwords do not match');
      return;
  }

  try { //checking if username exists
     const response = await fetch("http://localhost:3000/checkUsernameExists", {
       method: "POST",
       headers: {
         "Content-Type": "application/json",
       },
       body: JSON.stringify({ username }), // Send username and password as JSON
     });
    
    if (response.ok) { //checks if response is successful
      const data = await response.json();

      if (data && data.exists) { //checks if username exists and if response exists
        alert('Username already exists'); // Show error message
        return;
      }
    } 
  }
  catch (error) {
    alert('Error: ' + error.message);
  }



  try { //get count of users to get the next user ID
    const response = await fetch("http://localhost:3000/getNextUserID");

    if (response.ok) {

      const data = await response.json();
      console.log("Total Users:", data.totUsers); // Show total number of users
      userID = data.totUsers; //define userID as the total number of users

    } else {
      const errorData = await response.json();
      alert("Error: " + errorData.error);
    }
  } catch (error) {
    alert("Error: " + error.message);
  }



  try { // request to add a new user
    console.log('Request snet')
    const response = await fetch("http://localhost:3000/insertUser", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userID, username, password }), // Send username and password as JSON
    });

    if (response.ok) {
      const data = await response.json();
      alert(data.message); // Show success message
    } else {
      const errorData = await response.json();
      alert('Error: ' + errorData.error); // Show error message
    }
  } catch (error) {
    alert('Error: ' + error.message); // Handle any fetch errors
  }
});


