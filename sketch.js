let angle;
let g, r, v;
let particle;
let origin;
let angAcc, angVel;
let len;

let angle2;
let t;

let timeBar = document.getElementById("timeBar")
let playButton = document.getElementById("playButton");
let pauseButton = document.getElementById("pauseButton");
let play;
let started = false;

timeBar.max = 0;
timeBar.min = 0;

let resetButton = document.getElementById("resetButton");

let elements = [];
let points = [];
let particles = [];

class System {
  constructor(id) {
    this.id = id;
    this.elements = [];
    this.points = [];
    this.particles = [];
    this.started = false;
  }

  createParticle() {
    this.particles.push(Particle(this.particles.length, 100, 100));
  }

  createPoint() {
    this.points.push(Point(this.points.length, 200, 100));
  }
}

class Point {
  constructor(id, x, y) {
    this.id = id;
    this.x = x;
    this.y = y;
    this.radius = 2.5;
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
        this.particle.originPoint = this;
        this.endX = particle.x;
        this.endY = particle.y;
      }
    }
    if (this.lineLocked == false) {
      this.endX = this.x;
      this.endY = this.y;
    }
  }
}

class Particle {
  constructor(id, x, y, colour) {
    this.id = id;
    this.x = x;
    this.y = y;
    this.drag = false;
    this.radius = 12.5;
    this.originPoint = null
    this.angle = 0;
    this.lineDist = 0;
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
    //console.log("1", this.angle);
    //console.log(0, t, this.initialAngle, this.initialVel / (this.lineDist / 25), 0.0025)
    this.angle = rungeKutta(0, t, this.initialAngle, this.initialVel / (this.lineDist / 25), 0.0025);
    //console.log("2", this.angle)
    this.x = this.originPoint.x + this.lineDist * Math.sin(this.angle);
    this.y = this.originPoint.y + this.lineDist * Math.cos(this.angle);
  }

  updateRod() {
    if (this.originPoint) {
      console.log("linelocked", this.originPoint.lineLocked);
      if (this.originPoint.lineLocked) {
        this.rodMovement(t);
        this.originPoint.endX = this.x;
        this.originPoint.endY = this.y;
      }
    }
    
  }

  setupParticle(initialVel) {
    //console.log("SETUP----------------------------------------------------------------------------");
    this.initialVel = initialVel;
    this.getAngleFromPos();
    this.lineDist = dist(this.x, this.y, this.originPoint.x, this.originPoint.y); 
  }

  getAngleFromPos() {
    let gradient = (this.y - this.originPoint.y) / (this.x - this.originPoint.x); //gradient = tan of angle from positive x axis
    //console.log(gradient, "GRAD");
    if (this.x < this.originPoint.x) {
      this.initialAngle = 3*Math.PI / 2 - Math.atan(gradient); //particle to left of point
    } else {
      this.initialAngle = Math.PI / 2 - Math.atan(gradient); //particle to right of point
    }
    //console.log(this.initialAngle, "INIDIAL ANGLEEEEE");
    //this.initialAngle = Math.PI / 2 + Math.atan(gradient); //calculates theta
  }

}

let point1 = new Point(1, 0, 0);
let particle1 = new Particle(1, 0, 0, [255,0,0]);
let point3 = new Point(3, 100, 0);
let particle3 = new Particle(3, 100, 0, [0,255,0]);

points.push(point1);
particles.push(particle1);
elements.push(point1, particle1);

points.push(point3);
particles.push(particle3);
elements.push(point3, particle3);

function setup() {
  let cnv = createCanvas(windowWidth, windowHeight - 105);
  cnv.parent("canvas")
  cnv.position(0, 100);
  origin = createVector(500, 400);
  origin2 = createVector(500, 400);
  angle = 0;
  angle2 = 0;
  r = 200;
  g = 15;
  v = 22;
  len = r / 25; //sets scale --> 25 = 1m
  angAcc = 0;
  angVel = v / len; //sets angVelcoity
  particle = createVector();
  particle2 = createVector();
  t = 0;
  play = false;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight-100);
}

function f1(t, theta, u) {
  return u;
}

function f2(t, theta, u) {
  //return t * u ** 2 - theta ** 2
  return -(g / len) * Math.sin(theta);
}

// thetadot = u
function rungeKutta(t0, tf, theta0, thetaDot0, h) {
  let n = parseInt((tf - t0) / h, 10);
  let k1t, k2t, k3t, k4t, k1u, k2u, k3u, k4u;
  let theta = theta0;
  let u = thetaDot0;

  for (let i = 1; i <= n; i++) {
    k1t = h * f1(t0, theta, u);
    k1u = h * f2(t0, theta, u);

    k2t = h * f1(t0 + 0.5 * h, theta + 0.5 * k1t, u + 0.5 * k1u);
    k2u = h * f2(t0 + 0.5 * h, theta + 0.5 * k1t, u + 0.5 * k1u);

    k3t = h * f1(t0 + 0.5 * h, theta + 0.5 * k2t, u + 0.5 * k2u);
    k3u = h * f2(t0 + 0.5 * h, theta + 0.5 * k2t, u + 0.5 * k2u);

    k4t = h * f1(t0 + h, theta + k3t, u + k3u);
    k4u = h * f2(t0 + h, theta + k3t, u + k3u);

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

  point1.draw();
  particle1.draw();

  point3.draw();
  particle3.draw();

  for (let particle of particles) {
    if (particle.originPoint && started) {
      particle.update(t);
    }
  }
  //
  // particle.x = origin.x + r * Math.sin(angle);
  // particle.y = origin.y + r * Math.cos(angle);

  angle2 = rungeKutta(0, t, 0, v/len, 0.0025)

  particle2.x = origin2.x + r * Math.sin(angle2);
  particle2.y = origin2.y + r * Math.cos(angle2);
  // angle2 += 0.055

  // angAcc = -g/len * Math.sin(angle)
  // angVel += angAcc * 1/60
  // angle += angVel * 1/60

  stroke(0);
  strokeWeight(2);
  // line(origin.x, origin.y, particle.x, particle.y);
  line(origin2.x, origin2.y, particle2.x, particle2.y); //2

  fill(0, 0, 0);
  //circle(origin.x, origin.y, 5); //origin point
  circle(origin2.x, origin2.y, 5); //origin point 2

  // fill(255, 255, 255);
  // circle(particle.x, particle.y, 25); //particle

  fill(255, 255, 255);
  circle(particle2.x, particle2.y, 25); //2

  fill(232, 180, 35);
  textSize(100);
  text(t.toFixed(2), windowWidth-300, 115);
  if (play == true) {
    
    //console.log(particle1.lineDist, particle1.initialVel, particle1.angle);
    t += 1 / 60;
    if (t > timeBar.max) {
      timeBar.max = t;
      timeBar.step = t / 10000;
    } 
    timeBar.value = t;
    // timeBar.min = t / 100;
    // timeBar.value = t
  }
}

function mouseDragged() {
  for (let e of elements) {
    if (e.drag) {
      e.x = mouseX;
      e.y = mouseY;
    }
  }
  for (let p of points) {
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
  for (let e of elements) {
    if ((mouseX - e.x) ** 2 + (mouseY - e.y) ** 2 <= e.radius ** 2) {
      if (mouseButton === LEFT) {
        e.drag = true;
      } else if (points.includes(e) && mouseButton === RIGHT) {
        e.lineDrag = true;
        console.log("linedrag", e.lineDrag);
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
  for (let e of elements) {
    e.drag = false;
  }
  for (let p of points) {
    if (p.lineDrag) {
      p.lineDrag = false;
      p.checkParticle(particles);
    }
  }
}

//timeBar.step = 1 / 60;
//timeBar.min = 1 / 60;
timeBar.oninput = function () {
  t = parseFloat(this.value);
  console.log(t, typeof t)
}

playButton.onmousedown = function () {
  if (play == false) {
    if (!started) {
      for (let particle of particles) {
        particle.setupParticle(15);
        //console.log(particle.lineDist, particle.initialVel, particle.angle);
      }
      particle3.initialVel = 15;
      started = true;
    }
    play = true;
    
  }
}

pauseButton.onmousedown = function () {
  if (play == true) {
    play = false;
    timeBar.value = t;
  }
}

resetButton.onmousedown = function () {
  reset = true;
}
