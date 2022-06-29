import "p5";
import { Bodies, Body, Common, Engine, World, Vector } from "matter-js";
import polyDecomp from "poly-decomp";

// enable polygon decomposition, see: https://brm.io/matter-js/docs/classes/Common.html#method_setDecomp
Common.setDecomp(polyDecomp);

// enable intellisense autocompletion for p5 globals
/// <reference path="@types/p5/global.d.ts" />

class PhysicsBody {
  constructor(world, attributes, options) {
    this.world = world;
    this.attributes = attributes;
    this.options = options;
    this.createBody();
    World.add(this.world, this.body);
  }

  createBody() {
    throw new Error("Not implemented");
  }

  draw() {
    if (this.attributes.color) {
      fill(this.attributes.color);
    } else {
      noFill();
    }

    if (this.attributes.stroke) {
      stroke(this.attributes.stroke);
      if (this.attributes.weight) {
        strokeWeight(this.attributes.weight);
      }
    } else {
      noStroke();
    }

    this.drawBody();
  }

  drawBody() {
    if (this.body.parts && this.body.parts.length > 1) {
      // skip index 0
      for (let p = 1; p < this.body.parts.length; p++) {
        this.drawVertices(this.body.parts[p].vertices);
      }
    } else {
      this.drawVertices(this.body.vertices);
    }
  }

  drawVertices(vertices) {
    beginShape();
    for (const vertice of vertices) {
      vertex(vertice.x, vertice.y);
    }
    endShape(CLOSE);
  }
}

class Box extends PhysicsBody {
  constructor(world, attributes, options) {
    super(world, attributes, options);
  }

  createBody() {
    this.body = Bodies.rectangle(
      this.attributes.x,
      this.attributes.y,
      this.attributes.w,
      this.attributes.h,
      this.options
    );
  }
}

// NOTE: when instantiting this class the x and y coords are in the center of the main rectangle
class OrientableItem extends PhysicsBody {
  constructor(world, attributes, options) {
    super(world, attributes, options);
  }

  createBody() {
    const { x, y, mainWidth, mainHeight, nubWidth, nubHeight } =
      this.attributes;

    // NOTE: matterjs positions rectangles from the center
    const main = Bodies.rectangle(x, y, mainWidth, mainHeight);
    const nub = Bodies.rectangle(
      x,
      y - mainHeight / 2 - nubHeight / 2,
      nubWidth,
      nubHeight
    );

    this.body = Body.create({
      parts: [main, nub],
      ...this.options,
    });
  }
}

const engine = Engine.create();
const world = engine.world;

// disable gravity
engine.gravity.x = 0;
engine.gravity.y = 0;

const items = [];

let upperWall;
let lowerWall;

let redirector;

window.setup = function () {
  createCanvas(900, 400);

  upperWall = new Box(
    world,
    {
      x: width / 2,
      y: 0,
      w: width,
      h: 20,
      color: "white",
    },
    { isStatic: true }
  );
  lowerWall = new Box(
    world,
    {
      x: width / 2,
      y: height,
      w: width,
      h: 20,
      color: "white",
    },
    { isStatic: true }
  );

  redirector = new Box(
    world,
    {
      x: width / 2,
      y: 0,
      w: 20,
      h: 140,
      color: "red",
    },
    { isStatic: true }
  );
};

let time = 0;

window.draw = function () {
  // physics

  // NOTE: deltaTime is a p5 global variable
  Engine.update(engine, deltaTime);
  items.forEach((item) => {
    Body.applyForce(item.body, item.body.position, Vector.create(0.3, 0));
  });

  // TODO: destroy items out of screen
  // TODO: use more robust siystem for time

  if (time == 0) {
    time = 0;

    let newItem = new OrientableItem(
      world,
      {
        x: 200,
        y: 175,
        mainWidth: 150,
        mainHeight: 200,
        nubWidth: 50,
        nubHeight: 50,

        color: "white",
      },
      { frictionAir: 0.6 }
    );

    items.push(newItem);
  }

  time++;
  if (time > 3 * 60) {
    time = 0;
  }

  // drawing
  background("#333");
  upperWall.draw();
  lowerWall.draw();
  redirector.draw();
  items.forEach((item) => item.draw());
};
