import { useState } from 'react'
import type p5 from 'p5'
import Sketch from '../components/SketchNext'

// The code for this example has been modified from https://p5js.org/examples/motion-morph.html

const ExampleTimer = () => {
  const [paused, setPaused] = useState(false)

  const sketch = (p5: p5) => {
    let elapsed = 0

    p5.setup = () => {
      const canvas = p5.createCanvas(720, 400)
      canvas.mouseClicked(() => {
        setPaused(!paused)
      })
    }

    p5.draw = () => {
      if (!paused) {
        elapsed += p5.deltaTime
      }

      const seconds = (elapsed / 1000).toFixed(3)
      const text =
        `elapsed time: ${seconds} seconds` + (paused ? '\nPAUSED' : '')

      p5.background(200)
      p5.fill(255)
      p5.textSize(32)
      p5.textAlign(p5.CENTER, p5.CENTER)
      p5.text(text, p5.width / 2, p5.height / 2)
    }
  }

  return (
    <>
      <Sketch sketchFunction={sketch} />
      <button onClick={() => setPaused(!paused)}>pause timer</button>
    </>
  )
}

export default ExampleTimer
