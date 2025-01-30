sysList = [];

window.addEventListener(`contextmenu`, (e) => e.preventDefault());

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

    this.particleCreationOn = false;
    this.pointCreationOn = false;
    this.objectsMenuOpen = false;
    this.particleCategoryOn = false;

    this.grid = {};
    this.gridSize = null;
  }

  setup() {
    let timeBar = document.getElementById("timeBar");
    let playButton = document.getElementById("playButton");
    let pauseButton = document.getElementById("pauseButton");
    let resetButton = document.getElementById("resetButton");
    let objectsMenuButton = document.getElementById("objectsMenuButton");
    let createParticleButton = document.getElementById("createParticleButton");
    let createPointButton = document.getElementById("createPointButton");

    timeBar.max = 0;
    timeBar.min = 0;

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
      }
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
            }
          }
          this.started = true;
        }
        this.play = true;
      }
    };

    pauseButton.onmousedown = () => {
      if (this.play == true) {
        this.play = false;
        timeBar.value = this.t;
      }
    };

    resetButton.onmousedown = () => {
      resetButton.src = "images/resetButtonColouredPressed.png";
      resetButton.classList.toggle("toolbarButtonPressed");
    };

    resetButton.onmouseup = () => {
      resetButton.src = "images/resetButtonColoured.png";
      resetButton.classList.toggle("toolbarButtonPressed");
    }

    resetButton.onclick = () => {
      this.resetSys();
      for (let particle of this.particles) {
        if (particle.originPoint) {
          particle.angle = particle.initialAngle;
          particle.updatePosition();
        }
      }
    }

    objectsMenuButton.onclick = () => {
      let sys = this;
      creationValuesReset()
      if (sys.objectsMenuOpen) {
        objectsMenuButton.src = "images/objectsColoured.png";
        sys.objectsMenuOpen = false;
      } else {
        objectsMenuButton.src = "images/objectsColouredPressed.png";
        sys.objectsMenuOpen = true;
      }
      let objectsMenu = document.getElementById("objectsMenu");
      objectsMenu.classList.toggle("showCategories");
      objectsMenuButton.classList.toggle("toolbarButtonPressed");
    };

    let creationValuesReset = () => {
      this.creationReset()
    }
  }

  addToGrid(obj) {
    let col = floor(obj.x / this.gridSize);
    let row = floor(obj.y / this.gridSize);
    let key = `${col},${row}`;  // Unique key for each cell
  
    if (!this.grid[key]) {
      this.grid[key] = [];
    }
    this.grid[key].push(obj);
  }

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

  createControlsTextInput(controlsContainer, title, buttonText, submitButtonFunction) {
    let propertyTitle = document.createElement("p");
    propertyTitle.textContent = title;
    controlsContainer.appendChild(propertyTitle);

    let propertyInputContainer = document.createElement("div");
    propertyInputContainer.classList.add("textInput");
    controlsContainer.appendChild(propertyInputContainer);

    let propertyInputBox = document.createElement("input");
    propertyInputBox.type = "text";
    propertyInputBox.classList.add("controlsInputBox");
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
        if (!isNaN(initialAngleValue) && initialAngleValue <= (2 * Math.PI) && initialAngleValue >= 0) {
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
        "Initial Angle",
        "Set Angle",
        initialAngleSubmit
      );

      sys.createControlsTextInput(
        controlsContainer,
        "Initial Velocity",
        "Set Velocity",
        initialVelocitySubmit
      );
    };

    particleNameDisplay.onclick = function () {
      let particleElement = this.parentElement;
      let childList = particleElement.children;
      let controls = childList[1];
      controls.classList.toggle("showControls");
    };
  };

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
      };
    };
    //toggles visibility of the point elements when the heading is clicked

    createPointControls(pointElement, this);

    function createPointControls(pointElement, sys) {
      let pointElementList = pointElement.id.split("-");
      pointID = pointElementList[pointElementList.length - 1];

      let controlsContainer = document.createElement("div");
      controlsContainer.classList.add("controls");
      pointElement.appendChild(controlsContainer);

      //sys.createControlsScrollInput(controlsContainer, "Point Radius", "0", "10");
      sys.createControlsCheckbox(controlsContainer, "Collisions");
    };

    pointNameDisplay.onclick = function () {
      let pointElement = this.parentElement;
      let childList = pointElement.children;
      let controls = childList[1];
      controls.classList.toggle("showControls");
    };
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
    this.radius = 5;
    this.endX = x;
    this.endY = y;
    this.drag = false;
    this.lineDrag = false;
    this.lineLocked = false;
    this.particle = null;
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
        if (this.particle.originPoint) { //gets rid of previous connection
          this.particle.originPoint.particle = null;
          this.particle.originPoint.lineLocked = false;
          this.particle.originPoint.endX = this.particle.originPoint.x;
          this.particle.originPoint.endY = this.particle.originPoint.y;
        };
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
    this.x = x;
    this.y = y;
    this.drag = false;
    this.radius = 12.5;
    this.originPoint = null
    this.angle = 0;
    this.lineDist = 0; //radius of circle
    this.initialVel = 0;
    this.initialAngle = 0;
    this.colour = colour;
  };

  draw() {
    strokeWeight(2);
    fill(this.colour[0], this.colour[1], this.colour[2]);
    circle(this.x, this.y, 2 * this.radius);
  };

  update(t) {
    //this.rodMovement(t);
    this.updateRod(t);
  };

  rodMovement(t) {
    this.angle = rungeKutta(0, t, this.initialAngle, this.initialVel / (this.lineDist / this.sys.scale), 0.0025, this.sys.g, (this.lineDist / this.sys.scale));
    this.updatePosition()
  };

  updatePosition() {
    this.x = this.originPoint.x + this.lineDist * Math.sin(this.angle);
    this.y = this.originPoint.y + this.lineDist * Math.cos(this.angle);
    this.originPoint.endX = this.x;
    this.originPoint.endY = this.y;
    this.sys.addToGrid(this);
  };

  updateRod(t) {
    if (this.originPoint) {
      if (this.originPoint.lineLocked) {
        this.rodMovement(t);
      };
    };
  };

  setupParticle(initialVel = 0, initialAngle = 0, initialLineDist = 0) {
    this.initialVel = initialVel;
    if (initialAngle == 0) {
      this.getAngleFromPos();
    }
    if (initialLineDist == 0) {
      this.lineDist = dist(this.x, this.y, this.originPoint.x, this.originPoint.y);
    }    
  };

  getAngleFromPos() {
    let gradient = (this.y - this.originPoint.y) / (this.x - this.originPoint.x); //gradient = tan of angle from positive x axis
    if (this.x < this.originPoint.x) {
      this.initialAngle = 3*Math.PI / 2 - Math.atan(gradient); //particle to left of point
    } else {
      this.initialAngle = Math.PI / 2 - Math.atan(gradient); //particle to right of point
    }
  }

}

sys1 = new System(1)
sysList.push(sys1)
sys1.setup();

function setup() {
  let cnv = createCanvas(windowWidth, windowHeight - 105);
  cnv.parent("canvas")
  cnv.position(0, 100);
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight-100);
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
  let u = thetaDot0;

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
  return theta.toFixed(6);
}

//https://www.youtube.com/watch?v=i9-seHaDkrw
//https://www.youtube.com/watch?v=TjZgQa2kec0
//let vall = rungeKutta(0, 0.2, 1, 0, 0.02); ------------TEST
//console.log(vall);


function draw() {
  background(242, 233, 228);

  for (let originPoint of sys1.points) {
    originPoint.draw();
  }

  for (let particle of sys1.particles) {
    particle.draw();
    if (particle.originPoint && sys1.started) {
      particle.update(sys1.t);
    }
  }
  
  stroke(0);
  strokeWeight(2);

  fill(232, 180, 35);
  textSize(100);
  text(sys1.t.toFixed(2), windowWidth-300, 115);
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