import "p5";

// enable intellisense autocompletion for p5 globals
/// <reference path="@types/p5/global.d.ts" />

const conveyorSpeed = 0.5;

class OrientableItem {
  mainWidth = 150;
  mainHeight = 200;
  nubWidth = 50;
  nubHeight = 50;

  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  update() {
    this.x += deltaTime * conveyorSpeed;
  }

  draw() {
    fill(255);
    noStroke();
    rect(this.x, this.y, this.mainWidth, this.mainHeight);
    rect(
      this.x + this.mainWidth / 2 - this.nubWidth / 2,
      this.y - this.nubHeight,
      this.nubWidth,
      this.nubHeight
    );
  }
}

// NOTE: consider this an abstract class
class Pin {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  draw() {
    fill(this.color);
    noStroke();
    rect(this.x, this.y, this.w, this.h);
  }
}

class RedPin extends Pin {
  color = "red";
  w = 20;
  h = 140;

  constructor(x, y) {
    super(x, y);
  }
}

class GreenPin extends Pin {
  color = "green";
  w = 20;
  h = 100;

  constructor(x, y) {
    super(x, y);
  }
}

let redPin;
let greenPin;
const items = [];

function addItem() {
  let newItem = new OrientableItem(200, 175);
  items.push(newItem);
}

window.setup = function () {
  createCanvas(900, 400);

  redPin = new RedPin(500, 0);
  greenPin = new GreenPin(700, height - 100);

  addItem();
  setInterval(addItem, 3 * 1000);
};

let time;

window.draw = function () {
  // update
  items.filter((item) => item.x < width); // remove out of screen items
  items.forEach((item) => item.update());

  // draw
  background("#333");
  redPin.draw();
  greenPin.draw();
  items.forEach((item) => item.draw());
};

addItem();
