let timeBar = document.getElementById("timeBar")
let playButton = document.getElementById("playButton");
let pauseButton = document.getElementById("pauseButton");
let resetButton = document.getElementById("resetButton");
let objectsMenu = document.getElementById("objectsMenuButton");
// let dropdownHeading = document.getElementById("dropdownHeading");

timeBar.max = 0;
timeBar.min = 0;

class System {
  constructor(id) {
    this.id = id;
    this.g = 9.81;
    this.elements = [];
    this.points = [];
    this.particles = [];
    this.started = false;
    this.play = false;
    this.t = 0;
  }

  createParticle(x, y, colour) {
    let particleID = this.particles.length
    let newParticle = new Particle(particleID, this, x, y, colour);
    this.particles.push(newParticle);
    this.elements.push(newParticle);
    const particleElement = document.createElement("div");
    const particleCategory = document.getElementById("particlesContent")
    let particleName = "particle " + particleID;
    particleElement.innerHTML = particleName;
    particleCategory.appendChild(particleElement);
    particleElement.classList.add("object")
  }

  createPoint(x, y) {
    let pointID = this.points.length
    let newPoint = new Point(pointID, this, x, y);
    this.points.push(newPoint);
    this.elements.push(newPoint);
    const pointElement = document.createElement("div");
    const pointCategory = document.getElementById("pointsContent")
    let pointName = "point " + pointID;
    pointElement.innerHTML = pointName;
    pointCategory.appendChild(pointElement);
    pointElement.classList.add("object")
  }

  randColour() {
    let r = Math.floor(Math.random() * 255);
    let g = Math.floor(Math.random() * 255);
    let b = Math.floor(Math.random() * 255);
    return [r, g, b];
  }

  resetSys() {
    this.play = false;
    this.t = 0;
    this.started = false;
    timeBar.max = 0;
    timeBar.min = 0;
  }
}

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
  }
  draw() {
    line(this.x, this.y, this.endX, this.endY);
    fill(0, 0, 0);
    circle(this.x, this.y, 2 * this.radius);
  }
  checkParticle(particleList) {
    for (let particle of particleList) {
      if (
        (this.endX - particle.x) ** 2 + (this.endY - particle.y) ** 2 <= particle.radius ** 2) {
        this.lineLocked = true;
        this.particle = particle;
        if (this.particle.originPoint) { //gets rid of previous connection
          this.particle.originPoint.particle = null;
          this.particle.originPoint.lineLocked = false;
          this.particle.originPoint.endX = this.particle.originPoint.x;
          this.particle.originPoint.endY = this.particle.originPoint.y;
        }
        this.particle.originPoint = this;
        this.endX = particle.x;
        this.endY = particle.y;
        this.particle.setupParticle(0);
        this.sys.resetSys();
      }
    }
    if (this.lineLocked == false) {
      this.endX = this.x;
      this.endY = this.y;
    }
  }
}

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
  }
  draw() {
    fill(this.colour[0], this.colour[1], this.colour[2]);
    circle(this.x, this.y, 2 * this.radius);
  }

  update(t) {
    //this.rodMovement(t);
    this.updateRod(t);
  }

  rodMovement(t) {
    this.angle = rungeKutta(0, t, this.initialAngle, this.initialVel / (this.lineDist / 50), 0.0025, this.sys.g, (this.lineDist / 50));
    this.x = this.originPoint.x + this.lineDist * Math.sin(this.angle);
    this.y = this.originPoint.y + this.lineDist * Math.cos(this.angle);
  }

  updateRod(t) {
    if (this.originPoint) {
      if (this.originPoint.lineLocked) {
        this.rodMovement(t);
        this.originPoint.endX = this.x;
        this.originPoint.endY = this.y;
      }
    }
    
  }

  setupParticle(initialVel) {
    this.initialVel = initialVel;
    this.getAngleFromPos();
    this.lineDist = dist(this.x, this.y, this.originPoint.x, this.originPoint.y); 
  }

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
sys1.createParticle(100, 100, sys1.randColour());
sys1.createPoint(100, 200);
sys1.createParticle(200, 100, sys1.randColour());
sys1.createPoint(200,200);

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
    if ((mouseX - e.x) ** 2 + (mouseY - e.y) ** 2 <= e.radius ** 2) {
      if (mouseButton === LEFT) {
        e.drag = true;
      } else if (sys1.points.includes(e) && mouseButton === RIGHT) {
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

timeBar.oninput = function () {
  sys1.t = parseFloat(this.value);
}

playButton.onmousedown = function () {
  //let particlesConnected = true; 
  if (sys1.play == false) {
    if (!sys1.started) {
      for (let particle of sys1.particles) {
        if (particle.originPoint) {
          particle.setupParticle(0);
        }
      }
      sys1.started = true;
    }
    sys1.play = true;
    
  }
}

pauseButton.onmousedown = function () {
  if (sys1.play == true) {
    sys1.play = false;
    timeBar.value = sys1.t;
  }
}

resetButton.onmousedown = function () {
  sys1.resetSys();
}

objectsMenu.onclick = function () {
  let objectsMenu = document.getElementById("objectsMenu")
  objectsMenu.classList.toggle("showCategories");
}

// dropdownHeading.onclick = function () {
//   let category = document.getElementById("objectsMenu")
//   objectsMenu.classList.toggle("showObject");
// }
