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
let automabot;

let startingStateInput, wordInput, labelStart, labelWord, button, followModeCheck;

let go = false;

function setup() {
	World.setup(windowWidth, windowHeight);

	gv = new GraphVisualizer(Automaton);
	gv.size = 2
	gv.gridLen = 4
	gv.setup();

	automabot = new Automabot(Automaton, gv.Nodes)


	labelStart = createDiv('Starting State: ');
	labelStart.position(0, 10);

	startingStateInput = createSelect();

	for(let i = 0; i < Automaton.length; i++){
		startingStateInput.option(i.toString());
	}

	startingStateInput.changed(handleSelect)
	startingStateInput.position(100, labelStart.height / 2);

	labelWord = createDiv('Word: ');
	labelWord.position(0, 50);

	wordInput = createInput('01010');
	wordInput.position(40, 50);

	followModeCheck = createCheckbox("Follow mode", false)
	followModeCheck.position(0, 90)

	button = createButton('Go')
	button.position(0, 130)
	button.mousePressed(handleButton)

	automabot.computeAnimation(Number(startingStateInput.value()), wordInput.value());
}

function draw() {
	background(255)
	World.draw()
	gv.drawGraph()

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
		automabot.computeAnimation(Number(startingStateInput.value()), wordInput.value(), followModeCheck.checked());
		go = true;
	}
	else{
		button.html('Go')
		go = false;
	}
}

function handleSelect(){
	go = false;
	automabot.computeAnimation(Number(startingStateInput.value()), wordInput.value());
}
