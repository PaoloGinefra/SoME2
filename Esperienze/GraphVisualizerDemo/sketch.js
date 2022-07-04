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
	World.setup(windowWidth, windowHeight);

	gv = new GraphVisualizer(Automaton);
    gv.cRep = 0.03
    gv.size = 2
	gv.setup()
}

function draw() {
	background(255);
	World.draw();
	gv.drawGraph();
}
