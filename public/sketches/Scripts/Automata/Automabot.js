/*========================================================================
    An Automabot is a cute little bot who can follow some instructions
    given as a word. It needs to know the Automaton topology as well as
    the worldPosition of every node.

    First of all your automabot needs to compute the animation in the setup
    with [computeAnimation] then [draw] needs to be called every
    frame in order to make the animation progress
  ========================================================================*/

class Automabot {
  //Linear interpolation function
  static Linear(t) {
    return t
  }

  //sin interpolation function
  static Sin(t) {
    return sin((t * PI) / 2)
  }

  static EaseIn(t) {
    return pow(t, 1 / 0.5)
  }

  static EaseOut(t) {
    return pow(t, 0.7)
  }

  static DoubleSigmoid(t, a = 0.5) {
    if (t <= 0.5) return pow(2 * t, 1 / a) / 2
    return 1 - pow(2 * (1 - t), 1 / a) / 2
  }

  static preload() {
    Automabot.sprite = loadImage('../Art/MinerTest.png')
  }

  constructor(
    Automaton,
    Nodes,
    speed = 1,
    size = 0.5,
    Interpolation = Automabot.Linear,
    stopThresh = 0.01
  ) {
    this.Automaton = Automaton
    this.Nodes = Nodes
    this.speed = speed //the movement speed of the bot in wu/s
    this.Interpolation = Interpolation
    this.stopThresh = stopThresh // the distance bewlow which two points are considered equal
    this.size = size //the size of the bot
    this.t = 0 // time
    this.finished = true

    this.posQueue = []
    this.lastState = null
  }

  /**
   * In the follow mode the bot automatically goes thru gates (states with just one exit which doesn't lead back)
   * or goes back in dead ends
   */

  //Computes a Queue containing keyframes of the bot's position
  computeAnimation(state, word, follow = false, overRide = false) {
    //this.t = 0
    if (!overRide) {
      state = this.lastState != null ? this.lastState : state
    } else {
      this.posQueue = []
      this.lastState = state
    }

    let start = this.posQueue.length
    if (start == 0)
      this.posQueue.push({ pos: this.Nodes[state], deltaTime: 0.0001 })

    //Computes the positions executing the given word
    for (let i = 0; i < word.length; i++) {
      let isGate = false
      let char = Number(word[i])

      do {
        let newState = this.Automaton[state][char]

        //When the bot is in the same state the stall animation is added
        if (state == newState)
          this.stallAnimation(this.Nodes[state], this.posQueue)
        else this.posQueue.push({ pos: this.Nodes[newState] })

        if (follow) [isGate, char] = this.isGateState(newState, state)

        state = newState
        this.lastState = newState
      } while (isGate)
    }

    //computes the time needed to transition between keyframes assuming a constant speed
    for (let i = start + (start == 0); i < this.posQueue.length; i++) {
      this.posQueue[i].deltaTime =
        p5.Vector.dist(this.posQueue[i - 1].pos, this.posQueue[i].pos) /
        this.speed
    }

    //this.posIndex = 1
    if (overRide) {
      this.position = this.posQueue[0].pos
      this.lastTarget = this.position
    }
  }

  isGateState(state, prevState) {
    let neighbours = this.Automaton[state].filter(
      (n) => n !== prevState && n != state
    )
    let len = neighbours.length
    let index = this.Automaton[state].findIndex(
      (n) => (!len || n !== prevState) && n != state
    )
    return [len <= 1, index]
  }

  stallAnimation(position, queue) {
    queue.push({ pos: p5.Vector.add(position, createVector(0, 0.1)) })
    queue.push({ pos: p5.Vector.add(position, createVector(0, -0.1)) })
    queue.push({ pos: p5.Vector.add(position, createVector(0, 0)) })
  }

  //Computes a step of the animation, it needs to be called once per frame
  animationStep() {
    if (this.posQueue.length > 0) {
      let target = this.posQueue[0]

      let l = this.Interpolation(min(1, this.t / target.deltaTime))

      this.position = p5.Vector.lerp(this.lastTarget, target.pos, l)

      if (1 - l <= this.stopThresh) {
        this.position = target.pos.copy()
        this.t = 0
        this.posQueue.shift()
        this.lastTarget = target.pos
      }
      this.finished = false
    } else {
      this.finished = true
    }

    this.t += deltaTime / 1000
  }

  drawSprite() {
    fill(255)
    let wPos = World.w2s(this.position)
    let size = World.w2s(this.size)
    //ellipse(wPos.x, wPos.y, size*1.1);
    this.Sprite(wPos, size)
  }

  //Change the function to draw different sprite
  Sprite(wPos, size) {
    noSmooth()
    imageMode(CORNER)
    image(Automabot.sprite, wPos.x - size / 2, wPos.y - size / 2, size, size)
    smooth()
  }

  /**
   * Returns the nearest state to the current position
   */
  nearestState(Nodes) {
    let minDist = Infinity
    let out = 0
    Nodes.forEach((node, state) => {
      let d = p5.Vector.dist(node, this.position)
      if (d < minDist) {
        minDist = d
        out = state
      }
    })

    return out
  }

  //this function MUST be called once per frame
  draw() {
    this.animationStep()
    this.drawSprite()
  }
}
