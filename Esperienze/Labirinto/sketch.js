function setup() {
	World.setup();
	createCanvas(cols * cellSize, rows * cellSize);
	textSize(32);
	textAlign(CENTER, CENTER);
	generateMaze();

}

const Directions = ['N', 'E', 'S', 'W']

function WordInterpreter(word){
	let interpretedWord = ""
	for(let i = 0; i < word.length; i++){
		interpretedWord += Directions[Number(word.charAt(i))]
	}
	return interpretedWord
}

function draw() {
	if (stack.length === 0) {
		background(60);
		noLoop();
		const Automaton = result();
		let shortestWord = ShortestWord(Automaton);
		console.log(shortestWord)
		console.log(WordInterpreter(shortestWord[0]))
	}
}



