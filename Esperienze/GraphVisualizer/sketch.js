const Automaton = [
    [7, 11],
    [5, 3],
    [1, 3],
    [6, 0],
    [5, 1],
    [7, 6],
    [0, 7],
    [8, 11],
    [9, 5],
    [5, 4],
    [9, 8],
    [10, 8],
]

function setup() {
	World.width = windowWidth;
	World.height = windowHeight;
	World.setup();

	gv = new GraphVisualizer(Automaton)
	gv.buildNodes();
	gv.orderGraph();

}

function draw() {
	background(255);
	World.draw();
	gv.drawNodes();
	//frameRate(1);
}
