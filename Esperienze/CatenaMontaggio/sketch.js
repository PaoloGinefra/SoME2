import "p5";
import { Engine } from "matter-js";

// where i stole the classes from: https://github.com/b-g/p5-matter-examples/
import { Block } from "./Block";

// enable intellisense autocompletion for p5 globals
/// <reference path="@types/p5/global.d.ts" />

let engine = Engine.create();
let world = engine.world;

let blockA;
let blockB;
let ground;

window.setup = function () {
  createCanvas(700, 500);

  blockA = new Block(world, {
    x: 200,
    y: 200,
    w: 80,
    h: 80,
    color: "white",
  });
  blockB = new Block(world, {
    x: 270,
    y: 50,
    w: 160,
    h: 80,
    color: "white",
  });
  ground = new Block(
    world,
    { x: 400, y: 500, w: 810, h: 15, color: "grey" },
    { isStatic: true, angle: PI / 36 }
  );
};

window.draw = function () {
  // NOTE: deltaTime is a p5 global variable
  Engine.update(engine, deltaTime);

  background("#333");

  blockA.draw();
  blockB.draw();
  ground.draw();
};
