let imageWaller, mazeGenerator;

function setup() {
	World.setup(windowWidth, windowHeight);
	imageWaller = new ImageWaller(2);
	mazeGenerator = new NonPerfectMazeGenerator(50, 50);
	mazeGenerator.generateMaze();
	mazeGenerator.updateImage();
}

function draw() {
	background(255)
	World.draw();
	imageWaller.drawMatrix(mazeGenerator.image)
}
