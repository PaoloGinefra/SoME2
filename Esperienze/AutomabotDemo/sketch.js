const Automaton = [
	[6, 6],
	[10, 4],
	[3, 6],
	[5, 8],
	[4, 8],
	[4, 9],
	[3, 9],
	[5, 0],
	[5, 1],
	[4, 11],
	[10, 1],
	[6, 5]
]

let gv;
let automabot, mazeGenerator;

let startingStateInput, wordInput, labelStart, labelWord, button, followModeCheck, scenarioSelect;

let go = false;

function setup() {
	World.setup(windowWidth, windowHeight);

	mazeGenerator = new NonPerfectMazeGenerator();
	mazeGenerator.size = 2;
	mazeGenerator.seed = 1;
	mazeGenerator.m = 10;
	mazeGenerator.n = mazeGenerator.m;
	mazeGenerator.ph = 0.5;
	mazeGenerator.pc = 0.1;
	mazeGenerator.generateMaze();
	mazeGenerator.buildAutomata();

	gv = new GraphVisualizer(Automaton);
	gv.size = 2
	gv.gridLen = 4
	gv.setup();

	automabot = new Automabot(Automaton, gv.Nodes);

	labelStart = createDiv('Starting State: ');
	labelStart.position(0, 25);

	scenarioSelect = createSelect();
	scenarioSelect.option("Graph");
	scenarioSelect.option("Maze");
	scenarioSelect.position(0, 0);
	scenarioSelect.changed(handleScenario)

	startingStateInput = createSelect();

	let len = max(Automaton.length, mazeGenerator.Automaton.length)
	for(let i = 0; i < len; i++){
		startingStateInput.option(i.toString());
	}

	startingStateInput.changed(handleSelect)
	startingStateInput.position(100, labelStart.height*1.5);

	labelWord = createDiv('Word: ');
	labelWord.position(0, 60);

	wordInput = createInput('01010');
	wordInput.position(40, 60);

	followModeCheck = createCheckbox("Follow mode", false)
	followModeCheck.position(0, 100)

	button = createButton('Go')
	button.position(0, 140)
	button.mousePressed(handleButton)

	automabot.computeAnimation(Number(startingStateInput.value()), wordInput.value());
}

function draw() {
	background(255)
	World.draw()
	if(scenarioSelect.value() == 'Maze'){
		mazeGenerator.draw();
	}
	else{
		gv.drawGraph()
	}
	automabot.drawSprite()
	if(go)
		automabot.animationStep()

	if(automabot.finished){
		go = false;
		button.html('Go');
	}
}

function handleButton(){
	if(!go){
		button.html('Stop')
		let word = wordInput.value();
		let state = Number(startingStateInput.value());

		if(scenarioSelect.value() == 'Maze'){
			state = mazeGenerator.state2mapState[state];
		}

		automabot.computeAnimation(state, word, followModeCheck.checked());
		go = true;
	}
	else{
		button.html('Go')
		go = false;
	}
}

function handleSelect(){
	let state = Number(startingStateInput.value());

	if(scenarioSelect.value() == 'Maze'){
		state = mazeGenerator.state2mapState[state];
	}
	go = false;
	automabot.computeAnimation(state, wordInput.value());
}

function handleScenario(){
	let state = Number(startingStateInput.value());

	if(scenarioSelect.value() == 'Graph'){
		automabot.Automaton = Automaton;
		automabot.Nodes = gv.Nodes;
	}
	else{
		automabot.Automaton = mazeGenerator.MapAutomaton;
		automabot.Nodes = mazeGenerator.mapNodes;
		state = mazeGenerator.state2mapState[state];
	}

	automabot.computeAnimation(state, wordInput.value().charAt(0), followModeCheck.checked());
}
