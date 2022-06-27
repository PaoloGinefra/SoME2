function setup() {
	console.log(ShortestWord(Automaton));
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




