import Sketch from '../components/Sketch'

// The code for this test has been modified from https://p5js.org/examples/motion-morph.html

const Test = () => {
  let circle = []
  let square = []
  let morph = []
  let state = false

  return (
    <Sketch
      setup={(p5, parentRef) => {
        const { Vector } = window.p5

        p5.createCanvas(720, 400).parent(parentRef)

        for (let angle = 0; angle < 360; angle += 9) {
          let v = Vector.fromAngle(p5.radians(angle - 135))
          v.mult(100)
          circle.push(v)
          morph.push(p5.createVector())
        }
        for (let x = -50; x < 50; x += 10) {
          square.push(p5.createVector(x, -50))
        }
        for (let y = -50; y < 50; y += 10) {
          square.push(p5.createVector(50, y))
        }
        for (let x = 50; x > -50; x -= 10) {
          square.push(p5.createVector(x, 50))
        }
        // Left side
        for (let y = 50; y > -50; y -= 10) {
          square.push(p5.createVector(-50, y))
        }
      }}
      draw={(p5) => {
        const { Vector } = window.p5

        p5.background(51)

        // We will keep how far the vertices are from their target
        let totalDistance = 0

        // Look at each vertex
        for (let i = 0; i < circle.length; i++) {
          let v1
          // Are we lerping to the circle or square?
          if (state) {
            v1 = circle[i]
          } else {
            v1 = square[i]
          }
          // Get the vertex we will draw
          let v2 = morph[i]
          // Lerp to the target
          v2.lerp(v1, 0.1)
          // Check how far we are from target
          totalDistance += Vector.dist(v1, v2)
        }

        // If all the vertices are close, switch shape
        if (totalDistance < 0.1) {
          state = !state
        }

        // Draw relative to center
        p5.translate(p5.width / 2, p5.height / 2)
        p5.strokeWeight(4)
        // Draw a polygon that makes up all the vertices
        p5.beginShape()
        p5.noFill()
        p5.stroke(255)

        morph.forEach((v) => {
          p5.vertex(v.x, v.y)
        })
        p5.endShape(p5.CLOSE)
      }}
    />
  )
}

export default Test
