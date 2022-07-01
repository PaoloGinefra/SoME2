class World{
    //wu = World Unit, px = pixel aka Screen unit

    static width;
    static height;

    static oW; //origin in wu
    static sCenter; //the screen center in px
    static cameraPos; //the position of the camera in wu

    //How many world units are visible on the xAxis
    static xViewSpanW = 2;

    //Zoom
    //=========================================
    static zoom = 1; //parameter controlling Camera zoom
    static targetZoom = 2; //target zoom for interpolation
    static targetZoomPrev = 2; //target zoom for interpolation
    static zoomMouseSpeed = 0.001; //How responisve to mouse wheel is the zoom, the higher the faster
    //=========================================

    //A vector containing the mouse position in px
    static mouseVec;

    //World2Screen Scalar coefficient
    static w2sk;
    //Screen2World Scalar coefficient
    static s2wk;

    static interpolator;

    //This function MUST be called in the sketch setup
    static setup(width, height){
        createCanvas(width, height);
        World.width = width;
        World.height = height;
        World.oW = createVector(0, 0);
        World.cameraPos = createVector(0, 0);
        World.sCenter = createVector(width/2, height/2);

        World.interpolator = new Interpolator(1, 1, 1, World.targetZoom, 0);
    }

    //This function MUST be called in the sketch setup
    static draw(){
        World.mouseVec = createVector(mouseX, mouseY);

        //Smoothing zoom transition
        //World.zoom = lerp(World.zoom, World.targetZoom, deltaTime * World.zoomDamp / 1000)
        World.zoom = World.interpolator.step(World.targetZoom, World.targetZoomPrev, deltaTime == 0 ? 0.00001 : deltaTime / 1000);
        World.xViewSpanW = World.zoom * World.zoom;
        World.w2sk = World.width / World.xViewSpanW;
        World.s2wk = 1 / World.w2sk;

        World.targetZoomPrev = World.targetZoom;

    }

    //Scalar World 2 Screen convertion
    static w2s(worldP = undefined){
        if(typeof worldP == "number")
            return worldP * World.w2sk;

        else if(typeof worldP == "object"){
            let screenP = worldP.copy().sub(World.cameraPos).mult(World.w2sk).add(World.sCenter);
            screenP.y *= -1; screenP.y += World.height;
            return screenP;
        }

        else if(worldP == undefined)
            throw "World.w2s needs a parameter";
        
    }

    //Scalar Screen 2 World convertion
    static s2w(screenP = undefined){
        if(typeof screenP == "number")
            return screenP * World.s2wk;

        else if(typeof screenP == "object"){
            screenP.y -= World.height; screenP.y *= -1;
            let worldP = screenP.copy().sub(World.sCenter).mult(World.s2wk).add(World.cameraPos);
            return worldP;
        }

        else if(screenP == undefined)
            throw "World.w2s needs a parameter";
    }
}


//Function triggered on mouse wheel change
function mouseWheel(event) {
    World.targetZoom += event.delta * World.zoomMouseSpeed;
    World.targetZoom = abs(World.targetZoom)

    //comment to eneable page scrolling
    return false;
}

class Interpolator{
    /**
     * This Interpolator class uses a Second Order System to generate an interpolated function y(t)
     * of the signal x(t). It solves for y + k1 y' + k2 y'' = x + k3 x'
     * @param {*} f The frequency of the system in Hz, it's the speed at which the system will respond to changes in the input
     * @param {*} z The damping coefficient of the system. How the system tends to settle at the target, 0 -> system undamped, (0, 1) -> system underdamped, [1, inf) -> no vibrations
     * @param {*} r The initial response of the system. 0 -> it takes time to begin accelerating from rest, r > 0 -> immediate reaction, r > 1 -> the system overshoots the target, r < 0 -> System anticipates the motion
     * @param {*} y0 y(0)
     * @param {*} yDer0 y'(0)
     */
    constructor(f, z, r, y0, yDer0){
        this.updateParameters(f, z, r);
        this.y = y0;
        this.yDer = yDer0;
    }

    updateParameters(f, z, r){
        this.f = f;
        this.r = r;
        this.z = z;

        this.k1 = z / (PI*f);
        this.k2 = 1 / sq(2*PI*f);
        this.k3 = r*z / (2*PI*f);
    }

    /**
     * Computes a step of the interpolation
     * @param {*} x x(t)
     * @param {*} xPrev x(t - dt)
     * @param {*} dt deltaTime [s]
     * @returns y(t + dt)
     */
    step(x, xPrev, dt){
        let xDer = (x - xPrev) / dt;
        this.y += dt*this.yDer;
        this.yDer += dt*(x + this.k3*xDer - this.y - this.k1*this.yDer)/this.k2;
        return this.y;
    }
}