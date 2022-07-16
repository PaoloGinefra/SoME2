import { CONVEYOR_SECTION_WIDTH } from "./constants";

export class Section {
  constructor(index, action) {
    this.index = index;
    this.action = action;

    // x position of start and end of this section
    this.start = CONVEYOR_SECTION_WIDTH * index;
    this.end = CONVEYOR_SECTION_WIDTH * (index + 1);

    // x position where the pin will be drawn
    this.pinPosition =
      CONVEYOR_SECTION_WIDTH * this.index + CONVEYOR_SECTION_WIDTH / 2;
    this.pinWidth = 20;
  }

  isInside(x) {
    // NOTE: start is inclusive and end is exclusive, this is to avoid having some x coords that are in two sections simultaneously
    return x >= this.start && x < this.end;
  }

  drawRed() {
    const color = "red";
    const h = 70;
    const y = 0;

    fill(color);
    noStroke();
    rect(this.pinPosition - this.pinWidth / 2, y, this.pinWidth, h);
  }

  drawGreen() {
    const color = "green";
    const h = 150;
    const y = height - h;

    fill(color);
    noStroke();
    rect(this.pinPosition - this.pinWidth / 2, y, this.pinWidth, h);
  }

  draw() {
    if (this.action === 0) {
      this.drawRed();
    } else {
      this.drawGreen();
    }
  }

  mouseClicked() {
    if (mouseY <= height && this.isInside(mouseX)) {
      this.action = this.action === 0 ? 1 : 0;
    }
  }
}
