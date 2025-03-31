sysList = [];

window.addEventListener(`contextmenu`, (e) => e.preventDefault()); // gets rid of context menu on right click

class Vector {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.angle = this.getAngle();
  };

  getMagnitude() {
    return Math.sqrt(this.x ** 2 + this.y ** 2);
  };

  getUnitVector() {
    let mag = this.getMagnitude();
    return new Vector(this.x / mag, this.y / mag);
  };

  getAngle() {
    return Math.atan2(this.y, this.x); //returns the angle in the plane (in radians) between the positive x-axis and the ray from (0, 0) to the point (x, y)
  };

  getDotProduct(v) {
    return this.x * v.x + this.y * v.y;
  };

  setXAndY(len, angle) {
    this.x = len * Math.cos(angle);
    this.y = len * Math.sin(angle);
  };

  scale(scalar) {
    this.x *= scalar;
    this.y *= scalar;
  };

  getCrossProduct(v) {
    return this.x * v.y - this.y * v.x;
  };

  getScale(scalar) {
    let newX = this.x * scalar;
    let newY = this.y * scalar;
    return new Vector(newX, newY);
  };

  getAddition(v) {
    let newX = this.x + v.x;
    let newY = this.y + v.y;
    return new Vector(newX, newY);
  };

  getSubtraction(v) {
    let newX = this.x - v.x;
    let newY = this.y - v.y;
    return new Vector(newX, newY);
  };

  getCopy() {
    let newX = this.x;
    let newY = this.y;
    return new Vector(newX, newY);
  }
};

class System {
  constructor(id) {
    this.id = id;
    this.g = 9.81;
    this.scale = 100;
    this.elements = [];
    this.points = [];
    this.particles = [];
    this.started = false;
    this.play = false;
    this.t = 0;
    this.t0 = 0;

    this.particleCreationOn = false;
    this.pointCreationOn = false;
    this.objectsMenuOpen = false;
    this.particleCategoryOn = false;

    this.grid;
    this.width;
    this.height;
    this.gridSize = 50;
    this.smallestX = -2000;
    this.smallestY = -2000;

    this.coefficientOfRestitution = 1;
    this.delete = false;
  }

  setup() {
    let timeBar = document.getElementById("timeBar");
    let playButton = document.getElementById("playButton");
    let pauseButton = document.getElementById("pauseButton");
    let resetButton = document.getElementById("resetButton");
    let objectsMenuButton = document.getElementById("objectsMenuButton");
    let createParticleButton = document.getElementById("createParticleButton");
    let createPointButton = document.getElementById("createPointButton");
    let homeButton = document.getElementById("homeButton");
    let saveButton = document.getElementById("saveButton");
    let binButton = document.getElementById("binButton");
    let profileButton = document.getElementById("profileButton");
    let sys = this;
    timeBar.max = 0;
    timeBar.min = 0;

    saveButton.onmousedown = function () {
      saveButton.src = "images/savePressed.png";
      saveButton.classList.toggle("toolbarButtonPressed");
    };

    saveButton.onmouseup = function () {
      saveButton.src = "images/save.png";
      saveButton.classList.toggle("toolbarButtonPressed");
    };

    saveButton.onmouseleave = function () {
      saveButton.src = "images/save.png";
      if (saveButton.classList.contains("toolbarButtonPressed")) {
        saveButton.classList.toggle("toolbarButtonPressed");
      };
    };

    saveButton.onclick = () => {
      this.saveToDB();
    };

    homeButton.onmousedown = function () {
      homeButton.src = "images/homeColouredPressed.png";
      homeButton.classList.toggle("toolbarButtonPressed");
    };

    homeButton.onmouseup = function () {
      homeButton.src = "images/homeColoured.png";
      homeButton.classList.toggle("toolbarButtonPressed");
    };
    
    homeButton.onmouseleave = function () {
      homeButton.src = "images/homeColoured.png";
      homeButton.classList.toggle("toolbarButtonPressed");
      if (homeButton.classList.contains("toolbarButtonPressed")) {
        homeButton.classList.toggle("toolbarButtonPressed");
      }
    };

    homeButton.onclick = () => {
      window.location.href = "home.html";
    };

    profileButton.onclick = () => {
      window.location.href = "login.html";
    };

    createParticleButton.onclick = function () {
      createNewParticle();
    };

    createPointButton.onclick = function () {
      createNewPoint();
    };

    let createNewParticle = () => {
      createParticleButton = document.getElementById("createParticleButton");
      if (this.particleCreationOn) {
        createParticleButton.src = "images/circleColoured.png";
        this.particleCreationOn = false;
      } else {
        this.creationReset();
        createParticleButton.src = "images/circleColouredPressed.png";
        this.particleCreationOn = true;
      }
      createParticleButton.classList.toggle("toolbarButtonPressed");
    };

    let createNewPoint = () => {
      createPointButton = document.getElementById("createPointButton");
      if (this.pointCreationOn) {
        createPointButton.src = "images/pointColoured.png";
        this.pointCreationOn = false;
      } else {
        this.creationReset();
        createPointButton.src = "images/pointColouredPressed.png";
        this.pointCreationOn = true;
      };
      createPointButton.classList.toggle("toolbarButtonPressed");
    };

    timeBar.oninput = () => {
      this.t = parseFloat(timeBar.value);
    };

    playButton.onmousedown = () => {
      if (this.play == false) {
        if (!this.started) {
          for (let particle of this.particles) {
            if (particle.originPoint) {
              particle.setupParticle(particle.initialVel, particle.initialAngle, particle.lineDist);
              particle.initialConditions[this.t] = [particle.initialAngle, particle.initialVel, particle.lineDist]
            };
          };
          this.started = true;
        };
        this.play = true;
      };
    };

    pauseButton.onmousedown = () => {
      if (this.play == true) {
        this.play = false;
        timeBar.value = this.t;
      };
    };

    resetButton.onmousedown = () => {
      resetButton.src = "images/resetButtonColouredPressed.png";
      resetButton.classList.toggle("toolbarButtonPressed");
    };

    resetButton.onmouseup = () => {
      resetButton.src = "images/resetButtonColoured.png";
      resetButton.classList.toggle("toolbarButtonPressed");
    };

    resetButton.onmouseleave = () => {
      resetButton.src = "images/resetButtonColoured.png";
      if (resetButton.classList.contains("toolbarButtonPressed")) {
        resetButton.classList.toggle("toolbarButtonPressed");
      }
    };

    resetButton.onclick = () => {
      this.resetSys();
      for (let particle of this.particles) {
        if (particle.originPoint) {
          particle.angle = particle.initialAngle;
          particle.updatePosition();
        };
        particle.keList = [];
      };
    };

    profileButton.onmousedown = function () {
      profileButton.src = "images/profileColouredPressed.png";
      profileButton.classList.toggle("toolbarButtonPressed");
    };
    profileButton.onmouseup = function () {
      profileButton.src = "images/profileColoured.png";
      profileButton.classList.toggle("toolbarButtonPressed");
    };
    profileButton.onmouseleave = function () {
      profileButton.src = "images/profileColoured.png";
      if (profileButton.classList.contains("toolbarButtonPressed")) {
        profileButton.classList.toggle("toolbarButtonPressed");
      }
    };

    binButton.onclick = function () {
      if (sys.delete) {
        sys.delete = false;
        console.log(sys.delete)
      } else {
        sys.delete = true;
        console.log(sys.delete);
      }
      if (binButton.classList.contains("toolbarButtonPressed")) {
        binButton.src = "images/trashColoured.png";
        //this.delete = false;
      } else {
        binButton.src = "images/trashColouredPressed.png";
        //this.delete = true;
      }
      binButton.classList.toggle("toolbarButtonPressed");
    };

    objectsMenuButton.onclick = () => {
      let sys = this;
      creationValuesReset()
      if (sys.objectsMenuOpen) {
        objectsMenuButton.src = "images/objectsColoured.png";
        sys.objectsMenuOpen = false;
      } else {
        objectsMenuButton.src = "images/objectsColouredPressed.png";
        sys.objectsMenuOpen = true;
      };
      let objectsMenu = document.getElementById("objectsMenu");
      objectsMenu.classList.toggle("showCategories");
      objectsMenuButton.classList.toggle("toolbarButtonPressed");
    };

    let creationValuesReset = () => {
      this.creationReset()
    };

    this.updateSysDimensions(window.innerWidth, window.innerHeight - 100);
    //this.createGrid(this.width, this.height, this.gridSize);

    this.createEnvControls();
  };



  checkCollisions(obj) { //TODO handle edge cases-----------------------------------------------------------------------------------------------------


    for (let otherObj of this.particles) {
      if (otherObj.originPoint && obj !== otherObj && this.checkIfCollisionDetected(obj, otherObj) && !obj.overlapedObjects.includes(otherObj)) {
        console.log("Collision detected-----------------------------------------------------------------------------------------------------------------------------------------", this.t);
        console.log(obj.id, "before: ", obj.velocity.x, obj.velocity.y, otherObj.id, "before: ", otherObj.velocity.x, otherObj.velocity.y);
        this.handleCollision(obj, otherObj);
        console.log(obj.id, "after: ", obj.velocity.x, obj.velocity.y, otherObj.id, "after: ", otherObj.velocity.x, otherObj.velocity.y);
        console.log("Collision handled-----------------------------------------------------------------------------------------------------------------------------------------", this.t);
      }
    } 
  };

  checkIfCollisionDetected(obj1, obj2) {
    let dx = obj1.x - obj2.x;
    let dy = obj1.y - obj2.y;
    let dist = sqrt(dx ** 2 + dy ** 2);
    if (dist <= obj1.radius + obj2.radius) { //checks if centres are closer than the sum of the radii (which shouldnt happen)
      return true;
    } else {
      return false;
    };
  };

  handleCollision(obj1, obj2) {
    obj1.overlapedObjects.push(obj2);
    obj2.overlapedObjects.push(obj1);

    let vObj1 = new Vector(0, 0);
    let vObj2 = new Vector(0, 0);

    if (obj1.updated == false) {
      obj1.prevVelocity.x = obj1.velocity.x;
      obj1.prevVelocity.y = obj1.velocity.y;

      //variable for velocity of the object
      vObj1.x = obj1.velocity.x;
      vObj1.y = obj1.velocity.y;

      obj1.updated = true;
    } else {
      //variable for previous velocity of the object
      vObj1.x = obj1.prevVelocity.x;
      vObj1.y = obj1.prevVelocity.y;
    }

    if (obj2.updated == false) {
      obj2.prevVelocity.x = obj2.velocity.x;
      obj2.prevVelocity.y = obj2.velocity.y;

      //variable for velocity of the object
      vObj2.x = obj2.velocity.x;
      vObj2.y = obj2.velocity.y;

      obj2.updated = true;
    } else {
      //variable for previous velocity of the object
      vObj2.x = obj2.prevVelocity.x;
      vObj2.y = obj2.prevVelocity.y;
    }

    let lineofImpact = new Vector(obj2.x - obj1.x, obj2.y - obj1.y);
    let normalisedLineOfImpact = lineofImpact.getUnitVector(); //gets the unit vector of the line of impact

    let vnObj1 = vObj1.getUnitVector(); //gets unit vector of velocity of obj1
    let vnObj2 = vObj2.getUnitVector(); //gets unit vector of velocity of obj2

    //gets component of velocity in the direction of the line of impact (as a scalar)
    let vObj1LineOfImpact = vObj1.getDotProduct(normalisedLineOfImpact);
    let vObj2LineOfImpact = vObj2.getDotProduct(normalisedLineOfImpact);

    //get inital velocity in vector form
    let ivObj1LOI = new Vector(
      normalisedLineOfImpact.x,
      normalisedLineOfImpact.y
    ); //inital velocity of obj1 in the line of impact direction
    ivObj1LOI.scale(vObj1LineOfImpact);

    let ivObj2LOI = new Vector(
      normalisedLineOfImpact.x,
      normalisedLineOfImpact.y
    ); //initial velocity of obj2 in the line of impact direction
    ivObj2LOI.scale(vObj2LineOfImpact);

    //calculates the final velocities of the objects in the line of impact direction in scalar form using coefficient of restitution formula
    let obj1n =
      obj1.mass * vObj1LineOfImpact +
      obj2.mass * vObj2LineOfImpact +
      obj2.mass *
        this.coefficientOfRestitution *
        (vObj2LineOfImpact - vObj1LineOfImpact);
    obj1n /= obj1.mass + obj2.mass;

    let obj2n =
      obj2.mass * vObj2LineOfImpact +
      obj1.mass * vObj1LineOfImpact +
      obj1.mass *
        this.coefficientOfRestitution *
        (vObj1LineOfImpact - vObj2LineOfImpact);
    obj2n /= obj1.mass + obj2.mass;

    //get final velocity in vector form
    let fvObj1LOI = new Vector(
      normalisedLineOfImpact.x,
      normalisedLineOfImpact.y
    ); //final velocity of obj1 in the line of impact direction
    fvObj1LOI.scale(obj1n);

    let fvObj2LOI = new Vector(
      normalisedLineOfImpact.x,
      normalisedLineOfImpact.y
    ); //final velocity of obj2 in the line of impact direction
    fvObj2LOI.scale(obj2n);

    let fvObj1Perp = new Vector(vObj1.x - ivObj1LOI.x, vObj1.y - ivObj1LOI.y); //final velocity of obj1 perpendicular to the line of impact
    let fvObj2Perp = new Vector(vObj2.x - ivObj2LOI.x, vObj2.y - ivObj2LOI.y); //final velocity of obj2 perpendicular to the line of impact

    obj1.velocity.x = fvObj1Perp.x + fvObj1LOI.x;
    obj1.velocity.y = fvObj1Perp.y + fvObj1LOI.y;

    obj2.velocity.x = fvObj2Perp.x + fvObj2LOI.x;
    obj2.velocity.y = fvObj2Perp.y + fvObj2LOI.y;

    // sets up the initial angle for solving the differential equation (using runge kutta)
    obj1.initialAngle = parseFloat(obj1.angle);
    obj2.initialAngle = parseFloat(obj2.angle);

    //this.t0 = this.t;

    // to get component of velocity perpendicular to the line connecting particle and point
    // need to dot product the new velocity vector with the unit vector of the previous velocity vector

    
    if (obj1.velocity.getCrossProduct(obj1.pos) < 0) {
      //if the cross product is negative then rotation is clockwise
      obj1.initialVel = -1 * Math.abs(obj1.velocity.getDotProduct(vnObj1));
    } else {
      obj1.initialVel = Math.abs(obj1.velocity.getDotProduct(vnObj1));
    }
    obj1.lineDist = obj1.getLineDist();
    obj1.initialAngle = obj1.getAngleFromPos();
    obj1.initialConditions[this.t] = [obj1.initialAngle, obj1.initialVel, obj1.lineDist]

    if (obj2.velocity.getCrossProduct(obj2.pos) < 0) {
      //if the cross product is negative then rotation is clockwise
      obj2.initialVel = -1 * Math.abs(obj2.velocity.getDotProduct(vnObj2));
    } else {
      obj2.initialVel = Math.abs(obj2.velocity.getDotProduct(vnObj2));
    }
    obj2.lineDist = obj2.getLineDist();
    obj2.initialAngle = obj2.getAngleFromPos();
    obj2.initialConditions[this.t] = [obj2.initialAngle, obj2.initialVel, obj2.lineDist]
  }

  updateSysDimensions(w, h) {
    this.width = w;
    this.height = h;
  };

  particleCreation() {
    if (this.particleCreationOn) {
      this.createParticle(mouseX, mouseY, this.randColour());
    }
  }

  pointCreation() {
    if (this.pointCreationOn) {
      this.createPoint(mouseX, mouseY);
    }
  }

  creationReset() {
    this.particleCreationOn = false;
    this.pointCreationOn = false;
    let createParticleButton = document.getElementById("createParticleButton");
    let createPointButton = document.getElementById("createPointButton");
    createParticleButton.src = "images/circleColoured.png";
    createPointButton.src = "images/pointColoured.png";
    createParticleButton.classList.remove("toolbarButtonPressed");
    createPointButton.classList.remove("toolbarButtonPressed");
  }

  createControlsScrollInput(controlsContainer, title, min, max, initialVal, sliderFunction, textboxFunction) {
    //everything as a string input
    let propertyTitle = document.createElement("p");
    propertyTitle.textContent = title;
    controlsContainer.appendChild(propertyTitle);

    let propertyInputContainer = document.createElement("div");
    propertyInputContainer.classList.add("scrollInput");
    controlsContainer.appendChild(propertyInputContainer);

    let propertySlider = document.createElement("input");
    propertySlider.type = "range";
    propertySlider.min = min;
    propertySlider.max = max;
    propertySlider.value = initialVal;
    propertySlider.classList.add("controlsSlider");
    propertyInputContainer.appendChild(propertySlider);

    let propertyInputBox = document.createElement("input");
    propertyInputBox.type = "text";
    propertyInputBox.classList.add("controlsInputBox");
    propertyInputContainer.appendChild(propertyInputBox);

    propertySlider.oninput = sliderFunction;
    
    propertyInputBox.oninput = textboxFunction;
  }
  // creates slider for object elements in menu

  createControlsTextInput(controlsContainer, title, buttonText, submitButtonFunction, InputBoxId) {
    let propertyTitle = document.createElement("p");
    propertyTitle.textContent = title;
    controlsContainer.appendChild(propertyTitle);

    let propertyInputContainer = document.createElement("div");
    propertyInputContainer.classList.add("textInput");
    controlsContainer.appendChild(propertyInputContainer);

    let propertyInputBox = document.createElement("input");
    propertyInputBox.type = "text";
    propertyInputBox.classList.add("controlsInputBox");
    propertyInputBox.id = InputBoxId;
    propertyInputContainer.appendChild(propertyInputBox);

    let propertyInputButton = document.createElement("button");
    propertyInputButton.textContent = buttonText;
    propertyInputBox.classList.add("controlsInputButton");
    propertyInputContainer.appendChild(propertyInputButton);

    propertyInputButton.onclick = submitButtonFunction;
  }
  // creates textbox and submit button for object elements in menu

  createControlsCheckbox(controlsContainer, title) {
    let propertyTitle = document.createElement("p");
    propertyTitle.textContent = title;
    controlsContainer.appendChild(propertyTitle);

    let propertyInputContainer = document.createElement("div");
    propertyInputContainer.classList.add("textInput");
    controlsContainer.appendChild(propertyInputContainer);

    let propertyInputBox = document.createElement("input");
    propertyInputBox.type = "checkbox";
    propertyInputBox.classList.add("controlsCheckbox");
    propertyInputContainer.appendChild(propertyInputBox);
  }

  createControlsLink(controlsContainer, linkText, linkFunction) {
    let propertyText = document.createElement("p");
    propertyText.textContent = linkText;
    propertyText.onclick = linkFunction;
    controlsContainer.appendChild(propertyText);
  }

  createControlsRadioBox(controlsContainer, title, name, radioBoxFunction) {
    let propertyTitle = document.createElement("p");
    propertyTitle.textContent = title;
    controlsContainer.appendChild(propertyTitle);

    let propertyInputContainer = document.createElement("div");
    propertyInputContainer.classList.add("radioInput");
    controlsContainer.appendChild(propertyInputContainer);

    let propertyRadioBox = document.createElement("input");
    propertyRadioBox.type = "radio";
    propertyRadioBox.name = name;
    propertyRadioBox.onclick = radioBoxFunction;
    propertyRadioBox.classList.add("controlsRadioBox");
    propertyInputContainer.appendChild(propertyRadioBox);
  };
  
  createEnvControls() {
    const envCategory = document.getElementById("environmentHeading");
    const envContent = document.getElementById("environmentContent");


    let sys = this
    this.createControlsTextInput(envContent, "Gravity", "Set Gravity", (e) => {
      //console.log(parseFloat(e.target.value), "value");
      let parentContainer = e.target.parentElement;
      let textBox = parentContainer.children[0]; //text box is the first element under the parent
      let gravityValue = parseFloat(textBox.value);
      if (!isNaN(gravityValue)) {
        sys.g = gravityValue;
        sys.resetSys();
      } else {
        alert(
          "Please enter a valid number for gravity"
        );
      }
      sys.g = gravityValue;
      sys.resetSys();
    }, "gravityTextbox");

    this.createControlsTextInput(envContent, "Coefficient Of Restitution", "Set COR", (e) => {
      //console.log(parseFloat(e.target.value), "value");
      let parentContainer = e.target.parentElement;
      let textBox = parentContainer.children[0]; //text box is the first element under the parent
      let CORValue = parseFloat(textBox.value);
      if (!isNaN(CORValue)) {
        sys.coefficientOfRestitution = CORValue;
        sys.resetSys();
      } else {
        alert("Please enter a valid number for the coefficient of restitution.");
      }
    }, "CORTextbox");

  }
 
  createParticle(x, y, colour) {
    let particleID = this.particles.length;
    let newParticle = new Particle(particleID, this, x, y, colour);
    this.particles.push(newParticle);
    this.elements.push(newParticle);
    //sets up particle

    const particleElement = document.createElement("div");
    const particleContent = document.getElementById("particlesContent");
    const particleNameDisplay = document.createElement("p");
    let particleName = "particle " + particleID;
    particleElement.id = "particle-" + particleID;
    particleContent.appendChild(particleElement);
    particleElement.classList.add("object");
    particleNameDisplay.textContent = particleName;
    particleElement.appendChild(particleNameDisplay);
    //creates a html element for particle and the particle heading

    const particleCategory = document.getElementById("particlesHeading");
    particleCategory.onclick = () => {
      const particleContent = document.getElementById("particlesContent");
      let particleElementList = particleContent.children;

      if (this.particleCategoryOn) { 
        this.particleCategoryOn = false;
        for (let i = 0; i < particleElementList.length; i++) {
          particleElementList[i].classList.remove("showObject");
        }
      } else {     
        this.particleCategoryOn = true;
        for (let i = 0; i < particleElementList.length; i++) {
          particleElementList[i].classList.add("showObject");
        }
      }  
    };
    //toggles visibility of the particle elements when the heading is clicked

    createParticleControls(particleElement, this);

    function createParticleControls(particleElement, sys) {
      let particleElementList = particleElement.id.split("-");
      particleID = particleElementList[particleElementList.length - 1];

      let controlsContainer = document.createElement("div");
      controlsContainer.classList.add("controls");
      particleElement.appendChild(controlsContainer);

      let massSubmit = (e) => {
        let particle = sys.particles[particleID];
        let parentContainer = e.target.parentElement;
        let textBox = parentContainer.children[0]; //text box is the first element under the parent
        let massValue = textBox.value;
        if (!isNaN(massValue)) {
          particle.mass = parseFloat(massValue);
          sys.resetSys();
        } else {
          textBox.value = particle.mass;
        }
      };

      let initialVelocitySubmit = (e) => {
        let particle = sys.particles[particleID];
        let parentContainer = e.target.parentElement;
        let textBox = parentContainer.children[0]; //text box is the first element under the parent
        let initialVelocityValue = textBox.value;
        if (!isNaN(initialVelocityValue)) {
          particle.initialVel = parseFloat(initialVelocityValue);
          sys.resetSys();
          particle.initialAngle = particle.getAngleFromPos();
        } else {
          textBox.value = particle.initialVel;
        };
      };

      let initialAngleSubmit = (e) => {
        let particle = sys.particles[particleID];
        let parentContainer = e.target.parentElement;
        let textBox = parentContainer.children[0]; //text box is the first element under the parent
        let initialAngleValue = textBox.value;
        if (!isNaN(initialAngleValue)) { //&& initialAngleValue <= (2 * Math.PI) && initialAngleValue >= 0) {
          particle.initialAngle = parseFloat(initialAngleValue);
          particle.angle = parseFloat(initialAngleValue);
          sys.resetSys();
          particle.updatePosition();
        } else {
          textBox.value = particle.initialAngle;
        };
      };

      let radiusSlider = (e) => {
        let particle = sys.particles[particleID];
        let sliderInput = e.target.value
        let parentContainer = e.target.parentElement
        let radiusTextBox =  parentContainer.children[1] // gets textbox which is second child of parent conatiner
        particle.radius = sliderInput;
        radiusTextBox.value = sliderInput;
      };

      let lineDistSlider = (e) => {
        let particle = sys.particles[particleID];
        let sliderInput = e.target.value
        let parentContainer = e.target.parentElement
        let lineDistTextBox = parentContainer.children[1] // gets textbox which is second child of parent conatiner
        particle.lineDist = sliderInput;
        lineDistTextBox.value = sliderInput;
      };

      let radiusTextbox = (e) => {
        let particle = sys.particles[particleID];
        let textInput = e.target.value;
        let parentContainer = e.target.parentElement;
        let radiusSlider = parentContainer.children[0];
        if (!isNaN(textInput)) {
          if (textInput <= 50 && textInput >= 0) {
            particle.radius = textInput;
            radiusSlider.value = textInput;
          };
        };
      };

      let lineDistTextbox = (e) => {
        let particle = sys.particles[particleID];
        let textInput = e.target.value;
        let parentContainer = e.target.parentElement;
        let lineDistSlider = parentContainer.children[0];
        if (!isNaN(textInput)) {
          if (textInput <= 2000 && textInput >= 0) {
            particle.lineDist = textInput;
            lineDistSlider.value = textInput;
          };
        };
      };

      let createGraphLinkFunction = () => {
        let particle = sys.particles[particleID];
        sys.storeData(particle); //passes particle class
        window.location.href = "graph.html";
      }

      sys.createControlsScrollInput(
        controlsContainer,
        "Particle Radius",
        "1",
        "50",
        "12.5",
        radiusSlider,
        radiusTextbox
      );

      sys.createControlsScrollInput(
        controlsContainer,
        "Line Radius",
        "0",
        "2000",
        sys.particles[particleID].lineDist,
        lineDistSlider,
        lineDistTextbox
      );

      sys.createControlsTextInput(
        controlsContainer,
        "Mass",
        "Set Mass",
        massSubmit
      );

      sys.createControlsTextInput(
        controlsContainer,
        "Angle",
        "Set Angle",
        initialAngleSubmit
      );

      sys.createControlsTextInput(
        controlsContainer,
        "Velocity",
        "Set Velocity",
        initialVelocitySubmit,
        "particle-" + particleID + "-velocity"
      );

      sys.createControlsLink(controlsContainer, "Graph", createGraphLinkFunction);
    };

    particleNameDisplay.onclick = function () {
      let particleElement = this.parentElement;
      let childList = particleElement.children;
      let controls = childList[1];
      controls.classList.toggle("showControls");
    };

    if (sessionStorage.getItem("LoggedOn")) {
      getParticleID(this.particles[particleID], this);
    }
    // addParticle(globalParticalID, this);

    async function getParticleID(particle, sys) { //need particle id when creating new particle to store in global table (Particles)

      try {
        const response = await fetch("http://localhost:3000/getNextParticleID");

        if (response.ok) {
          const data = await response.json();

          let globalParticleID = data.totParticles; //ids from various systems stored in db (globally)
          console.log(globalParticleID, "globalParticleID")

          particle.id = globalParticleID; //sets the id to match db

          addParticle(globalParticleID, particle, sys);
        } else {
          const errorData = await response.json();
          alert("Error: " + errorData.error);
        }
      } catch (error) {
        alert("Error: " + error.message);
      }
      
    }

    
    async function addParticle(particleID, particle, sys) {
      //save generic data
      //get particle id via count
      //insert particle table
      //insert particle-sys relation table

      //let particle = sys.particles.find((particle) => particle.id === particleID);
      //let particle = sys.particles[particleID]
      console.log(particle)
      console.log(sys, "sys")

      let particleData = {
        id: particleID,
        // sys: particle.sys,
        radius: particle.radius,
        pos: { x: particle.pos.x, y: particle.pos.x }, //Vector obj
        x: particle.x,
        y: particle.y,
        angle: particle.angle,
        velocity: { x: particle.velocity.x, y: particle.velocity.y }, //Vector obj
        mass: particle.mass,
        //drag: particle.drag,
        //originPoint: particle.originPoint,
        lineDist: particle.lineDist,
        initialVel: particle.initialVel,
        initialAngle: particle.initialAngle,
        colour: particle.colour,
        // lastColl: particle.lastColl,
        prevVelocity: { x: particle.prevVelocity.x, y: particle.prevVelocity.y }, //Vector obj
        updated: particle.updated,
        initialConditions: JSON.stringify(particle.initialConditions),
        //overlapedObjects: particle.overlapedObjects,
        inFreeFall: particle.inFreeFall,
        freeFallInitialConditions: JSON.stringify(particle.freeFallInitialConditions),
        keList: JSON.stringify(particle.keList)
      };
      
      let sysID = sys.id;


      try {
        const response = await fetch("http://localhost:3000/insertParticle", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ particleID, particleData: JSON.stringify(particleData) }),
        });

        if (response.ok) {
          const data = await response.json();
          let result = data.system;

          //create relation
          try {
            const response = await fetch("http://localhost:3000/insertSysParticleRelation", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ sysID, particleID }),
            });

            if (response.ok) {
              const data = await response.json();
              let result = data.system;

              

              
              
            } else {
              const errorData = await response.json();
              alert("Error: " + errorData.error); // Show error message
            }
          } catch (error) {
            alert("Error: " + error.message); // Handle any fetch errors
          };

          
        } else {
          const errorData = await response.json();
          alert("Error: " + errorData.error); // Show error message
        }
      } catch (error) {
        alert("Error: " + error.message); // Handle any fetch errors
      };
    };

  };



  loadFromDB() {
    //get particle data
    //get point data
    //get relations for particle-point
    //set up relationship by for each entry in db --> setting val of particle.originpoint and point.particle


    let sysID = sessionStorage.getItem("systemID");
    getSysData(sysID, this);
    getParticles(sysID, this);


    getPoints(sysID, this);
    getParticlePointRel(sysID, this);

    async function getSysData(sysID, sys) {
      try {
        const response = await fetch("http://localhost:3000/selectSystem", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ sysID }), // Send username and password as JSON
        });

        if (response.ok) {
          const data = await response.json();
          let result = data.system;

          console.log(result[0].systemData, "hello");

          let sysData = JSON.parse(result[0].systemData);
          console.log(sysData)
          //load data for sys
          sys.id = sysData.id;
          sys.g = sysData.g;
          sys.scale = sysData.scale;
          sys.t = sysData.t;
          sys.t0 = sysData.t0;
          sys.coefficientOfRestitution = sysData.coefficientOfRestitution;

        } else {
          const errorData = await response.json();
          alert("Error: " + errorData.error); // Show error message
        }
      } catch (error) {
        alert("Error: " + error.message); // Handle any fetch errors
      }
    }

    async function getParticles(sysID, sys) {
      try {//gets particles from particle list where Systems.sysID = SystemParticleRelation.sysID then get the particleID from this
        const response = await fetch(
          "http://localhost:3000/selectSystemParticles",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ sysID }), // Send username and password as JSON
          }
        );

        if (response.ok) {
          const data = await response.json();
          let result = data.result;

          console.log(result);

          if (result.length != 0) {
            //load data for particles
            for (let i = 0; i < result.length; i++) {
              let particleData = JSON.parse(result[i].particleData);
              sys.createParticle();
            
              //assign stored values
              sys.particles[i].id = particleData.id;
              //sys is ommitted
              sys.particles[i].radius = particleData.radius;
              sys.particles[i].pos = new Vector(particleData.pos.x, particleData.pos.y); //{ x: particle.pos.x, y: particle.pos.y }, //Vector obj
              sys.particles[i].x = particleData.x;
              sys.particles[i].y = particleData.y;
              sys.particles[i].angle = particleData.angle;
              sys.particles[i].velocity = new Vector(particleData.velocity.x, particleData.velocity.y) 
              sys.particles[i].mass = particleData.mass;
              //drag is ommitted
              //originPoint is ommitted
              sys.particles[i].lineDist = particleData.lineDist;
              sys.particles[i].initialVel = particleData.initialVel;
              sys.particles[i].initialAngle = particleData.initialAngle;
              sys.particles[i].colour = particleData.colour;
              //lastColl is ommitted
              sys.particles[i].prevVelocity = new Vector(particleData.prevVelocity.x, particleData.prevVelocity.y)
              sys.particles[i].updated = particleData.updated;
              sys.particles[i].initialConditions = JSON.parse(particleData.initialConditions);
              //overlapedObjects is ommitted
              sys.particles[i].inFreeFall = particleData.inFreeFall;
              sys.particles[i].freeFallInitialConditions = JSON.parse(particleData.freeFallInitialConditions);
              sys.particles[i].keList = JSON.parse(particleData.keList);
            };
          }
        } else {
          const errorData = await response.json();
          alert("Error: " + errorData.error); // Show error message
        }
      } catch (error) {
        alert("Error: " + error.message); // Handle any fetch errors
      }
    }

    async function getPoints(sysID, sys) { //retrieves and sets data for points
      try {
        const response = await fetch(
          "http://localhost:3000/selectSystemPoints",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ sysID }), // Send username and password as JSON
          }
        );

        if (response.ok) {
          const data = await response.json();
          let result = data.result;

          if (result.length != 0) {
            //load data for points
            for (let i = 0; i < result.length; i++) {
              let pointData = JSON.parse(result[i].pointData);
            
              sys.createPoint();

              //assign stored values
              sys.points[i].id = pointData.id;
              //sys is ommitted
              sys.points[i].x = pointData.x;
              sys.points[i].y = pointData.y;
              sys.points[i].mass = pointData.mass;
              sys.points[i].speed = pointData.speed;
              sys.points[i].radius = pointData.radius;
              sys.points[i].endX = pointData.endX;
              sys.points[i].endY = pointData.endY;
              sys.points[i].drag = pointData.drag;
              sys.points[i].lineDrag = pointData.lineDrag;
              sys.points[i].lineLocked = pointData.lineLocked;
              //particle is ommitted
            };
          }
        } else {
          const errorData = await response.json();
          alert("Error: " + errorData.error); // Show error message
        }
      } catch (error) {
        alert("Error: " + error.message); // Handle any fetch errors
      }
    }

    //check relations
    //select all relations for a given system and returns array of {particleID: x, pointID: y} objects
    //update query to update respective entries

    async function getParticlePointRel(sysID, sys) {
      try {
        const response = await fetch("http://localhost:3000/selectParticlePointRelations", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ sysID }), // Send username and password as JSON
        });

        if (response.ok) {
          const data = await response.json();
          let result = data.result;

          if (result.length != 0) {
            //load data for points
            for (let i = 0; i < result.length; i++) {
              let relationData = JSON.parse(result[i].relationData);
              let particleID = relationData.particleID;
              let pointID = relationData.pointID;

              let particle = sys.particles.find((particle) => particle.id === particleID);
              let point = sys.points.find(point => point.id === pointID);

              particle.originPoint = point;
              point.particle = particle;
            }
          }
        } else {
          const errorData = await response.json();
          alert("Error: " + errorData.error); // Show error message
        };
      } catch (error) {
        alert("Error: " + error.message); // Handle any fetch errors
      };
    };
  };

  saveToDB() {
    //if already in db then update
    //otherwise create new entry

    updateSysData(this);

    for (let particle of this.particles) {
      updateParticleData(particle);
    }

    for (let point of this.points) {
      updatePointData(point);
    }

    //check all previous point particle conenctions exist
    checkConnections(this);

    async function checkConnections(sys) {
      let sysID = sys.id;

      //delete all previous conenctions and establish new ones
      try {
        const response = await fetch("http://localhost:3000/deleteParticlePointRelations", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ sysID }),
        });

        const data = await response.json();
        if (response.ok) {

          console.log("particle point relations delted")
          //create new cons

          for (let particle of sys.particles) {
            if (particle.originPoint) {
              let particleID = particle.id
              let pointID = particle.originPoint.id

              console.log(particleID, pointID, "part anmd point id")

              try {
                const response = await fetch("http://localhost:3000/insertParticlePointRelations", {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({ sysID, particleID, pointID }), 
                });

                if (!response.ok) {

                  const errorData = await response.json();
                  alert("Error: " + errorData.error); // Show error message
                };
              } catch (error) {
                alert("Error: " + error.message); // Handle any fetch errors
              };
            }
          }


        } else {
          alert("Error: " + data.error || "Something went wrong");
        }
      } catch (error) {
        alert("Error: " + error.message);
      }
      
    }

    async function updateSysData(sys) {

      let sysID = sys.id;

      let sysData = {
        id: sys.id,
        g: sys.g,
        scale: sys.scale,
        t: sys.t,
        t0: sys.t0,
        coefficientOfRestitution: sys.coefficientOfRestitution,
        particles: [],
        points: [],
        particlePointRelations: {}
      };
      
      try {
        const response = await fetch("http://localhost:3000/updateSysData", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ sysData: JSON.stringify(sysData), sysID }), 
        });

        const data = await response.json(); 
        if (response.ok) {
          

        } else {
          alert("Error: " + data.error || "Something went wrong");
        }
      } catch (error) {
        alert("Error: " + error.message);
      }
    }

    async function updateParticleData(particle) {

      let particleID = particle.id;

      let particleData = { // stores particle data (ommitted fields commented)
        id: particle.id,
        // sys: particle.sys,
        radius: particle.radius,
        pos: { x: particle.pos.x, y: particle.pos.y }, //Vector obj
        x: particle.x,
        y: particle.y,
        angle: particle.angle,
        velocity: { x: particle.velocity.x, y: particle.velocity.y }, //Vector obj
        mass: particle.mass,
        //drag: particle.drag,
        //originPoint: particle.originPoint,
        lineDist: particle.lineDist,
        initialVel: particle.initialVel,
        initialAngle: particle.initialAngle,
        colour: particle.colour,
        // lastColl: particle.lastColl,
        prevVelocity: { x: particle.prevVelocity.x, y: particle.prevVelocity.y }, //Vector obj
        updated: particle.updated,
        initialConditions: JSON.stringify(particle.initialConditions),
        //overlapedObjects: particle.overlapedObjects,
        inFreeFall: particle.inFreeFall,
        freeFallInitialConditions: JSON.stringify(particle.freeFallInitialConditions),
        keList: JSON.stringify(particle.keList)
      };

      try {
        const response = await fetch("http://localhost:3000/updateParticleData", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ particleData: JSON.stringify(particleData), particleID }),
        });

        const data = await response.json();
        if (response.ok) {
          
        } else {
          alert("Error: " + data.error || "Something went wrong");
        }
      } catch (error) {
        alert("Error: " + error.message);
      }
    }

    async function updatePointData(point) {

      let pointID = point.id;

      let pointData = {
        id: point.id,
        //sys: point.sys,
        x: point.x,
        y: point.y,
        mass: point.mass,
        speed: point.speed,
        radius: point.radius,
        endX: point.endX,
        endY: point.endY,
        drag: point.drag,
        lineDrag: point.lineDrag,
        lineLocked: point.lineLocked,
        //particle: point.particle
      };

      try {
        const response = await fetch(
          "http://localhost:3000/updatePointData",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ pointData: JSON.stringify(pointData), pointID }),
          }
        );

        const data = await response.json();
        if (response.ok) {
          
        } else {
          alert("Error: " + data.error || "Something went wrong");
        }
      } catch (error) {
        alert("Error: " + error.message);
      }
    }

    
  }

  loadData() {
    
    let getData = sessionStorage.getItem("sysData"); // gets data of system

    if (getData) {
      let systemDetails = JSON.parse(getData);//parses json --> to be able to be used in js
      sessionStorage.removeItem("sysData");//removes info for next use

      //load data for sys
      this.id = systemDetails.id
      this.g = systemDetails.g;
      this.scale = systemDetails.scale;
      this.t = systemDetails.t;
      this.t0 = systemDetails.t0;
      this.coefficientOfRestitution = systemDetails.coefficientOfRestitution;

      //load data for particles
      for (let i = 0; i < systemDetails.particles.length; i++) {
        this.createParticle();
      
        //assign stored values
        this.particles[i].id = systemDetails.particles[i].id;
        //sys is ommitted
        this.particles[i].radius = systemDetails.particles[i].radius;
        this.particles[i].pos = new Vector(systemDetails.particles[i].pos.x, systemDetails.particles[i].pos.y); //{ x: particle.pos.x, y: particle.pos.y }, //Vector obj
        this.particles[i].x = systemDetails.particles[i].x;
        this.particles[i].y = systemDetails.particles[i].y;
        this.particles[i].angle = systemDetails.particles[i].angle;
        this.particles[i].velocity = new Vector(systemDetails.particles[i].velocity.x, systemDetails.particles[i].velocity.y) 
        this.particles[i].mass = systemDetails.particles[i].mass;
        //drag is ommitted
        //originPoint is ommitted
        this.particles[i].lineDist = systemDetails.particles[i].lineDist;
        this.particles[i].initialVel = systemDetails.particles[i].initialVel;
        this.particles[i].initialAngle = systemDetails.particles[i].initialAngle;
        this.particles[i].colour = systemDetails.particles[i].colour;
        //lastColl is ommitted
        this.particles[i].prevVelocity = new Vector(systemDetails.particles[i].prevVelocity.x, systemDetails.particles[i].prevVelocity.y)
        this.particles[i].updated = systemDetails.particles[i].updated;
        this.particles[i].initialConditions = JSON.parse(systemDetails.particles[i].initialConditions);
        //overlapedObjects is ommitted
        this.particles[i].inFreeFall = systemDetails.particles[i].inFreeFall;
        this.particles[i].freeFallInitialConditions = JSON.parse(systemDetails.particles[i].freeFallInitialConditions);
        this.particles[i].keList = JSON.parse(systemDetails.particles[i].keList);
      };

      for (let i = 0; i < systemDetails.points.length; i++) {
        this.createPoint();

        //assign stored values
        this.points[i].id = systemDetails.points[i].id;
        //sys is ommitted
        this.points[i].x = systemDetails.points[i].x;
        this.points[i].y = systemDetails.points[i].y;
        this.points[i].mass = systemDetails.points[i].mass;
        this.points[i].speed = systemDetails.points[i].speed;
        this.points[i].radius = systemDetails.points[i].radius;
        this.points[i].endX = systemDetails.points[i].endX;
        this.points[i].endY = systemDetails.points[i].endY;
        this.points[i].drag = systemDetails.points[i].drag;
        this.points[i].lineDrag = systemDetails.points[i].lineDrag;
        this.points[i].lineLocked = systemDetails.points[i].lineLocked;
        //particle is ommitted
      };

      //create particle point relations
      for (let particleID in systemDetails.particlePointRelations) {
        //console.log(particleID);
        let particle = this.particles.find((particle) => particle.id == particleID);
        //console.log(particle)
        let pointID = systemDetails.particlePointRelations[particleID];
        let point = this.points.find((point) => point.id == pointID);

        particle.originPoint = point;
        point.particle = particle;
      };
    };
    
  };

  storeData(targetParticle) {
    let sysData = {
      id: this.id,
      g: this.g,
      scale: this.scale,
      t: this.t,
      t0: this.t0,
      coefficientOfRestitution: this.coefficientOfRestitution,
      particles: [],
      points: [],
      particlePointRelations: {}
    };
    //for the rest of system:

      //these will be updated dynamically:
      // this.elements = [];
      // this.points = [];
      // this.particles = [];

      //set to normal values (on creation)
      // this.started = false;
      // this.play = false;

      // this.particleCreationOn = false;
      // this.pointCreationOn = false;
      // this.objectsMenuOpen = false;
      // this.particleCategoryOn = false;

      // this.grid;
      // this.width;
      // this.height;
      // this.gridSize = 50;
      // this.smallestX = -2000;
      // this.smallestY = -2000;

      // this.delete = false;
    
    for (let particle of this.particles) {
      let newParticleData = { // stores particle data (ommitted fields commented)
        id: particle.id,
        // sys: particle.sys,
        radius: particle.radius,
        pos: { x: particle.pos.x, y: particle.pos.y }, //Vector obj
        x: particle.x,
        y: particle.y,
        angle: particle.angle,
        velocity: { x: particle.velocity.x, y: particle.velocity.y }, //Vector obj
        mass: particle.mass,
        //drag: particle.drag,
        //originPoint: particle.originPoint,
        lineDist: particle.lineDist,
        initialVel: particle.initialVel,
        initialAngle: particle.initialAngle,
        colour: particle.colour,
        // lastColl: particle.lastColl,
        prevVelocity: { x: particle.prevVelocity.x, y: particle.prevVelocity.y }, //Vector obj
        updated: particle.updated,
        initialConditions: JSON.stringify(particle.initialConditions),
        //overlapedObjects: particle.overlapedObjects,
        inFreeFall: particle.inFreeFall,
        freeFallInitialConditions: JSON.stringify(particle.freeFallInitialConditions),
        keList: JSON.stringify(particle.keList)
      };

      if (particle.originPoint) {
        sysData.particlePointRelations[particle.id] = particle.originPoint.id;
      };

      sysData.particles.push(newParticleData);
    };

    for (let point of this.points) {
      let newPointData = {
        id: point.id,
        //sys: point.sys, 
        x: point.x,
        y: point.y,
        mass: point.mass,
        speed: point.speed,
        radius: point.radius,
        endX: point.endX,
        endY: point.endY,
        drag: point.drag,
        lineDrag: point.lineDrag,
        lineLocked: point.lineLocked,
        //particle: point.particle
      };

      sysData.points.push(newPointData);
    };

    sessionStorage.setItem("sysData", JSON.stringify(sysData));
    let particleID = targetParticle.id;
    let particle = this.particles.find((particle) => particle.id == particleID);
    
    sessionStorage.setItem("keListData", JSON.stringify(particle.keList));
  }

  createPoint(x, y) {
    let pointID = this.points.length;
    let newPoint = new Point(pointID, this, x, y);
    this.points.push(newPoint);
    this.elements.push(newPoint);
    //sets up point

    const pointElement = document.createElement("div");
    const pointContent = document.getElementById("pointsContent");
    const pointNameDisplay = document.createElement("p");
    let pointName = "point " + pointID;
    pointElement.id = "point-" + pointID;
    pointContent.appendChild(pointElement);
    pointElement.classList.add("object");
    pointNameDisplay.textContent = pointName;
    pointElement.appendChild(pointNameDisplay);
    //creates a html element for point and point heading

    const pointCategory = document.getElementById("pointsHeading");
    pointCategory.onclick = function () {
      const pointContent = document.getElementById("pointsContent");
      let pointElementList = pointContent.children;
      for (let i = 0; i < pointElementList.length; i++) {
        pointElementList[i].classList.toggle("showObject");
      }
    };
    //toggles visibility of the point elements when the heading is clicked

    createPointControls(pointElement, this);

    function createPointControls(pointElement, sys) {
      let pointElementList = pointElement.id.split("-");
      pointID = pointElementList[pointElementList.length - 1];

      let controlsContainer = document.createElement("div");
      controlsContainer.classList.add("controls");
      pointElement.appendChild(controlsContainer);

      //sys.createControlsCheckbox(controlsContainer, "Collisions");
      let stringTypeFunction = function () {
        let point = sys.points[pointID];
        point.type = "string";
      }

      let rodTypeFunction = function () {
        let point = sys.points[pointID];
        point.type = "rod";
      };

      sys.createControlsRadioBox(
        controlsContainer,
        "string",
        "type",
        stringTypeFunction
      );
      sys.createControlsRadioBox(
        controlsContainer,
        "rod",
        "type",
        rodTypeFunction
      );
    }

    pointNameDisplay.onclick = function () {
      let pointElement = this.parentElement;
      let childList = pointElement.children;
      let controls = childList[1];
      controls.classList.toggle("showControls");
    };

    if (sessionStorage.getItem("LoggedOn")) {
      getPointID(this.points[pointID], this);
    }
  
    async function getPointID(point, sys) {
      //need Point id when creating new Point to store in global table (Points)

      try {
        const response = await fetch("http://localhost:3000/getNextPointID");

        if (response.ok) {
          const data = await response.json();

          let globalPointID = data.totPoints; //ids from various systems stored in db (globally)
          console.log(globalPointID, "globalPointID");

          point.id = globalPointID; //sets the id to match db

          addPoint(globalPointID, point, sys);
        } else {
          const errorData = await response.json();
          alert("Error: " + errorData.error);
        }
      } catch (error) {
        alert("Error: " + error.message);
      }
    }

    async function addPoint(pointID, point, sys) {
      console.log(point);
      console.log(sys, "sys");

      let pointData = {
        id: pointID,
        //sys: point.sys,
        x: point.x,
        y: point.y,
        mass: point.mass,
        speed: point.speed,
        radius: point.radius,
        endX: point.endX,
        endY: point.endY,
        drag: point.drag,
        lineDrag: point.lineDrag,
        lineLocked: point.lineLocked,
        //particle: point.particle
      };

      let sysID = sys.id;

      try {
        const response = await fetch("http://localhost:3000/insertPoint", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            pointID,
            pointData: JSON.stringify(pointData),
          }),
        });

        if (response.ok) {
          const data = await response.json();
          let result = data.system;

          //create relation
          try {
            const response = await fetch(
              "http://localhost:3000/insertSysPointRelation",
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({ sysID, pointID }),
              }
            );

            if (response.ok) {
              const data = await response.json();
              let result = data.system;
            } else {
              const errorData = await response.json();
              alert("Error: " + errorData.error); // Show error message
            }
          } catch (error) {
            alert("Error: " + error.message); // Handle any fetch errors
          }
        } else {
          const errorData = await response.json();
          alert("Error: " + errorData.error); // Show error message
        }
      } catch (error) {
        alert("Error: " + error.message); // Handle any fetch errors
      }
    }
  };

  randColour() {
    let r = Math.floor(Math.random() * 255);
    let g = Math.floor(Math.random() * 255);
    let b = Math.floor(Math.random() * 255);
    return [r, g, b];
  };

  resetSys() {
    this.play = false;
    this.t = 0;
    this.started = false;
    timeBar.max = 0;
    timeBar.min = 0;
  };
};

class Point {
  constructor(id, sys, x, y) {
    this.id = id;
    this.sys = sys
    this.x = x;
    this.y = y;

    this.mass;
    this.speed = 0;
    this.radius = 5;

    this.endX = x;
    this.endY = y;
    this.drag = false;
    this.lineDrag = false;
    this.lineLocked = false;
    this.particle = null;
    this.type = "rod"
  };
  draw() {
    strokeWeight(2);
    line(this.x, this.y, this.endX, this.endY);
    strokeWeight(4);
    fill(255, 255, 255);
    circle(this.x, this.y, 2 * this.radius);
  };
  checkParticle(particleList) {
    for (let particle of particleList) {
      if ((this.endX - particle.x) ** 2 + (this.endY - particle.y) ** 2 <= particle.radius ** 2) {
        this.lineLocked = true;
        this.particle = particle;
        if (this.particle.originPoint) {
          //gets rid of previous connection
          this.particle.originPoint.particle = null;
          this.particle.originPoint.lineLocked = false;
          this.particle.originPoint.endX = this.particle.originPoint.x;
          this.particle.originPoint.endY = this.particle.originPoint.y;
        }
        this.particle.originPoint = this;
        this.endX = particle.x;
        this.endY = particle.y;

        this.particle.setupParticle();
        this.sys.resetSys();
      };
    };
    if (this.lineLocked == false) {
      this.endX = this.x;
      this.endY = this.y;
    };
  };
};

class Particle {
  constructor(id, sys, x, y, colour) {
    this.id = id;
    this.sys = sys;

    this.radius = 12.5;
    this.pos = new Vector(x, y); //position vector from origin
    this.x = x;
    this.y = y;
    this.angle = 0;
    this.velocity = new Vector(0, 0);
    this.mass = 1;

    this.drag = false;
    this.originPoint = null;
    this.lineDist = 0; //radius of circle
    this.initialVel = 0;
    this.initialAngle = 0;
    this.colour = colour;

    //this.gridPos = [];
    this.lastColl = null;

    this.prevVelocity = new Vector(0, 0);
    this.updated = false;

    this.initialConditions = {}; //stores times and corresponding inital conditons
    this.overlapedObjects = [];

    this.inFreeFall = false;
    this.freeFallInitialConditions = {};

    this.keList = []
  }

  draw() {
    strokeWeight(2);
    stroke(0, 0, 0);
    fill(this.colour[0], this.colour[1], this.colour[2]);
    circle(this.x, this.y, 2 * this.radius);
  }

  update(t) {
    if (this.originPoint) {
      if (this.originPoint.type == "string") {
        //for str
        this.updateString(t);
      } else if(this.originPoint.type == "rod") {
        //for rod
        this.updateRod(t);
        this.updateVelocityRod();
      }
    }
    //for particle
    // let s0 = new Vector(this.pos.x, this.pos.y);
    // let u = new Vector(this.velocity.x, this.velocity.y);
    // let a = new Vector(0, -1 * this.sys.g);
    // this.freeFallInitialConditions.push([s0, u, a, t]);
    //this.particleProjMotion(t);

    //for rod
    //this.updateRod(t);
    //this.updateVelocityRod();

    

    //old
    //this.sys.checkCollisions(this);

    this.UpdateKEList();
  }

  updateVelocityRod() {
    this.updateVelocity();
    this.displayVelocity();
  }

  updateVelocity() {
    let vec = new Vector(this.pos.x, -1 * this.pos.y); //because the coordinate system is flipped with positive y axis going down, we multiply by -1 to get the true angle
    let ang = Math.PI / 2 - vec.getAngle();
    let velocity = -1 * (this.angVelocity * (this.lineDist / this.sys.scale)); //-1 to account for the sign of the velcoity component

    this.velocity.setXAndY(velocity, ang);
  }

  displayVelocity() {
    stroke(255, 0, 0);
    line(
      this.x,
      this.y,
      this.x + this.velocity.x * 10,
      this.y + this.velocity.y * 10
    );
    this.displayMagnitudeOfVelocity();
  }

  displayMagnitudeOfVelocity() {
    let velocityBox = document.getElementById("particle-" + this.sys.particles.indexOf(this) + "-velocity");
    velocityBox.value = this.velocity.getMagnitude().toFixed(2);
  }

  getIntialConditions(t) {
    let closestTime = 0;
    for (let time in this.initialConditions) {
      if (parseFloat(time) <= t && parseFloat(time) > closestTime) {
        closestTime = time;
      }
    }
    return [this.initialConditions[closestTime], parseFloat(closestTime)];
  }

  getFreeFallIntialConditions(t) {
    //console.log(this.freeFallInitialConditions, "freefallinitialconditions IN GET FREE FALL");
    let closestTime = 0;
    for (let time in this.freeFallInitialConditions) {
      if (parseFloat(time) <= t && parseFloat(time) > closestTime) {
        closestTime = time;
      }
    }
    return [this.freeFallInitialConditions[closestTime], parseFloat(closestTime)];
  }

  getTension() {
    let tension = 0;
    
    let tangentialVelocityComponent = this.getTangentialVelocity(
      this.pos,
      this.velocity
    );
    let currVel = tangentialVelocityComponent.getMagnitude();
    console.log(currVel, "currVel");
    let currAngle = -1 * this.pos.getAngle(); //uses standard [in polar form] angle (diff to the inital angle defention as it needs angle from the lower vertical)
    console.log(currAngle, "currangle");
    
    if (currAngle >= 0 && currAngle < Math.PI / 2) {
      //1st quadrant --> T+Mgsin(theta) = Ma
      console.log("1st quadrant");
      tension =
        this.mass * (currVel ** 2 / this.lineDist) -
        this.mass * this.sys.g * Math.sin(Math.abs(currAngle));
    } else if (currAngle >= Math.PI / 2 && currAngle <= Math.PI) {
      //2nd quadrant --> T+Mgsin(theta) = Ma
      console.log("2nd quadrant");
      tension =
        this.mass * (currVel ** 2 / this.lineDist) -
        this.mass * this.sys.g * Math.sin(Math.abs(currAngle));
    } else if (currAngle <= -1 * (Math.PI / 2) && currAngle > -1 * Math.PI) {
      //3rd quadrant --> T-Mgsin(theta) = Ma
      console.log("3rd quadrant");
      tension =
        this.mass * (currVel ** 2 / this.lineDist) +
        this.mass * this.sys.g * Math.sin(Math.abs(currAngle));
    } else {
      //4th quadrant --> T-Mgsin(theta) = Ma
      console.log("4th quadrant");
      tension =
        this.mass * (currVel ** 2 / this.lineDist) +
        this.mass * this.sys.g * Math.sin(Math.abs(currAngle));
    }
    
    return tension;
  }

  particleProjMotion(t) {
    console.log(
      "IN PROJ MOTION ------------------------------------------------------------------------------------------>>>>>>>"
    );
    let s = new Vector(0, 0);
    let v = new Vector(0, 0);


    let latestInitialConditionsList = this.getFreeFallIntialConditions(t);
    console.log(latestInitialConditionsList, "latestInitialConditionsList");
    let latestInitialConditions = latestInitialConditionsList[0];
    let t0 = latestInitialConditionsList[1];


    
    let s0 = latestInitialConditions[0];
    let u = latestInitialConditions[1];
    let a = latestInitialConditions[2];
   



    s = s0
      .getAddition(u.getScale(t - t0))
      .getAddition(a.getScale(0.5 * (t - t0) ** 2));
    v = u.getAddition(a.getScale(t - t0));

   

    this.pos.x = s.x;
    this.pos.y = s.y;
    this.x = this.pos.x;
    this.y = this.pos.y;

    

    this.velocity.x = v.x;
    this.velocity.y = v.y;
    //console.log(this.velocity.x, this.velocity.y, "velocity");
  }

  projMotion(t) {
    console.log(
      "IN PROJ MOTION ------------------------------------------------------------------------------------------>>>>>>>"
    );
    let s = new Vector(0, 0);
    let v = new Vector(0, 0);

    let latestInitialConditionsList = this.getFreeFallIntialConditions(t);
    let latestInitialConditions = latestInitialConditionsList[0];
    let t0 = latestInitialConditionsList[1];
    
    let s0 = latestInitialConditions[0].getScale(1 / this.sys.scale);
    let u = latestInitialConditions[1].getScale(1 / this.sys.scale);
    let a = latestInitialConditions[2];

    s = (s0.getAddition(u.getScale(t - t0)).getAddition(a.getScale(0.5 * (t - t0) ** 2))).getScale(this.sys.scale);
    v = (u.getAddition(a.getScale(t - t0))); //.getScale(this.sys.scale);

    this.pos.x = s.x;
    this.pos.y = s.y;
    
    this.x = this.originPoint.x + this.pos.x;
    this.y = this.originPoint.y + this.pos.y;

    this.originPoint.endX = this.x;
    this.originPoint.endY = this.y;

    this.velocity.x = v.x;
    this.velocity.y = v.y;
    
  }

  getTangentialVelocity(pos, vel) {
    let positionVec = new Vector(pos.x, pos.y);
    let velocityVec = new Vector(vel.x, vel.y);


    let rHat = positionVec.getUnitVector(); // Unit radial vector
    let vRadial = rHat.getScale(velocityVec.getDotProduct(rHat)); // Radial component of velocity
    
    let vTangential = velocityVec.getSubtraction(vRadial); // Tangential component

    return vTangential;
  }

  stringMovement(t) {
    //if tension <= 0 then string goes slack
    //model slack string as a particle in free fall using SUVAT
    //need to get tension

    let tension = this.getTension();
    // console.log(tension, "tensionnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnnn");
    // console.log(this.inFreeFall, "inFreeFall");
    // console.log(this.sys.t, "time");
    const isTangent = this.velocity.getDotProduct(this.pos)

    if (this.inFreeFall) {
      //check if not in freefall anymore
      //if in freefall then continue proj motion
      if (dist(this.x, this.y, this.originPoint.x, this.originPoint.y) > this.lineDist) {
        //if the distance between the particle and the origin point is greater than the line distance then the string is no longer slack

        let posMag = this.pos.getMagnitude();

        this.pos.x = this.lineDist * (this.pos.x / posMag);
        this.pos.y = this.lineDist * (this.pos.y / posMag);
        this.x = this.originPoint.x + this.pos.x;
        this.y = this.originPoint.y + this.pos.y;

        this.originPoint.endX = this.x;
        this.originPoint.endY = this.y;

        if (tension > 0) {

          //console.log("STRING TENSE AGAIN :::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::::")
          this.inFreeFall = false;
          this.initialAngle = this.getAngleFromPos();
          
          let tangentialVelocityComponent = this.getTangentialVelocity(
            this.pos,
            this.velocity
          );
          

          if (tangentialVelocityComponent.getCrossProduct(this.pos) < 0) {
            //if the cross product is negative then rotation is clockwise
            this.initialVel = -1 * tangentialVelocityComponent.getMagnitude();
          } else {
            this.initialVel = tangentialVelocityComponent.getMagnitude();
          }

          
          this.initialConditions[t] = [
            this.initialAngle,
            this.initialVel,
            this.lineDist,
          ];
          
        }
      } else {
        //if in freefall then continue proj motion
        this.projMotion(t);
        
      }
    } else {
      //getting initial conditions
      let initalConditions = this.getIntialConditions(t);
      let initalConditionsList = initalConditions[0];
      // console.log(
      //   "initial conditions for rod INITAL LIST",
      //   initalConditionsList
      // );
      let startTime = initalConditions[1];

      //setting up the initial conditions for the differential equation
      this.initialAngle = initalConditionsList[0];
      this.initialVel = initalConditionsList[1];
      this.lineDist = initalConditionsList[2];

      

      if (tension > 0) {
        let angAndAngVel = rungeKutta(
          startTime,
          t,
          this.initialAngle,
          this.initialVel / (this.lineDist / this.sys.scale),
          0.0025,
          this.sys.g,
          this.lineDist / this.sys.scale
        );

        this.angle = angAndAngVel[0];

        this.angVelocity = angAndAngVel[1];
        this.updatePosition();
        this.updateVelocity();
      } else {
        //set inital conditions for proj motion
        //console.log("IN FREE FALL is trueee INITAL CONDITONS SETTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTTT");
        this.inFreeFall = true;
        
        const s0 = new Vector(this.pos.x, this.pos.y);
        
        const u = new Vector(this.velocity.x, this.velocity.y);
        //console.log(u.x, u.y, "u");
        
        const a = new Vector(0, this.sys.g); //dont * -1 as the y axis is flipped in the coordinate system
        let lst = [s0, u, a];
        console.log("INITAL FREE FALL CONDITIONS =======================================================>>");
        console.log(s0.x, s0.y, "s0");
        console.log(u.x, u.y, "u");
        console.log(a.x, a.y, "a");
        console.log("===========================================================================>>");

        //console.log(lst[1].x, lst[1].y, "lst uuuu");

        this.freeFallInitialConditions[t] = lst;
        //console.log(this.freeFallInitialConditions[t][1].y, "freefallinitialconditions");
      }
    }
    this.displayVelocity();
  }

  rodMovement(t) {
    //getting initial conditions
    let initalConditions = this.getIntialConditions(t);
    let initalConditionsList = initalConditions[0];
    let startTime = initalConditions[1];

    //setting up the initial conditions for the differential equation
    this.initialAngle = initalConditionsList[0];
    this.initialVel = initalConditionsList[1];
    this.lineDist = initalConditionsList[2];

    let angAndAngVel = rungeKutta(
      startTime,
      t,
      this.initialAngle,
      this.initialVel / (this.lineDist / this.sys.scale),
      0.0025,
      this.sys.g,
      this.lineDist / this.sys.scale
    );
    
    this.angle = angAndAngVel[0];

    this.angVelocity = angAndAngVel[1];
    this.updatePosition();
  }

  updatePosition() {
    this.pos.x = this.lineDist * Math.sin(this.angle);
    this.pos.y = this.lineDist * Math.cos(this.angle);
    this.x = this.originPoint.x + this.pos.x;
    this.y = this.originPoint.y + this.pos.y;

    this.originPoint.endX = this.x;
    this.originPoint.endY = this.y;
    //this.sys.addToGrid(this);
  }

  updateRod(t) {
    if (this.originPoint) {
      if (this.originPoint.lineLocked) {
        this.rodMovement(t);
      }
    }
  }

  updateString(t) {
    if (this.originPoint) {
      if (this.originPoint.lineLocked) {
        this.stringMovement(t);
      }
    }
  }

  setupParticle(initialVel = 0, initialAngle = 0, initialLineDist = 0) {
    this.initialVel = initialVel;
    if (initialAngle == 0) {
      this.initialAngle = this.getAngleFromPos();
    }
    if (initialLineDist == 0) {
      this.lineDist = this.getLineDist();
    }
  }

  getLineDist() {
    return dist(this.x, this.y, this.originPoint.x, this.originPoint.y);
  }

  getAngleFromPos() {
    this.pos.x = this.x - this.originPoint.x;
    this.pos.y = this.y - this.originPoint.y;
    //gets position vector from originPoint set as the origin

    return -1 * this.pos.getAngle() + Math.PI / 2;
  }

  UpdateKEList() {
    let ke = 0.5 * this.mass * this.velocity.getMagnitude();
    this.keList.push([this.sys.t, ke])
  }
};


//creates sys

sys1 = new System(1)
sysList.push(sys1)
sys1.setup();
//sys1.loadData();
if (sessionStorage.getItem("sysID")) {
  sys1.loadData();
} else {
  if (sessionStorage.getItem("LoggedOn")) {
    sys1.loadFromDB();
  }
}






function setup() {
  let cnv = createCanvas(windowWidth, windowHeight - 100);
  cnv.parent("canvas")
  cnv.position(0, 100);
  frameRate(120);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight - 100);
 
}

function f1(t, theta, u) {
  return u;
}

function f2(t, theta, u, g, len) {
  //return t * u ** 2 - theta ** 2
  return -(g / len) * Math.sin(theta);
}

// thetadot = u
function rungeKutta(t0, tf, theta0, thetaDot0, h, g, len) {
  
  let n = parseInt((tf - t0) / h, 10);
  let k1t, k2t, k3t, k4t, k1u, k2u, k3u, k4u;
  let theta = theta0;
  let u = thetaDot0; //u is angualar velocity

  for (let i = 1; i <= n; i++) {
    k1t = h * f1(t0, theta, u);
    k1u = h * f2(t0, theta, u, g, len);

    k2t = h * f1(t0 + 0.5 * h, theta + 0.5 * k1t, u + 0.5 * k1u);
    k2u = h * f2(t0 + 0.5 * h, theta + 0.5 * k1t, u + 0.5 * k1u, g, len);

    k3t = h * f1(t0 + 0.5 * h, theta + 0.5 * k2t, u + 0.5 * k2u);
    k3u = h * f2(t0 + 0.5 * h, theta + 0.5 * k2t, u + 0.5 * k2u, g, len);

    k4t = h * f1(t0 + h, theta + k3t, u + k3u);
    k4u = h * f2(t0 + h, theta + k3t, u + k3u, g, len);

    theta = theta + (1 / 6) * (k1t + 2 * k2t + 2 * k3t + k4t);
    u = u + (1 / 6) * (k1u + 2 * k2u + 2 * k3u + k4u);
    //updating theta and u to resubstitute

    t0 = t0 + h;
    //incrementing the time by the step length
  }
  return [theta.toFixed(6), u.toFixed(6)]; //returns the angle and angular velocity
}

//https://www.youtube.com/watch?v=i9-seHaDkrw
//https://www.youtube.com/watch?v=TjZgQa2kec0
//let vall = rungeKutta(0, 0.2, 1, 0, 0.02); ------------TEST WORKS

function draw() {
  background(242, 233, 228);

  for (let originPoint of sys1.points) {
    originPoint.draw();
  };
  // displays points on the canvas

  for (let particle of sys1.particles) {
    particle.draw();
    if (sys1.started) { //&& particle.originPoint) {
      particle.update(sys1.t);
    }
  };
  // updates the position of the particles

  for (let particle of sys1.particles) {
    if (particle.originPoint && sys1.started) {
      sys1.checkCollisions(particle); 
    };
  };
  // this runs the collision detection algorithm and the collision handling algorithm
  
  for (let particle of sys1.particles) {
    if (particle.originPoint && sys1.started) {
      for (let obj of particle.overlapedObjects) {
        if (!sys1.checkIfCollisionDetected(particle, obj)) {
          particle.overlapedObjects = particle.overlapedObjects.filter(element => element !== obj);
        }
      };
    };
  };
  // this updates the overlaped objects array to remove objects that are no longer overlaping

  for (let particle of sys1.particles) {
    particle.updated = false;
  };
  // makes sure all particle collisions are set to not updated for next iteration
  
  stroke(0);
  strokeWeight(2);

  fill(232, 180, 35);
  textSize(100);
  text(sys1.t.toFixed(2), windowWidth - 300, 115); //timer
  

  if (sys1.play == true) {
    sys1.t += 1 / 60;
    if (sys1.t > timeBar.max) {
      timeBar.max = sys1.t;
      timeBar.step = sys1.t / 10000;
    } 
    timeBar.value = sys1.t;
  }
}

function mouseDragged() {
  for (let e of sys1.elements) {
    if (e.drag) {
      e.x = mouseX;
      e.y = mouseY;
      if (!sys1.play && sys1.particles.includes(e)) {
        if (e.originPoint) { // checks to see if it is a connected particle
          sys1.resetSys();
          e.setupParticle(e.initialVel, 0, 0); //initial velocity kept same
        }
      }
    }
  }

  for (let p of sys1.points) {
    if (!p.lineLocked) {
      if (p.lineDrag) {
        p.endX = mouseX;
        p.endY = mouseY;
      } else {
        p.endX = p.x;
        p.endY = p.y;
      }
    } else {
      p.endX = p.particle.x;
      p.endY = p.particle.y;
    }
  }
}

function mousePressed() {
  for (let e of sys1.elements) {
    if ((mouseX - e.x) ** 2 + (mouseY - e.y) ** 2 <= e.radius ** 2) { //checks if distance between mouse and element < element radius (ie element clicked)
      if (sys1.delete) {
        
        if (sys1.points.includes(e)) {
          sys1.points = sys1.points.filter(element => element !== e);
          sys1.elements = sys1.elements.filter(element => element !== e);
        } else if (sys1.particles.includes(e)) {
          sys1.particles = sys1.particles.filter(element => element !== e);
          sys1.elements = sys1.elements.filter(element => element !== e);
        }
      } else {
        if (mouseButton === LEFT) {
          e.drag = true;
        } else if (sys1.points.includes(e) && mouseButton === RIGHT) { //if a point is rightclicked
          e.lineDrag = true;
          e.lineLocked = false;
          if (e.particle) { //checks if connected to a particle --> if so then gets rid of conenction
            e.particle.originPoint = null;
            e.particle = null;
          }
        }
      }
    }
  }
}

function mouseReleased() {
  for (let e of sys1.elements) {
    e.drag = false;
    
  }
  for (let p of sys1.points) {
    if (p.lineDrag) {
      p.lineDrag = false;
      p.checkParticle(sys1.particles);
    }
  }
}

function mouseClicked() {
  if (mouseY > 0) {
    sys1.particleCreation()
    sys1.pointCreation()
  }
}