class Wall{
    constructor(p1, p2, color = 'white', myStrokeWeight = 0.05){
        this.p1 = p1;
        this.p2 = p2;
        this.color = color;
        this.strokeWeight = myStrokeWeight;
    }

    draw(){
        let wP1 = World.w2s(this.p1);
        let wP2 = World.w2s(this.p2);

        stroke(this.color);
        strokeWeight(this.strokeWeight * World.w2s());
        line(wP1.x, wP1.y, wP2.x, wP2.y);
    }
}


class Ray{
    constructor(origin, angle){
        this.origin = origin;
        this.updateAngle(angle);
    }

    det(a, b, c, d){
        return a*d-b*c;
    }

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

        if(0 <= t && t <= 1 && u >= 0){
            return p5.Vector.add(p1, p5.Vector.sub(p2, p1).mult(t));
        }
        return null;
    }

    updateAngle(angle){
        this.angle = angle;
        this.dir = p5.Vector.fromAngle(radians(this.angle));
    }
}

class RayCaster{
    constructor(origin, nRays, alphaEsilon = 0.1){
        this.origin = origin;
        this.nRays = nRays;
        this.alphaEsilon = alphaEsilon;

        this.rays = [];

        let angleOffset = 360.0 / nRays;
        for(let i = 0; i < nRays; i++){
            this.rays.push(new Ray(this.origin, i*angleOffset - alphaEsilon));
            this.rays.push(new Ray(this.origin, i*angleOffset));
            this.rays.push(new Ray(this.origin, i*angleOffset + alphaEsilon));
        }
    }

    updateOrigin(pos){
        this.origin.set(pos);
    }

    cast(walls){
        this.collisions = [];
        this.rays.forEach(ray => {
            let minDist = Infinity;
            let ClosestCP = null;
            walls.forEach(wall => {
                let collisionPoint = ray.cast(wall);
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

    draw(){
        strokeWeight(0);
        fill(255);
        let o = World.w2s(this.origin);
        ellipse(o.x, o.y, 0.06 * World.w2s());

        noStroke();
        fill(255, 120)
        beginShape();
        for(let i = 0; i < this.rays.length; i++){
            let c1 = World.w2s(this.collisions[i]);
            vertex(c1.x, c1.y);
        }
        endShape();
    }
}

class Env{
    constructor(){
        this.walls = [];
        this.setupBound();
        this.updateBound();
    }

    setupBound(){
        this.Bounds = [
            new Wall(createVector(0, 0), createVector(0, 0)),
            new Wall(createVector(0, 0), createVector(0, 0)),
            new Wall(createVector(0, 0), createVector(0, 0)),
            new Wall(createVector(0, 0), createVector(0, 0)),
        ];
    }

    updateBound(){
        let widthW = World.s2w() * (World.width / 2 + 1000);
        let heightW = World.s2w() * (World.height / 2 + 100);
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

    getWalls(){
        return this.Bounds.concat(this.walls);
    }

    draw(){
        this.Bounds.forEach(wall => wall.draw())
        this.walls.forEach(wall => wall.draw())
    }
}