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
let play

function setup() {
  let cnv = createCanvas(windowWidth, windowHeight - 115);
  cnv.parent("canvas")
  cnv.position(0, 115);
  origin = createVector(500, 400);
  origin2 = createVector(500, 400);
  angle = 0;
  angle2 = 0;
  r = 250;
  g = 10;
  v = 20;
  len = r / 25; //sets scale --> 25 = 1m
  angAcc = 0;
  angVel = v / len; //sets angVelcoity
  particle = createVector();
  particle2 = createVector();
  t = 0;
  play = true;
}

function windowResized() {
  resizeCanvas(windowWidth, windowHeight-115);
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

  particle.x = origin.x + r * Math.sin(angle);
  particle.y = origin.y + r * Math.cos(angle);

  angle2 = rungeKutta(0, t, 0, v/len, 0.0025)

  particle2.x = origin2.x + r * Math.sin(angle2);
  particle2.y = origin2.y + r * Math.cos(angle2);
  // angle2 += 0.055

  // angAcc = -g/len * Math.sin(angle)
  // angVel += angAcc * 1/60
  // angle += angVel * 1/60

  stroke(0);
  strokeWeight(2);
  line(origin.x, origin.y, particle.x, particle.y);
  line(origin2.x, origin2.y, particle2.x, particle2.y); //2

  fill(0, 0, 0);
  circle(origin.x, origin.y, 5); //origin point
  circle(origin2.x, origin2.y, 5); //origin point 2

  fill(255, 255, 255);
  circle(particle.x, particle.y, 25); //particle

  fill(255, 0, 255);
  circle(particle2.x, particle2.y, 25); //2

  textSize(100);
  text(t, 50, 115);
  if (play == true) {
    t += 1 / 60;
    timeBar.value = t;

    // timeBar.max = t;
    // timeBar.step = t / 100;
    // timeBar.min = t / 100;
    // timeBar.value = t
  }
}

//timeBar.step = 1 / 60;
//timeBar.min = 1 / 60;
timeBar.oninput = function () {
  if (play == false) {
    t = this.value;
  }
  console.log(this.value)
}

playButton.onclick = function () {
  if (play == false) {
    play = true;
  }
}

pauseButton.onclick = function () {
  if (play == true) {
    play = false;
    timeBar.max = t;
    timeBar.step = t / 100;
    timeBar.min = t / 100;
    timeBar.value = t
  }
};


