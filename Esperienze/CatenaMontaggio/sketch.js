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

  constructor(x, y, initialState, sections) {
    this.x = x;
    this.y = y;
    this.state = initialState;
    this.sections = sections;
    this.lastSection = this.section; // NOTE: the item spawns off screen so this will be undefined in the begining
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

  // NOTE: this returnsundefined if the item is off screen
  get section() {
    const [x, _] = this.center;
    return this.sections.find((section) => section.isInside(x));
  }

  transition(action) {
    this.state = automaton[this.state][action];
  }

  update() {
    this.x += deltaTime * conveyorSpeed;
    const currentSection = this.section;

    if (currentSection && currentSection.index !== this.lastSection?.index) {
      if (this.x >= currentSection.pinPosition) {
        this.lastSection = currentSection;
        this.transition(currentSection.action);
      }
    }
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

class Section {
  constructor(index, action) {
    this.index = index;
    this.action = action;

    // x position of start and end of this section
    this.start = conveyorSectionWidth * index;
    this.end = conveyorSectionWidth * (index + 1);

    // x position where the pin will be drawn
    this.pinPosition =
      conveyorSectionWidth * this.index + conveyorSectionWidth / 2;
  }

  isInside(x) {
    // NOTE: start is inclusive and end is exclusive, this is to avoid having some x coords that are in two sections simultaneously
    return x >= this.start && x < this.end;
  }

  drawRed() {
    const color = "red";
    const w = 20;
    const h = 140;
    const y = 0;

    fill(color);
    noStroke();
    rect(this.pinPosition - w / 2, y, w, h);
  }

  drawGreen() {
    const color = "green";
    const w = 20;
    const h = 100;
    const y = height - h;

    fill(color);
    noStroke();
    rect(this.pinPosition - w / 2, y, w, h);
  }

  draw() {
    if (this.action === 0) {
      this.drawRed();
    } else {
      this.drawGreen();
    }
  }
}

const sections = [];
let items = [];

function addItem() {
  let newItem = new OrientableItem(
    -150,
    0,
    Math.floor(Math.random() * automaton.length),
    sections
  );

  // center item verically
  let [_, centerY] = newItem.center;
  newItem.y = height / 2 + (newItem.y - centerY);

  items.push(newItem);
}

window.setup = function () {
  createCanvas(1500, 400);

  const sectionsNumber = Math.floor(width / conveyorSectionWidth);
  for (let i = 0; i < sectionsNumber; i++) {
    const action = i % 2 == 0 ? 0 : 1;
    const newSection = new Section(i, action);
    sections.push(newSection);
  }

  addItem();
  window.setInterval(addItem, 3 * 1000);
};

window.draw = function () {
  // update
  items = items.filter((item) => item.x < width); // remove out of screen items
  items.forEach((item) => item.update());

  // draw
  background("#333");
  sections.forEach((section) => section.draw());
  items.forEach((item) => item.draw());

  // debug draw
  strokeWeight(1);
  stroke(127);
  line(0, height / 2, width, height / 2);
};
