import "p5";
import { Bodies, Engine, Vertices, World } from "matter-js";

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

    this.drawVertices(this.body.vertices);
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

class Polygon extends PhysicsBody {
  constructor(world, attributes, options) {
    super(world, attributes, options);
  }

  createBody() {
    this.body = Bodies.fromVertices(
      this.attributes.x,
      this.attributes.y,
      this.attributes.vertexSet,
      this.options
    );
  }
}

let engine = Engine.create();
let world = engine.world;

let poly;
let ground;

window.setup = function () {
  createCanvas(700, 500);

  // FIXME: it does not look anything like an arrow
  let arrowVertices = Vertices.fromPath(
    "40 0 40 20 100 20 100 80 40 80 40 100 0 50"
  );

  // let chevronVertices = Vertices.fromPath(
  //   "100 0 75 50 100 100 25 100 0 50 25 0"
  // );

  poly = new Polygon(world, {
    x: 200,
    y: 200,
    vertexSet: arrowVertices,
    color: "white",
  });
  ground = new Box(
    world,
    { x: 400, y: 500, w: 810, h: 15, color: "grey" },
    { isStatic: true, angle: PI / 36 }
  );
};

window.draw = function () {
  // NOTE: deltaTime is a p5 global variable
  Engine.update(engine, deltaTime);

  background("#333");

  poly.draw();
  ground.draw();
};
