function f1(n) {
  return Math.pow(2, n) - n - 1
}

function f2(n) {
  return (n * (sq(n) - 1)) / 6
}

function f3(n) {
  return sq(n - 1)
}

let nSlider
function setup() {
  createCanvas(windowWidth, windowHeight)

  nSlider = createSlider(1, 50, 1)
  nSlider.position(0, windowHeight - nSlider.height)
}

function draw() {
  background(0)
  let n = nSlider.value()
  let maxH = max(f1(n), f2(n), f3(n))

  drawRect(f1(n) / maxH, 0, 20)
  drawRect(f2(n) / maxH, 30, 20)
  drawRect(f3(n) / maxH, 60, 20)
}

function drawRect(val, x, width) {
  val *= windowHeight
  rect(x, windowHeight - val, width, val)
}
