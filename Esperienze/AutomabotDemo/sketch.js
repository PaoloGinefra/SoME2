const Automaton = [
	[6, 6],
	[3, 4],
	[3, 5],
	[5, 8],
	[4, 8],
	[4, 9],
	[3, 9],
	[5, 0],
	[5, 1],
	[4, 1],
	[3, 1],
	[6, 5]
]

let gv;
let automabot;

let startingStateInput, wordInput, labelStart, labelWord, button;

let go = false;

function setup() {
	World.width = windowWidth;
	World.height = windowHeight;
	World.setup();

	gv = new GraphVisualizer(Automaton);
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

	wordInput = createInput('0101');
	wordInput.position(40, 50);

	button = createButton('Go')
	button.position(0, 90)
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
		automabot.computeAnimation(Number(startingStateInput.value()), wordInput.value());
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
