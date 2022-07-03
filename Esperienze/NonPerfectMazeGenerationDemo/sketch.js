let imageWaller, mazeGenerator, graphVisualizer;

let phSlider, pcSlider, mSlider, seedSlider;
let phLabel, pcLabel, mLabel, seedLabel;
let displayGraphCheckbox;

let divLen = 80;
let divHeight = 30;

function setup() {
	World.setup(windowWidth, windowHeight);
	mazeGenerator = new NonPerfectMazeGenerator(10, 10, 2);
	mazeGenerator.generateMaze();

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

	mLabel = createDiv('size [1, 50]');
	mLabel.position(0, 2*divHeight);
	mLabel.size(divLen, divHeight)

	mSlider = createSlider(1, 50, 5);
	mSlider.position(divLen, 2*divHeight);
	mSlider.style('width', '200px');

	seedLabel = createDiv('seed [1, 20]');
	seedLabel.position(0, 3*divHeight);
	seedLabel.size(divLen, divHeight)

	seedSlider = createSlider(1, 20, 1);
	seedSlider.position(divLen, 3*divHeight);
	seedSlider.style('width', '200px');

	displayGraphCheckbox = createCheckbox('Display graph', false);
	displayGraphCheckbox.position(0, 4*divHeight)

	graphVisualizer = new GraphVisualizer();
	graphVisualizer.center = createVector(0, -2.5);
	graphVisualizer.gridLen = 4;
	graphVisualizer.tLength = 0.0001;
	graphVisualizer.colors = ['red', 'blue', 'green', 'purple']
	graphVisualizer.cRep = 0.05
	graphVisualizer.size = 1

}

function draw() {
	background(255)
	World.draw();
	mazeGenerator.seed = seedSlider.value();
	mazeGenerator.m = mSlider.value();
	mazeGenerator.n = mSlider.value();
	mazeGenerator.ph = phSlider.value()/100;
	mazeGenerator.pc = pcSlider.value()/100;
	mazeGenerator.generateMaze();
	mazeGenerator.buildAutomata();
	mazeGenerator.draw(2);

	if(displayGraphCheckbox.checked()){
		graphVisualizer.graph = mazeGenerator.Automaton
		graphVisualizer.gridLen = sqrt(mazeGenerator.Automaton.length)
		graphVisualizer.setup();
		graphVisualizer.drawGraph();
	}
}
