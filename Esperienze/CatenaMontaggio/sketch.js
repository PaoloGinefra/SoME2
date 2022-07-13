import "p5";

// enable intellisense autocompletion for p5 globals
/// <reference path="@types/p5/global.d.ts" />

const conveyorSpeed = 0.5;
const conveyorSectionWidth = 400;

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
  constructor(sectionId) {
    this.x = conveyorSectionWidth * sectionId + conveyorSectionWidth / 2;
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
  y = 0;

  constructor(x, y) {
    super(x, y);
  }
}

class GreenPin extends Pin {
  color = "green";
  w = 20;
  h = 100;
  y = height - this.h;

  constructor(x, y) {
    super(x, y);
  }
}

const pins = [];
const items = [];

function addItem() {
  let newItem = new OrientableItem(-150, 175);
  items.push(newItem);
}

window.setup = function () {
  createCanvas(1500, 400);

  const sections = Math.floor(width / conveyorSectionWidth);
  for (let i = 0; i < sections; i++) {
    const newPin = i % 2 == 0 ? new RedPin(i) : new GreenPin(i);
    pins.push(newPin);
  }

  addItem();
  setInterval(addItem, 3 * 1000);
};

window.draw = function () {
  // update
  items.filter((item) => item.x < width); // remove out of screen items
  items.forEach((item) => item.update());

  // draw
  background("#333");
  pins.forEach((pin) => pin.draw());
  items.forEach((item) => item.draw());
};
