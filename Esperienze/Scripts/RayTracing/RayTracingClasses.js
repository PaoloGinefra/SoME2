class Wall{
    /**
     * The single wall class. Every wall is just a line.
     * It only has a draw mathod
     * @param {*} p1 First point of the wall
     * @param {*} p2 Second point of the wall
     * @param {*} color The color of the wall
     * @param {*} myStrokeWeight The weight in wu
     */
    constructor(p1, p2, color = 'white', myStrokeWeight = 0.01){
        this.p1 = p1;
        this.p2 = p2;
        this.color = color;
        this.strokeWeight = myStrokeWeight;
    }

    draw(){
        let wP1 = World.w2s(this.p1);
        let wP2 = World.w2s(this.p2);

        stroke(this.color);
        strokeWeight(World.w2s(this.strokeWeight));
        line(wP1.x, wP1.y, wP2.x, wP2.y);

        fill(this.color);
        let center = p5.Vector.lerp(wP1, wP2, 0.5);
        rectMode(CENTER);
        //square(wP1.x, wP1.y, World.w2s(0.03));
        //square(wP2.x, wP2.y, World.w2s(0.03));
        ellipse(center.x, center.y, World.w2s(0.02));
    }
}


class Ray{
    /**
     * The single ray class.
     * @param {} origin The origin
     * @param {float} angle 
     */
    constructor(origin, angle){
        this.origin = origin;
        this.updateAngle(angle);
    }

    /**
     * @param {float} a M[0][0]
     * @param {float} b M[0][1]
     * @param {float} c M[1][0]
     * @param {float} d M[1][1]
     * @returns the determinant of a 2x2 matrix M as a float
     */
    det(a, b, c, d){
        return a*d-b*c;
    }

    /**
     * Casts the ray to the wall.
     * For more info on the collision algorithm check https://en.wikipedia.org/wiki/Line%E2%80%93line_intersection#:~:text=non%2Doverlapping%20intervals).-,Given%20two%20points%20on%20each%20line%20segment,-%5Bedit%5D
     * @param {*} wall The wall instance
     * @returns The collision point between the ray and the wall. none if the ray doesn't collide
     */
    cast(wall){
        this.target = p5.Vector.add(this.origin, this.dir);

        const p1 = wall.p1;
        const p2 = wall.p2;
        const p3 = this.origin;
        const p4 = this.target;
        
        const den = this.det(p1.x-p2.x, p3.x-p4.x, p1.y-p2.y, p3.y-p4.y);
        if(den == 0)
            return;

        const t = this.det(p1.x-p3.x, p3.x-p4.x, p1.y-p3.y, p3.y-p4.y) / den;
        const u = this.det(p1.x-p3.x, p1.x-p2.x, p1.y-p3.y, p1.y-p2.y) / den;

        //if t or u >= 0 it means that a collision occured to the right of the first anchor point
        //if t or u <= 0 it means that a collision occured to the left of the second anchor point
        if(0 <= t && t <= 1 && u >= 0){
            return p5.Vector.add(p1, p5.Vector.sub(p2, p1).mult(t));
        }
        return null;
    }

    //Comoputes the closest collision point to teh origin givven th wall Hash
    castWalls(wallHash, hashRes){
        let minDist = Infinity;
        let ClosestCP = null;

        this.angle = (this.angle + 360) % 360;

        let cell = wallHash[floor(this.angle / hashRes)]

        cell.forEach(wall => {
            let collisionPoint = this.cast(wall);
            if(collisionPoint != null){
                let dist = p5.Vector.dist(this.origin, collisionPoint);
                if(dist < minDist){
                    minDist = dist;
                    ClosestCP = collisionPoint;
                }
            }
        });
        return ClosestCP;
    }

    /**
     * Update the ray angle and compute the new dir vector
     * @param {float} angle 
     */
    updateAngle(angle){
        this.angle = angle;
        this.dir = p5.Vector.fromAngle(radians(this.angle));
    }
}

class RayCaster{
    /**
     * The main RayCaster class. A RayCaster rappresents the "light source", it's the source of all the need rays.
     * The main two methods are cast and draw.
     * @param {*} origin The position of the  RayCaster
     * @param {*} Env The Enviroment the RayCaster is in
     * @param {*} alphaEsilon The angle between the helper ray and the main ray in deg
     * @param {*} hashRes The resolution of the radial hash in deg
     * @param {*} viewRadius The radius of the light gradient
     * @param {*} bodyColor The color of the RayCaster
     * @param {*} lightColor The color of the light gradient
     * @param {*} shadowColor The color of the shadow
     * @param {*} alpha The transparency of the  shadow [0, 255]
     */
    constructor(origin, Env, alphaEsilon = 0.00001, hashRes = 1, viewRadius = 2, bodyColor = color(255), lightColor = color(255, 200), shadowColor = color(0)){
        this.origin = origin;
        this.alphaEsilon = alphaEsilon;
        this.Env = Env;
        this.viewRadius = viewRadius;
        this.lightColor = lightColor;
        this.bodyColor = bodyColor;
        this.shadowColor = shadowColor;
        this.hashRes = hashRes;
        this.hashLen = floor(360 / hashRes); 

        this.rays = [];

        for(let i = 0; i < Env.getWalls().length * 4; i++){
            //[Ray, angle]
            this.rays.push([new Ray(this.origin, i), 0]);
        }
    }

    updateOrigin(pos){
        this.origin.set(pos);
    }

    /**
     * Builds the radial hash for the walls
     */
    buildWallHash(){
        let walls = this.Env.getWalls();

        this.wallHash = []
        for(let i = 0; i < this.hashLen; i++){
            this.wallHash.push([]);
        }

        walls.forEach((wall, i) => {
            let dir1 = p5.Vector.sub(walls[i].p1, this.origin).normalize();
            let alpha1 = (degrees(dir1.heading()) + 360) % 360;

            let dir2 = p5.Vector.sub(walls[i].p2, this.origin).normalize();
            let alpha2 = (degrees(dir2.heading()) + 360) % 360;
            
            let start = floor(alpha1 / this.hashRes);
            let finish = floor(alpha2 / this.hashRes);

            let diff = alpha2 - alpha1;

            if(diff > 180 || diff > -180 && diff < 0){
                [start, finish] = [finish, start];
            }

            for(let j = start; j != (finish + 1) % this.hashLen; j = (j+1) % this.hashLen){
                this.wallHash[j].push(wall);
            }
        })

    }

    /**
     * This functions updets this.rays and this.collisions. The rays are redirected to the wall's extremities
     * and the collision points are computed just for then selecting the closest one tho the origin per ray.
     */
    cast(){
        let walls = this.Env.getWalls();

        this.buildWallHash()

        //Updates The Rays Directions
        for(let i = 0; i < walls.length; i++){
            let dir1 = p5.Vector.sub(walls[i].p1, this.origin).normalize();
            let alpha1 = degrees(dir1.heading());

            let dir2 = p5.Vector.sub(walls[i].p2, this.origin).normalize();
            let alpha2 = degrees(dir2.heading());

            this.rays[4*i + 0][0].updateAngle(alpha1 - this.alphaEsilon);
            this.rays[4*i + 0][1] = alpha1 - this.alphaEsilon;

            this.rays[4*i + 1][0].updateAngle(alpha1 + this.alphaEsilon);
            this.rays[4*i + 1][1] = alpha1 + this.alphaEsilon;

            this.rays[4*i + 2][0].updateAngle(alpha2 - this.alphaEsilon);
            this.rays[4*i + 2][1] = alpha2 - this.alphaEsilon;

            this.rays[4*i + 3][0].updateAngle(alpha2 + this.alphaEsilon);
            this.rays[4*i + 3][1] = alpha2 + this.alphaEsilon;

        }

        //Sorts the ray per angle
        this.rays.sort((a, b) => a[1] - b[1]);

        //Computes the closest sollision points
        this.collisions = [];

        this.rays.forEach(ray=>{
            this.collisions.push(ray[0].castWalls(this.wallHash, this.hashRes));
        })
    }

    /**
     * Draws the RayCaster shadow
     */
    draw(){
        strokeWeight(0);
        let o = World.w2s(this.origin);
        let rad = World.w2s(this.viewRadius);
        //Draws the light circle with radial gradient
        var gradient = drawingContext.createRadialGradient(o.x, o.y, 0, o.x, o.y, rad);
        gradient.addColorStop(0, this.lightColor);
        gradient.addColorStop(1, color(0));
        drawingContext.fillStyle = gradient;

        blendMode(MULTIPLY);
        ellipse(o.x, o.y, rad * 2);
        blendMode(BLEND)

        //Draws the body
        fill(this.bodyColor);
        ellipse(o.x, o.y, World.w2s(0.06));

        //Draws the shadow mask
        fill(this.shadowColor);

        beginShape();
        vertex(0, 0);
        vertex(0, World.height);
        vertex(World.width, World.height);
        vertex(World.width, 0);

        beginContour();
        for(let alpha = 0; alpha >= -360; alpha -= 5){
            let offset = p5.Vector.fromAngle(radians(alpha), this.viewRadius);
            let p = World.w2s(p5.Vector.add(this.origin, offset));
            vertex(p.x, p.y);
        }
        endContour();
        endShape(CLOSE);


        beginShape();
        vertex(0, 0);
        vertex(0, World.height);
        vertex(World.width, World.height);
        vertex(World.width, 0);
        
        beginContour();
        for(let i = this.rays.length - 1; i >= 0; i--){
            if(this.collisions[i] != null){

                let c1 = World.w2s(this.collisions[i])
                vertex(c1.x, c1.y);
            }
        }
        endContour();
        endShape(CLOSE);


    }
}

class Env{
    /**
     * The Enviroment of the sim. It contains the bouderies as of walls at the edge of the canvas and all the walls in the scene
     */
    constructor(wallColor = 'white'){
        this.walls = [];
        this.setupBound();
        this.updateBound();
        this.wallColor = wallColor;
    }

    /**
     * Creates the instances of the boudery walls
     */
    setupBound(){
        this.Bounds = [
            new Wall(createVector(0, 0), createVector(0, 0)),
            new Wall(createVector(0, 0), createVector(0, 0)),
            new Wall(createVector(0, 0), createVector(0, 0)),
            new Wall(createVector(0, 0), createVector(0, 0)),
        ];
    }

    /**
     * Updates the bouderies accounting for the World changes
     */
    updateBound(){
        let widthW = World.s2w((World.width / 2 + 100));
        let heightW = World.s2w((World.height / 2 + 100));
        let dir = createVector(widthW, heightW);
        let UR = p5.Vector.add(World.cameraPos, dir);
        let LL = p5.Vector.sub(World.cameraPos, dir);

        this.Bounds[0].p1.set(createVector(LL.x, UR.y));
        this.Bounds[0].p2.set(UR);

        this.Bounds[1].p1.set(UR);
        this.Bounds[1].p2.set(createVector(UR.x, LL.y));

        this.Bounds[2].p1.set(createVector(UR.x, LL.y));
        this.Bounds[2].p2.set(LL);

        this.Bounds[3].p1.set(LL);
        this.Bounds[3].p2.set(createVector(LL.x, UR.y));
    }

    /**
     * @returns All the walls in the Env
     */
    getWalls(){
        return this.walls;
    }

    /**
     * Draws the env
     */
    draw(){
        this.Bounds.forEach(wall => {wall.color = this.wallColor; wall.draw();})
        this.walls.forEach(wall => {wall.color = this.wallColor; wall.draw();})
    }
}