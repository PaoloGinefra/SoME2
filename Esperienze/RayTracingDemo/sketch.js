let rayCaster, env;

function setup() {
	World.width = windowWidth;
	World.height = windowHeight;
	World.setup();

	env = new Env();
	env.walls.push(new Wall(createVector(-1, 0), createVector(1, 0)));
	env.walls.push(new Wall(createVector(-1, -1), createVector(1, -1)));
	env.walls.push(new Wall(createVector(-1, 1.5), createVector(1, 0.5)));

	rayCaster = new RayCaster(createVector(0, 1), env);
	rayCaster.cast(env);
}

function draw() {
	background(0);
	World.draw();
	env.updateBound();
	env.draw();
	let p = World.s2w(World.mouseVec);
	rayCaster.updateOrigin(p);
	rayCaster.cast(env.getWalls());
	rayCaster.draw();
}
