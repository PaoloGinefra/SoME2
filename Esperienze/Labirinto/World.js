class World{
    //wu = World Unit, px = pixel aka Screen unit

    static oW; //origin in wu
    static sCenter; //the screen center in px
    static cameraPos; //the position of the camera in wu

    //How many world units are visible on the xAxis
    static xViewSpanW = 2;

    //A vector containing the mouse position in px
    static mouseVec;

    //This function MUST be called in the sketch setup
    static setup(){
        World.oW = createVector(0, 0);
        World.cameraPos = createVector(0, 0);
        World.sCenter = createVector(width/2, height/2)
    }

    //This function MUST be called in the sketch setup
    static draw(){
        World.mouseVec = createVector(mouseX, mouseY);
    }

    //Scalar World 2 Screen convertion coefficient
    static w2s(){
        return width / World.xViewSpanW
    }

    static w2sVec(worldP){
        var screenP = worldP.sub(World.cameraPos).mult(World.w2s()).add(World.sCenter);
        screenP.y *= -1; screenP.y += height;
        return screenP;
    }

    //Scalar Screen 2 World convertion coefficient
    static s2w(){
        return 1 / World.w2s();
    }

    static s2wVec(screenP){
        screenP.y -= height; screenP.y *= -1;
        var worldP = screenP.sub(World.sCenter).mult(World.s2w()).add(World.cameraPos);
        return worldP;
    }

}