import type P5 from 'p5'
import { Action } from './automaton'

export class Section {
  p5: P5

  index: number
  action: Action
  width: number

  // x position of start and end of this section
  start: number
  end: number

  // x position where the pin will be drawn
  pinPosition: number
  pinWidth: number

  constructor(p5: P5, index: number, action: Action, width: number) {
    this.p5 = p5

    this.index = index
    this.action = action
    this.width = width

    this.start = this.width * index
    this.end = this.width * (index + 1)

    this.pinPosition = this.width * this.index + this.width / 2
    this.pinWidth = 20
  }

  isInside(x: number) {
    // NOTE: start is inclusive and end is exclusive, this is to avoid having some x coords that are in two sections simultaneously
    return x >= this.start && x < this.end
  }

  drawRed() {
    const color = 'red'
    const h = 70
    const y = 0

    this.p5.fill(color)
    this.p5.noStroke()
    this.p5.rect(this.pinPosition - this.pinWidth / 2, y, this.pinWidth, h)
  }

  drawGreen() {
    const color = 'green'
    const h = 150
    const y = this.p5.height - h

    this.p5.fill(color)
    this.p5.noStroke()
    this.p5.rect(this.pinPosition - this.pinWidth / 2, y, this.pinWidth, h)
  }

  draw() {
    if (this.action === 0) {
      this.drawRed()
    } else {
      this.drawGreen()
    }
  }

  mouseClicked() {
    if (this.p5.mouseY <= this.p5.height && this.isInside(this.p5.mouseX)) {
      this.action = this.action === 0 ? 1 : 0
    }
  }
}
