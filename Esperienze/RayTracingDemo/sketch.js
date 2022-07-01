let rayCaster, env, im;
let button;
let matrix = [];
let lights = false;

function setup() {
	World.setup(windowWidth, windowHeight);

	let MatrixSize = 10

	for(let i = 0; i < MatrixSize; i++){
		matrix[i] = [];
		for(let j = 0; j < MatrixSize; j++){
			matrix[i][j] = round(Math.random());
		}
	}

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

	env.wallColor = lights ? 'white' : 'black';

	env.updateBound();
	env.draw();
	let p = World.s2w(World.mouseVec);
	rayCaster.updateOrigin(p);
	rayCaster.cast(env.getWalls());
	rayCaster.draw();


}
