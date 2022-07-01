function setup() {
	World.setup(cols * cellSize, rows * cellSize);
	textSize(32);
	textAlign(CENTER, CENTER);
	generateMaze();

}

function draw() {
	if (stack.length === 0) {
		background(60);
		noLoop();
		const Automaton = result();
		printMatrix(Automaton)
	}
}
