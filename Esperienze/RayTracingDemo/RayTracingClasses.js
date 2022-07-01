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
     * The main two methods are cast and draw
     * @param {*} origin The position of the  RayCaster
     * @param {*} Env The Enviroment the RayCaster is in
     * @param {*} alphaEsilon The angle between the helper ray and the main ray in deg
     * @param {*} bodyColor The color of the RayCaster
     * @param {*} shadowColor The color of the shadow
     * @param {*} alpha The transparency of the  shadow [0, 255]
     */
    constructor(origin, Env, alphaEsilon = 0.00001, bodyColor = color(255), shadowColor = color(255), alpha = 120){
        this.origin = origin;
        this.alphaEsilon = alphaEsilon;
        this.Env = Env;
        this.bodyColor = bodyColor;
        this.shadowColor = shadowColor;
        this.alpha = alpha;

        this.rays = [];

        for(let i = 0; i < Env.getWalls().length * 6; i++){
            //[Ray, angle]
            this.rays.push([new Ray(this.origin, i), 0]);
        }
    }

    updateOrigin(pos){
        this.origin.set(pos);
    }

    /**
     * This functions updets this.rays and this.collisions. The rays are redirected to the wall's extremities
     * and the collision points are computed just for then selecting the closest one tho the origin per ray.
     */
    cast(){
        let walls = this.Env.getWalls();

        //Updates The Rays Directions
        for(let i = 0; i < walls.length; i++){
            let dir1 = p5.Vector.sub(walls[i].p1, this.origin).normalize();
            let alpha1 = degrees(dir1.heading());

            this.rays[6*i + 0][0].updateAngle(alpha1 - this.alphaEsilon);
            this.rays[6*i + 0][1] = alpha1 - this.alphaEsilon;

            this.rays[6*i + 1][0].dir.set(dir1);
            this.rays[6*i + 1][1] = alpha1;

            this.rays[6*i + 2][0].updateAngle(alpha1 + this.alphaEsilon);
            this.rays[6*i + 2][1] = alpha1 + this.alphaEsilon;

            let dir2 = p5.Vector.sub(walls[i].p2, this.origin).normalize();
            let alpha2 = degrees(dir2.heading());

            this.rays[6*i + 3][0].updateAngle(alpha2 - this.alphaEsilon);
            this.rays[6*i + 3][1] = alpha2 - this.alphaEsilon;

            this.rays[6*i + 4][0].dir.set(dir2);
            this.rays[6*i + 4][1] = alpha2;

            this.rays[6*i + 5][0].updateAngle(alpha2 + this.alphaEsilon);
            this.rays[6*i + 5][1] = alpha2 + this.alphaEsilon;
        }

        //Sorts the ray per angle
        this.rays.sort((a, b) => a[1] - b[1]);

        //Computes the closest sollision points
        this.collisions = [];
        this.rays.forEach(ray => {
            let minDist = Infinity;
            let ClosestCP = null;
            walls.forEach(wall => {
                let collisionPoint = ray[0].cast(wall);
                if(collisionPoint != null){
                    let dist = p5.Vector.dist(this.origin, collisionPoint);
                    if(dist < minDist){
                        minDist = dist;
                        ClosestCP = collisionPoint;
                    }
                }
            });
            this.collisions.push(ClosestCP);
        });
    }

    /**
     * Draws the RayCaster shadow
     */
    draw(){
        strokeWeight(0);
        fill(this.bodyColor);
        let o = World.w2s(this.origin);
        ellipse(o.x, o.y, World.w2s(0.06));

        noStroke();
        this.shadowColor.setAlpha(this.alpha)
        fill(this.shadowColor);
        beginShape();
        for(let i = 0; i < this.rays.length; i++){
            if(this.collisions[i] != null){
                let c1 = World.w2s(this.collisions[i]);
                vertex(c1.x, c1.y);
            }
        }
        endShape();
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
        return this.Bounds.concat(this.walls);
    }

    /**
     * Draws the env
     */
    draw(){
        this.Bounds.forEach(wall => {wall.color = this.wallColor; wall.draw();})
        this.walls.forEach(wall => {wall.color = this.wallColor; wall.draw();})
    }
}