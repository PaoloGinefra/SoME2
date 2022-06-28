// Automabot Exemple variables
/*
const Automaton = [
	[0, 1],
	[0, 1],
]

let Nodes = [];

let automabot;
*/


function setup() {
	World.width = cols * cellSize;
	World.height = rows * cellSize;
	World.setup();
	textSize(32);
	textAlign(CENTER, CENTER);
	generateMaze();

	if (stack.length === 0) {
		background(60);
		const Automaton = result();
		printMatrix(Automaton)
		console.log("Maze Generated")
		let shortestWord = ShortestWord(Automaton);
		console.log(shortestWord)
		console.log(WordInterpreter(shortestWord[0]))
	}

	//Aautomabot Exemple Setup
	/*
	Nodes[0] = createVector(-1, 0);
	Nodes[1] = createVector(1, 0);

	automabot = new Automabot(Automaton, Nodes, 0.2, 0.1, Automabot.Sin)

	automabot.computeAnimation(0, "10010")*/
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
	World.draw()
	
	//Aautomabot Exemple Draw
	/*background(0)

	Nodes.forEach(node => {
		let p = World.w2s(node);
		ellipse(p.x, p.y, 0.3 * World.w2s())
	});

	automabot.draw()*/
}



