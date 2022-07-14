let mazeGenerator, automabot;
const size = 5;
let state;

let tool = 2;

let UiPressed = false;

let font;
function preload(){
	font = loadFont('../Art/Fonts/PressStart2P.ttf')
}

function setup() {
	World.setup(windowWidth, windowHeight);

	UIsetup();
	textFont(font);

	//Maze Generation
	mazeGenerator = new NonPerfectMazeGenerator(5, 5, 2, 0.7, 0.1, size);
	mazeGenerator.generateMaze();
	mazeGenerator.buildAutomata();

	//Automabot
	automabot = new Automabot();
	automabot.speed = 5;
	automabot.Interpolation = Automabot.DoubleSigmoid
	state = mazeGenerator.state2mapState[floor(Math.random() * mazeGenerator.Automaton.length)];
	UpdateAutomabot();
	automabot.computeAnimation(state, "", true, 1);

	ComputeWord();
}

function draw() {
	background(255);
	World.draw();

	mazeGenerator.draw();
	automabot.drawSprite();

	let wMouse = World.s2w(World.mouseVec);
	mazeGenerator.drawBrush(wMouse, tool);

	drawWord();

	automabot.animationStep();
}

const keyComands = [
	['w', 'd', 's', 'a'],
	['ArrowUp', 'ArrowRight', 'ArrowDown', 'ArrowLeft'],
];

function keyPressed(){
	let i, j;
	for(j = 0; j < keyComands.length && (j == 0 || key != keyComands[j - 1][i]); j++)
		for(i = 0; i < keyComands[j].length && key != keyComands[j][i]; i++);
	
	if(i < keyComands[0].length){
		automabot.computeAnimation(state, i.toString(), true);
	}
}

function mouseClicked(){
	if(UiPressed){
		UiPressed = false;
		return;
	}

	let wMouse = World.s2w(World.mouseVec);
	if(tool != 2 && mouseButton == LEFT && mazeGenerator.brush(wMouse, tool)){
		ComputeWord();

		mazeGenerator.buildAutomata();

		UpdateAutomabot();
		state = mazeGenerator.state2mapState[automabot.nearestState(mazeGenerator.Nodes)];
		automabot.computeAnimation(state, "", true, 1);

		ComputeWord();
	}
}

function UpdateAutomabot(){
	automabot.Automaton = mazeGenerator.MapAutomaton;
	automabot.Nodes = mazeGenerator.mapNodes;
	automabot.size = mazeGenerator.cellSize;
}

function ComputeWord(){
	syncWord = '...'
	syncWorker.postMessage(mazeGenerator.Automaton);
}

function drawWord(){
	let p = World.w2s(createVector(0, size/2));
	textAlign(CENTER, BOTTOM);
	textSize(World.w2s(mazeGenerator.cellSize));
	fill(0)
	text(convertWord(syncWord) + '->' + syncDestination, p.x, p.y);
}

let dirs = "URDL";
function convertWord(word){
	let out = "";
	for(let c of word) 
  		out += dirs.charAt(Number(c));
	return out;
}

let brickButton, shovelButton;

function UIsetup(){
	brickButton = select('#brick');
	brickButton.mousePressed(() => {
		UiPressed = true;
		tool = 0;
		brickButton.style('transform: scale(1.2);')
		brickButton.style('background-color: white; opacity: 100%;')
		shovelButton.style('transform: scale(1);')
		shovelButton.style('background-color: rgba(0,0,0,0); opacity: 50%;')
	});

	shovelButton = select('#shovel');
	shovelButton.mousePressed(() => {
		UiPressed = true;
		tool = 1;
		brickButton.style('transform: scale(1);')
		brickButton.style('background-color: rgba(0,0,0,0); opacity: 50%;')
		shovelButton.style('transform: scale(1.2);')
		shovelButton.style('background-color: white;opacity: 100%;')

	});

	brickButton.style('background-color: rgba(0,0,0,0); opacity: 50%;')
	shovelButton.style('background-color: rgba(0,0,0,0); opacity: 50%;')
}