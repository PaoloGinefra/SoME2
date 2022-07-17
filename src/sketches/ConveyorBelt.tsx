import SketchRenderer from '../components/SketchRendererNext'
import useSketch from '../hooks/useSketch'

import {
  CONVEYOR_SPEED,
  DEBUG,
  SECTIONS_NUMBER,
  states,
} from './common/conveyor/constants'
import { pick } from './common/conveyor/util'
import { OrientableItem } from './common/conveyor/OrientableItem'
import { Section } from './common/conveyor/Section'

const ConveyorBelt = () => {
  const sketch = useSketch((p5) => {
    const sections = []
    let items = []

    function addItem() {
      let newItem = new OrientableItem(p5, -150, 0, pick(states), sections)

      // center item verically
      let [_, centerY] = newItem.center
      newItem.y = p5.height / 2 + (newItem.y - centerY)

      items.push(newItem)
    }

    p5.setup = function () {
      p5.createCanvas(2000, 400)

      const sectionWidth = Math.floor(p5.width / SECTIONS_NUMBER)
      for (let i = 0; i < SECTIONS_NUMBER; i++) {
        const action = i % 2 == 0 ? 0 : 1
        const newSection = new Section(p5, i, action, sectionWidth)
        sections.push(newSection)
      }

      addItem()

      const interval = p5.width / CONVEYOR_SPEED

      // FIXME: cannot use this
      window.setInterval(addItem, interval)
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
  })

  return <SketchRenderer sketch={sketch} />
}

export default ConveyorBelt
