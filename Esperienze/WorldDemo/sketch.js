function setup() {
	World.setup(windowWidth, windowHeight);
	
}

function draw() {
	background(255)
	World.draw();
	let p = World.w2s(createVector(0, 0));
	ellipse(p.x, p.y, World.w2s(0.1));
}
