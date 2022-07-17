import type { Renderer } from 'p5'
import SketchRenderer from '../components/SketchRendererNext'
import useSketch from '../hooks/useSketch'

import {
  CONVEYOR_SPEED,
  DEBUG,
  SECTIONS_NUMBER,
} from './common/conveyor/settings'
import { states } from './common/conveyor/automaton'
import { pick } from './common/conveyor/util'
import { OrientableItem } from './common/conveyor/OrientableItem'
import { Section } from './common/conveyor/Section'

import classes from '../styles/ConveyorBelt.module.css'

const ConveyorBelt = () => {
  const sketch = useSketch((p5) => {
    let canvas: Renderer

    let sections = []
    let items = []

    function resize(isSetup = false) {
      const canvasElement = canvas.elt as HTMLCanvasElement
      const div = canvasElement.parentElement

      // if we are calling this from setup() do not readraw the canvas
      // this is because the draw() method was implementd assuming that the  setup() would have been exectued completely before being called
      p5.resizeCanvas(div.clientWidth, 400, isSetup)
    }

    function addItem() {
      let newItem = new OrientableItem(p5, -150, 0, pick(states), sections)

      // center item verically
      let [_, centerY] = newItem.center
      newItem.y = p5.height / 2 + (newItem.y - centerY)

      items.push(newItem)
    }

    function conveyorSetup(isSetup = false) {
      resize(isSetup)

      sections = []

      const sectionWidth = Math.floor(p5.width / SECTIONS_NUMBER)
      for (let i = 0; i < SECTIONS_NUMBER; i++) {
        const action = i % 2 == 0 ? 0 : 1
        const newSection = new Section(p5, i, action, sectionWidth)
        sections.push(newSection)
      }

      const interval = p5.width / CONVEYOR_SPEED

      // FIXME: cannot use this
      window.setInterval(addItem, interval)
    }

    p5.setup = function () {
      canvas = p5.createCanvas(500, 400)
      conveyorSetup(true)
    }

    p5.draw = function () {
      // update
      items = items.filter((item) => item.x < p5.width) // remove out of screen items
      items.forEach((item) => item.update())

      // draw
      p5.background('#333')
      sections.forEach((section) => section.draw())
      items.forEach((item) => item.draw())

      if (DEBUG) {
        p5.strokeWeight(1)
        p5.stroke(127)
        p5.line(0, p5.height / 2, p5.width, p5.height / 2)
      }
    }

    p5.mouseClicked = function () {
      sections.forEach((section) => section.mouseClicked())
    }

    p5.windowResized = function () {
      conveyorSetup()
    }
  })

  return <SketchRenderer sketch={sketch} className={classes.sketch} />
}

export default ConveyorBelt
