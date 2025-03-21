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

  try { //checking if details exists
     const response = await fetch("http://localhost:3000/checkUserDetails", {
       method: "POST",
       headers: {
         "Content-Type": "application/json",
       },
       body: JSON.stringify({ username, password }), // Send username and password as JSON
     });
    
    if (response.ok) { //checks if response is successful
      const data = await response.json();

      if (data && data.exists) { //checks if username exists and if response exists
        console.log("User exists");
      } else {
        alert("User does not exist"); // Show error message
        return;
      }
    }
  }
  catch (error) {
    alert('Error: ' + error.message);
  }
});
