class SystemElement {
  constructor(id) {
    this.id = id;
    //this.name = "System " + id;
  }

  setup() {
    let systemsContainer = document.getElementById("systemsContainer");

    const systemElement = document.createElement("div");
    systemElement.classList.add("systemElement");
    systemElement.id = "system-" + this.id;
    systemsContainer.appendChild(systemElement);

    const systemName = document.createElement("p");
    systemName.classList.add("systemName");
    systemName.textContent = "System " + this.id;
    systemElement.appendChild(systemName);

    const systemFeatures = document.createElement("div");
    systemFeatures.classList.add("systemFeatures");
    systemElement.appendChild(systemFeatures);

    const systemControls = document.createElement("div");
    systemControls.classList.add("systemControls");
    systemFeatures.appendChild(systemControls);

    systemName.addEventListener("contextmenu", function(event) {
      event.preventDefault(); // Prevent default right-click menu
      if (systemFeatures.classList.contains("systemFeaturesShow")) {
        systemFeatures.classList.remove("systemFeaturesShow");
      } else {
        systemFeatures.classList.add("systemFeaturesShow");
      }
    });
    
    systemName.onclick = () => {
      window.location.href = "index.html";
      // get sys id


      // window.location.href = `index.html?system=${systemId}`;
    };

    let renameFunction = (e) => {
      let parentContainer = e.target.parentElement;
      let textBox = parentContainer.children[0];
      let systemElement = document.getElementById("system-" + this.id);
      let systemName = systemElement.children[0];
      systemName.textContent = textBox.value;
    };

    let deleteFunction = (e) => {
      let systemElement = document.getElementById("system-" + this.id);
      systemElement.remove();
    };

    this.createControlsTextInput(
      systemControls,
      "Rename",
      "System " + this.id,
      renameFunction
    );
    this.createButton(systemControls, "Delete", deleteFunction);
    this.createInfoBox(systemFeatures, "System Info", [
      this.id,
      "particles",
      "boom",
    ]);

    // systemsContainer.onscroll = () => {
    //
  }

  createControlsTextInput( //creates text input for system
    controlsContainer,
    buttonText,
    initalVal,
    submitButtonFunction
  ) {
    let propertyInputContainer = document.createElement("div");
    propertyInputContainer.classList.add("homeTextInput");
    controlsContainer.appendChild(propertyInputContainer);

    let propertyInputBox = document.createElement("input");
    propertyInputBox.type = "text";
    propertyInputBox.classList.add("homeControlsInputBox");
    propertyInputContainer.appendChild(propertyInputBox);

    let propertyInputButton = document.createElement("button");
    propertyInputButton.textContent = buttonText;
    propertyInputBox.classList.add("controlsInputButton");
    propertyInputContainer.appendChild(propertyInputButton);

    propertyInputBox.value = initalVal;
    propertyInputButton.onclick = submitButtonFunction;
  }

  createButton(parent, title, clickFunction) { //creates button for system
    const button = document.createElement("button");
    button.innerHTML = title;
    button.onclick = clickFunction;
    parent.appendChild(button);
  }

  createInfoBox(parent, title, values) {
    const infoBox = document.createElement("div");
    infoBox.classList.add("infoBox");
    parent.appendChild(infoBox);

    const titleElement = document.createElement("div");
    titleElement.classList.add("infoBoxTitle");
    titleElement.textContent = title;
    infoBox.appendChild(titleElement);

    const valuesContainer = document.createElement("div");
    valuesContainer.classList.add("valuesContainer");
    infoBox.appendChild(valuesContainer);

    for (let i = 0; i < values.length; i++) {
      const valueElement = document.createElement("div");
      valueElement.classList.add("infoBoxValue");
      valueElement.textContent = values[i];
      valuesContainer.appendChild(valueElement);
    }

    titleElement.onclick = () => { //shows details in info box
      if (valuesContainer.classList.contains("valuesContainerShow")) {
        valuesContainer.classList.remove("valuesContainerShow");
      } else {
        valuesContainer.classList.add("valuesContainerShow");
      }
    };
  }
}

sysList = []; //list of systems used for when not logged in


let LoggedOnData = sessionStorage.getItem("LoggedOn");
let LoggedOn;

if (LoggedOnData == null) {
  LoggedOn = false;
} else {
  LoggedOn = true;
}



let createButton = document.getElementById("systemCreateButton");

createButton.onmousedown = function () {
  createButton.src = "images/addSystemClicked.png";
};
createButton.onmouseup = function () {
  createButton.src = "images/addSystem.png";
};
createButton.onmouseleave = function () {
  createButton.src = "images/addSystem.png";
};

createButton.onclick = function () {
  //add to sys table + get id

  async function storeNewSys(sysData) {
    try { //get count of users to get the next user ID
      const response = await fetch("http://localhost:3000/getNextSysID");

      if (response.ok) {

        const data = await response.json();
        let userID = sessionStorage.getItem("userID");
        let sysID = data.totSys; //gets total num of systems as the sysID
        //let initalSysConditionsJSON = JSON.stringify(sysData);
        
        try { // insert new sys into Systems table
          const response = await fetch("http://localhost:3000/insertSys", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ sysID, sysData }), // Send username and password as JSON
          });

          if (response.ok) {
            const data = await response.json();

            let newSystem = new SystemElement(sysID); // creates new system div
            newSystem.setup(); 

          } else {
            const errorData = await response.json();
            alert("Error: " + errorData.error); // Show error message
          }
        } catch (error) {
          alert("Error: " + error.message); // Handle any fetch errors
        }


        try { //insert new sys-user relationship into UserSystemRelation
          const response = await fetch("http://localhost:3000/insertUserSysRelation", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ userID, sysID }), // Send username and password as JSON
          });

          if (!response.ok) {
            const errorData = await response.json();
            alert("Error: " + errorData.error); // Show error message
          }
        } catch (error) {
          alert("Error: " + error.message); // Handle any fetch errors
        }


      } else {
        const errorData = await response.json();
        alert("Error: " + errorData.error);
      }
    } catch (error) {
      alert("Error: " + error.message);
    }
  }
  
  if (LoggedOn) { //store data
    let sysData = {
      id: this.id,
      g: this.g,
      scale: this.scale,
      t: this.t,
      t0: this.t0,
      coefficientOfRestitution: this.coefficientOfRestitution,
      particles: [],
      points: [],
      particlePointRelations: {},
    };

    let sysDataJSON = JSON.stringify(sysData)
    storeNewSys(sysDataJSON);
  } else { //dont store data
    let newSystem = new SystemElement(sysList.length);
    newSystem.setup();
    sysList.push(sysList.length + 1);
  };
  

  
};

let profileButton = document.getElementById("profileButton");

profileButton.onmousedown = function () {
  profileButton.src = "images/profileColouredPressed.png";
};
profileButton.onmouseup = function () {
  profileButton.src = "images/profileColoured.png";
};
profileButton.onmouseleave = function () {
  profileButton.src = "images/profileColoured.png";
};

profileButton.onclick = function () { //checks if logged in
  window.location.href = "login.html";
};

function loadUserSystems() {
  let userID = sessionStorage.getItem("userID");
  //select all the systems user has and create system for each.

}


