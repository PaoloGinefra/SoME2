function setup() {
	World.setup();
	createCanvas(cols * cellSize, rows * cellSize);
	generateMaze();
}

function draw() {
	if (stack.length === 0) {
		background(60);
		noLoop();
		result();
	}
}



