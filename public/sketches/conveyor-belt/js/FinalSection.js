const CHECK = '✔'
const X = '✘'

class FinalSection {
  carWidth = 445 // px
  carVertOffs = 100 // px

  // offset starting from the drawing point of the image
  triggerOffset = 160 // px

  correctState = 3
  feedbackTimeout = 1000 // ms

  constructor(x, width, carImage1, carImage2) {
    this.x = x
    this.width = width
    this.carImage1 = carImage1
    this.carImage2 = carImage2

    this.isShowingFeedback = false
    this.success = false

    this.calculateImagePositioningData()
  }

  calculateImagePositioningData() {
    // we are assuming that the images of the two cars have identical dimensions
    const img = this.carImage1

    const w = this.carWidth
    const h = (this.carWidth / img.width) * img.height

    // draw image centered
    const y = this.carVertOffs
    const x = this.x + this.width / 2 - w / 2

    this.imagePositioningData = { x, y, w, h }
  }

  showFeedback(item) {
    const state = item.state
    this.success = state === this.correctState

    this.isShowingFeedback = true
    window.setTimeout(() => {
      this.isShowingFeedback = false
    }, this.feedbackTimeout)
  }

  update(items = []) {
    const { x: imageX } = this.imagePositioningData

    let i = 0
    while (i < items.length) {
      const item = items[i]

      if (item.x > imageX + this.triggerOffset) {
        this.showFeedback(item)

        // delete item
        items.splice(i, 1)
      } else {
        i++
      }
    }
  }

  draw() {
    const img =
      this.isShowingFeedback && this.success ? this.carImage2 : this.carImage1

    const { x, y, w, h } = this.imagePositioningData
    image(img, x, y, w, h)

    if (this.isShowingFeedback) {
      const txt = this.success ? CHECK : X
      const col = this.success ? 'green' : 'red'

      fill(col)
      stroke(0)
      strokeWeight(10)
      textAlign(CENTER, CENTER)
      textSize(300)
      text(txt, x + w / 2, y + h / 2)
    }

    if (DEBUG) {
      stroke(255, 255, 0)
      strokeWeight(5)
      noFill()
      rect(this.x, 0, this.width, height)
    }
  }
}
