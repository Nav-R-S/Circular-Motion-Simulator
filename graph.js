let backButton = document.getElementById("backButton");

backButton.onclick = function () { 
  window.location.href = "index.html";
}; //return button properties set

const canvas = document.getElementById("kineticEnergyGraph");
const ctx = canvas.getContext("2d");

let window_height = window.innerHeight;
let window_width = window.innerWidth;

canvas.width = window_width;
canvas.height = window_height - 104;

ctx.translate(0, 104); // translates down to make room for header

ctx.clearRect(0, 0, canvas.width, canvas.height); //clears previous

function drawAxes(originX, originY, width, height) {
    ctx.strokeStyle = "black";
    ctx.lineWidth = 2;

    //x axis
    ctx.beginPath();
    ctx.moveTo(originX, originY);
    ctx.lineTo(originX + width, originY);
    ctx.stroke();

    //y axis
    ctx.beginPath();
    ctx.moveTo(originX, originY);
    ctx.lineTo(originX, originY - height);
    ctx.stroke();
}

function plotPoint(time, ke, originX, originY, maxHeight, maxKE, maxTime, maxWidth, color = "red", size = 2) {
    let heightPerKE = maxHeight / maxKE ;
    let propKE = ke * heightPerKE

    let widthPerTime =  maxWidth / maxTime ;
    let propTime = time * widthPerTime;

    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(originX + propTime, originY - propKE, size, 0, Math.PI * 2);
    ctx.fill();

    return [originX + propTime, originY - propKE];
}// func to plot points and store locations to draw the line connecting them

let canvasOriginX = window_width / 4;
let canvasOriginY = window_height - 104 - (window_height - 104) / 4;

let canvasWidth = window_width / 2;
let canvasHeight = 600;

drawAxes(canvasOriginX, canvasOriginY, canvasWidth, canvasHeight);

let getData = sessionStorage.getItem("keListData");// gets json for data list
let keList = JSON.parse(getData); //retrieves data list

let maxKEVal = keList.reduce((max, subArr) => Math.max(max, subArr[1]), 0); //loops through and compares each sub array at index 1 with max var initally 0
let maxTimeVal = keList[keList.length-1][0]; //gets final time input

console.log(keList);

ctx.strokeStyle = "red";
ctx.lineWidth = 1;


let ptList = [] //list of points to plot

for (data of keList) {
    let time = data[0];
    let ke = data[1];

    let newPt = plotPoint(time, ke, canvasOriginX, canvasOriginY, canvasHeight, maxKEVal, maxTimeVal, canvasWidth);
    console.log(newPt)
    ptList.push(newPt);
};

ctx.beginPath(); //displaying line
ctx.moveTo(canvasOriginX, canvasOriginY);

for (let i = 1; i < ptList.length; i++) {
  ctx.lineTo(ptList[i][0], ptList[i][1]);
}

ctx.stroke();
