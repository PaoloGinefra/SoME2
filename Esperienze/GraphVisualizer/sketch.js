const Automaton = [
    [6, 6],
    [3, 4],
    [3, 5],
    [3, 6],
    [7, 11],
    [6, 11],
    [3, 9],
    [5, 0],
    [4, 0],
    [4, 1],
    [5, 3],
    [6, 5]
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
}
