import "p5";
import { Bodies, Common, Engine, Vertices, World } from "matter-js";
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

class Polygon extends PhysicsBody {
  constructor(world, attributes, options) {
    super(world, attributes, options);
  }

  createBody() {
    this.body = Bodies.fromVertices(
      this.attributes.x,
      this.attributes.y,
      this.attributes.vertexSet,
      this.options,
      true
    );
  }
}

let engine = Engine.create();
let world = engine.world;

let poly;
let box;
let ground;

window.setup = function () {
  createCanvas(700, 500);

  let arrowVertices = Vertices.fromPath(
    "40 0 40 20 100 20 100 80 40 80 40 100 0 50"
  );

  let chevronVertices = Vertices.fromPath(
    "100 0 75 50 100 100 25 100 0 50 25 0"
  );

  poly = new Polygon(world, {
    x: 200,
    y: 200,
    // vertexSet: arrowVertices,
    vertexSet: chevronVertices,
    color: "white",
  });
  box = new Box(world, {
    x: 270,
    y: 50,
    w: 160,
    h: 80,
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
  box.draw();
  ground.draw();
};
