let rayCaster, env, im, mazeGenerator;
let button;
let matrix = [];
let lights = false;

function setup() {
	World.setup(windowWidth, windowHeight);

	let mazeGenerator = new NonPerfectMazeGenerator(10, 10, 0, 0.7);
	mazeGenerator.generateMaze();
	mazeGenerator.updateImage();
	let matrix = mazeGenerator.image

	im = new ImageWaller(size = 5);

	env = new Env();

	im.createWalls(matrix, color(255));
	env.walls = env.walls.concat(im.walls);

	rayCaster = new RayCaster(createVector(0, 1), env);
	rayCaster.cast();

	button = createButton('Toogle Lights');
	button.position(0, 0);
	button.mousePressed(() => lights = !lights)
	
}

function draw() {
	background(0);
	World.draw();

	env.wallColor = lights ? 'white' : color(0, 0);
	rayCaster.shadowColor = lights ? color(0, 120) : color(0)

	env.updateBound();
	im.drawMatrix(matrix);
	env.draw();
	let p = World.s2w(World.mouseVec);
	rayCaster.updateOrigin(p);
	rayCaster.cast(env.getWalls());
	rayCaster.draw();


}
