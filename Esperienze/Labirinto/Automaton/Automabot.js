/*========================================================================
    An Automabot is a cute little bot who can follow some instructions
    given as a word. It needs to know the Automaton topology as well as
    the worldPosition of every node.

    First of all your automabot needs to compute the animation in the setup
    with [computeAnimation] then [animationStep] needs to be called every
    frame in order to make the animation progress
  ========================================================================*/
  
class Automabot{
    //Linear interpolation function
    static Linear(t){
        return t;
    }

    //sin interpolation function
    static Sin(t){
        return sin(t * PI / 2);
    }

    constructor(Automaton, Nodes, speed = 1, size = 0.1, Interpolation = Automabot.Linear, stopThresh = 0.01){
        this.Automaton = Automaton;
        this.Nodes = Nodes;
        this.speed = speed; //the movement speed of the bot in wu/s
        this.Interpolation = Interpolation;
        this.stopThresh = stopThresh; // the distance bewlow which two points are considered equal
        this.size = size; //the size of the bot
        this.t = 0; // time
    }

    //Computes a Queue containing keyframes of the bot's position
    computeAnimation(state, word){
        this.t = 0
        this.posQueue = [{pos: Nodes[state]}]

        //Computes the positions executing the given word
        for(let i = 0; i < word.length; i++){
            let newState = this.Automaton[state][word[i]];

            //When the bot is in the same state the stall animation is added
            if(state == newState)
                this.stallAnimation(this.Nodes[state], this.posQueue);
            else
                this.posQueue.push({pos: this.Nodes[newState]});

            state = newState
        }

        //computes the time needed to transition between keyframes assuming a constant speed
        for(let i = 1; i < this.posQueue.length; i++){
            this.posQueue[i].deltaTime = p5.Vector.dist(this.posQueue[i-1].pos, this.posQueue[i].pos) / this.speed;
        }

        this.posIndex = 1
        this.position = this.posQueue[0].pos;
    }
    
    stallAnimation(position, queue){
        queue.push({pos : p5.Vector.add(position, createVector(0, 0.1))});
        queue.push({pos : p5.Vector.add(position, createVector(0, -0.1))});
        queue.push({pos : p5.Vector.add(position, createVector(0, 0))});
    }

    //Computes a step of the animation, it needs to be called once per frame
    animationStep(){
        if(this.posIndex < this.posQueue.length){
            let target = this.posQueue[this.posIndex];
            this.position = p5.Vector.lerp(this.position,
                                        target.pos,
                                        this.Interpolation(this.t / target.deltaTime));

            if(p5.Vector.dist(this.position, target.pos) <= this.stopThresh){
                this.t = 0;
                this.posIndex ++;
            }
        }

        this.t += deltaTime / 1000
    }
    
    drawSprite(position, size){
        let wPos = World.w2s(position)
        ellipse(wPos.x, wPos.y, size * World.w2s())
    }

    //this function MUST be called once per frame
    draw(){
        this.animationStep();
        this.drawSprite(this.position, this.size);
    }
}