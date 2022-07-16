import "p5";
import { automaton, CONVEYOR_SPEED, SECTIONS_NUMBER } from "./constants";
import { OrientableItem } from "./OrientableItem";
import { Section } from "./Section";

// enable intellisense autocompletion for p5 globals
/// <reference path="@types/p5/global.d.ts" />

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
  createCanvas(2000, 400);

  const sectionWidth = Math.floor(width / SECTIONS_NUMBER);
  for (let i = 0; i < SECTIONS_NUMBER; i++) {
    const action = i % 2 == 0 ? 0 : 1;
    const newSection = new Section(i, action, sectionWidth);
    sections.push(newSection);
  }

  addItem();

  const interval = width / CONVEYOR_SPEED;
  window.setInterval(addItem, interval);
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

window.mouseClicked = function () {
  sections.forEach((section) => section.mouseClicked());
};
