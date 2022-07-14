import "p5";

// enable intellisense autocompletion for p5 globals
/// <reference path="@types/p5/global.d.ts" />

const conveyorSpeed = 0.5;
const conveyorSectionWidth = 400;

// enum
const orientations = [0, Math.PI / 2, Math.PI, 3 * (Math.PI / 2)];

const automaton = [
  [3, 1],
  [1, 2],
  [2, 3],
  [3, 0],
];

function rectangleCenter(x, y, w, h) {
  const x1 = x;
  const y1 = y;
  const x2 = x + w;
  const y2 = y + h;

  return [(x1 + x2) / 2, (y1 + y2) / 2];
}

class OrientableItem {
  mainWidth = 150;
  mainHeight = 200;
  nubWidth = 50;
  nubHeight = 50;

  constructor(x, y, initialState) {
    this.x = x;
    this.y = y;
    this.state = initialState;
  }

  // calculate the center by making a weighted average of the center of the two rectangles. The area of the rectangles is used as the weight.
  get center() {
    // center of the main rectangle
    const [x1, y1] = rectangleCenter(
      this.x,
      this.y,
      this.mainWidth,
      this.mainHeight
    );
    // center of the nub
    const [x2, y2] = rectangleCenter(
      this.x + this.mainWidth / 2 - this.nubWidth / 2,
      this.y - this.nubHeight,
      this.nubWidth,
      this.nubHeight
    );

    const mainArea = this.mainWidth * this.mainHeight;
    const nubArea = this.nubWidth * this.nubHeight;
    const totalArea = mainArea + nubArea;

    // weighted average
    return [
      (x1 * mainArea + x2 * nubArea) / totalArea,
      (y1 * mainArea + y2 * nubArea) / totalArea,
    ];
  }

  get angle() {
    return orientations[this.state];
  }

  transition(action) {
    this.state = automaton[this.state][action];
  }

  update() {
    this.x += deltaTime * conveyorSpeed;
  }

  draw() {
    const [rx, ry] = this.center;

    fill(255);
    noStroke();

    push();
    translate(rx, ry);
    rotate(this.angle);
    translate(-rx, -ry);

    rect(this.x, this.y, this.mainWidth, this.mainHeight);
    rect(
      this.x + this.mainWidth / 2 - this.nubWidth / 2,
      this.y - this.nubHeight,
      this.nubWidth,
      this.nubHeight
    );

    pop();

    // debug draw
    strokeWeight(10);

    stroke("green");
    const [x, y] = this.center;
    point(x, y);

    stroke("red");
    point(this.x, this.y);
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

  constructor(sectionId) {
    super(sectionId);
  }
}

class GreenPin extends Pin {
  color = "green";
  w = 20;
  h = 100;
  y = height - this.h;

  constructor(sectionId) {
    super(sectionId);
  }
}

const pins = [];
let items = [];

function addItem() {
  let newItem = new OrientableItem(
    -150,
    0,
    Math.floor(Math.random() * automaton.length)
  );

  // center item verically
  let [_, centerY] = newItem.center;
  newItem.y = height / 2 + (newItem.y - centerY);

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
  items = items.filter((item) => item.x < width); // remove out of screen items
  items.forEach((item) => {
    item.update();

    // find lat pin that was passed
    const pin = pins
      .sort((p1, p2) => p2.x - p1.x)
      .find((p) => Math.abs(p.x - item.x) <= 3); // FIXME: this solution is clunky and will not work if the framerate is low enough
    // when the item has just been spawned it has not passedany pin, so it is undefined
    if (pin) {
      const action = pin.color === "red" ? 0 : 1;
      item.transition(action);
    }
  });

  // draw
  background("#333");
  pins.forEach((pin) => pin.draw());
  items.forEach((item) => item.draw());

  // debug draw
  strokeWeight(1);
  stroke(127);
  line(0, height / 2, width, height / 2);
};
