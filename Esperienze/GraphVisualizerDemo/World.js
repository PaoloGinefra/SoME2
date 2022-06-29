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
    static zoomDamp = 7; //How snappy are the controlls, the higher the snappier
    static zoomMouseSpeed = 0.001; //How responisve to mouse wheel is the zoom, the higher the faster
    //=========================================

    //A vector containing the mouse position in px
    static mouseVec;

    //This function MUST be called in the sketch setup
    static setup(){
        createCanvas(World.width, World.height);
        World.oW = createVector(0, 0);
        World.cameraPos = createVector(0, 0);
        World.sCenter = createVector(width/2, height/2)
    }

    //This function MUST be called in the sketch setup
    static draw(){
        World.mouseVec = createVector(mouseX, mouseY);

        //Smoothing zoom transition
        World.zoom = lerp(World.zoom, World.targetZoom, deltaTime * World.zoomDamp / 1000)
        World.xViewSpanW = World.zoom * World.zoom
    }

    //Scalar World 2 Screen convertion
    static w2s(worldP = undefined){
        if(worldP !== undefined){
            var screenP = worldP.copy().sub(World.cameraPos).mult(World.w2s()).add(World.sCenter);
            screenP.y *= -1; screenP.y += height;
            return screenP;
        }
        return World.width / World.xViewSpanW
    }

    //Scalar Screen 2 World convertion
    static s2w(screenP = undefined){
        if(screenP !== undefined){
            screenP.y -= height; screenP.y *= -1;
            var worldP = screenP.copy().sub(World.sCenter).mult(World.s2w()).add(World.cameraPos);
            return worldP;
        }
        return 1 / World.w2s();
    }
}


//Function triggered on mouse wheel change
function mouseWheel(event) {
    World.targetZoom += event.delta * World.zoomMouseSpeed;
    World.targetZoom = abs(World.targetZoom)

    //comment to eneable page scrolling
    return false;
  }