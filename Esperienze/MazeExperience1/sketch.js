let mazeGenerator, imageWaller, env, rayCaster, automabot;
let state;
const size = 5;

function setup() {
	World.setup(windowWidth, windowHeight);

	//Maze generation
	mazeGenerator = new NonPerfectMazeGenerator(10, 10, 0, 0.7, 0.1);
	mazeGenerator.size = size;
	mazeGenerator.generateMaze();
	mazeGenerator.buildAutomata();
	if(mazeGenerator.seed == 0)
		console.log(mazeGenerator.rng.state);

	//Image walling
	imageWaller = new ImageWaller(size);
	imageWaller.createWalls(mazeGenerator.getImage());

	//Enviroment building
	env = new Env();
	env.walls = imageWaller.walls;

	//Raycaster setup
	rayCaster = new RayCaster(createVector(0, 1), env);
	rayCaster.viewRadius = 1;
	rayCaster.lightColor = color(255, 157, 69, 200);
	rayCaster.bodyColor = color(0, 0);

	//Automabot
	automabot = new Automabot(mazeGenerator.MapAutomaton, mazeGenerator.mapNodes);
	automabot.size = 2 * mazeGenerator.cellSize;
	automabot.speed = 1;
	automabot.Interpolation = Automabot.Sin
	state = mazeGenerator.state2mapState[floor(Math.random() * mazeGenerator.Automaton.length)];
	automabot.computeAnimation(state, "", true);

	//console.log(ShortestWord(mazeGenerator.Automaton))
}

function draw() {
	background(0);
	World.cameraPos = automabot.position;
	World.draw();

	mazeGenerator.draw();

	automabot.drawSprite();

	rayCaster.updateOrigin(automabot.position);
	rayCaster.cast(env.getWalls());
	rayCaster.draw();

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