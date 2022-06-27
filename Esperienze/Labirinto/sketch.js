function setup() {
	createCanvas(windowWidth, windowHeight);
	World.setup();
}

function draw() {
	World.draw();
	background(255);
	var pos = World.w2sVec(createVector(1, 1))
	ellipse(pos.x, pos.y, 2 * World.w2s())
}
