let imageWaller, mazeGenerator, graphVisualizer;

let phSlider, pcSlider, mSlider, seedSlider;
let phLabel, pcLabel, mLabel, seedLabel, toolLabel;
let displayGraphCheckbox, generateButton;

let divLen = 80;
let divHeight = 30;

let tool = 0;

let syncWord = 'Sus';

const worker = new Worker('worker.js');

worker.onmessage = message => syncWord = message.data;

function setup() {
	World.setup(windowWidth, windowHeight);
	mazeGenerator = new NonPerfectMazeGenerator(5, 5, 2);
	mazeGenerator.generateMaze();
	mazeGenerator.size = 2;

	phLabel = createDiv('ph [0, 1]');
	phLabel.position(0, 0);
	phLabel.size(divLen, 10)

	phSlider = createSlider(0, 100, 50);
	phSlider.position(divLen, 0);
	phSlider.style('width', '200px');

	pcLabel = createDiv('pc [0, 1]');
	pcLabel.position(0, divHeight);
	pcLabel.size(divLen, divHeight)

	pcSlider = createSlider(0, 100, 10);
	pcSlider.position(divLen, divHeight);
	pcSlider.style('width', '200px');

	mLabel = createDiv('size [1, 15]');
	mLabel.position(0, 2*divHeight);
	mLabel.size(divLen, divHeight)

	mSlider = createSlider(1, 15, 5);
	mSlider.position(divLen, 2*divHeight);
	mSlider.style('width', '200px');

	seedLabel = createDiv('seed [1, 20]');
	seedLabel.position(0, 3*divHeight);
	seedLabel.size(divLen, divHeight)

	seedSlider = createSlider(1, 20, 1);
	seedSlider.position(divLen, 3*divHeight);
	seedSlider.style('width', '200px');

	generateButton = createButton('Generate')
	generateButton.mousePressed(Generate);
	generateButton.position(0, 4*divHeight)

	displayGraphCheckbox = createCheckbox('Display graph', false);
	displayGraphCheckbox.position(0, 5*divHeight)

	toolLabel = createDiv('Tool: Wall Brush')
	toolLabel.position(0, 6*divHeight);
	toolLabel.size(2*divLen, divHeight)
	toolLabel.style('text-align', 'left')

	graphVisualizer = new GraphVisualizer();
	graphVisualizer.center = createVector(0, -2.5);
	graphVisualizer.gridLen = 4;
	graphVisualizer.tLength = 0.0001;
	graphVisualizer.colors = ['red', 'blue', 'green', 'purple']
	graphVisualizer.cRep = 0.05
	graphVisualizer.size = 1

	Generate();

	graphVisualizer.graph = mazeGenerator.Automaton
	graphVisualizer.gridLen = sqrt(mazeGenerator.Automaton.length)
	graphVisualizer.setup();
}

function draw() {
	background(255)
	World.draw();
	mazeGenerator.draw();

	if(displayGraphCheckbox.checked()){
		graphVisualizer.drawGraph();
	}

	textAlign(CENTER, CENTER);
	let size = World.w2s(0.1);
	let p = World.w2s(createVector(0, mazeGenerator.size / 2+0.1));
	textSize(size)
	text(syncWord, p.x, p.y)
}

function Generate(){
	mazeGenerator.seed = seedSlider.value();
	mazeGenerator.m = mSlider.value();
	mazeGenerator.n = mSlider.value();
	mazeGenerator.ph = phSlider.value()/100;
	mazeGenerator.pc = pcSlider.value()/100;

	mazeGenerator.generateMaze();
	mazeGenerator.buildAutomata();

	graphVisualizer.graph = mazeGenerator.Automaton
	graphVisualizer.gridLen = sqrt(mazeGenerator.Automaton.length)
	graphVisualizer.setup();

	syncWord = 'Loading...'
	worker.postMessage(mazeGenerator.Automaton);
}

function mouseClicked(){
	let wMouse = World.s2w(World.mouseVec);
	if(mouseButton == LEFT && mazeGenerator.brush(wMouse, tool)){
		syncWord = 'Loading...'
		worker.postMessage(mazeGenerator.Automaton);

		graphVisualizer.graph = mazeGenerator.Automaton
		graphVisualizer.gridLen = sqrt(mazeGenerator.Automaton.length)
		graphVisualizer.setup();
	}
}

function keyPressed(){
	tool = !tool;
	if(tool){
		toolLabel.html('Tool: Wall Eareser');
	}
	else{
		toolLabel.html('Tool: Wall Brush');
	}
}