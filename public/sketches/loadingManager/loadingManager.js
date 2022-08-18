function htmlString(strs) {
  const html = strs[0].trim()

  // HACK: i did not find a better way to template HTML without creting all the tags by hand and without importing other libs
  const div = document.createElement('div')
  div.innerHTML = html
  return div.firstChild
}

const LOADING_SCREEN = htmlString`
<div id="loading">
  <h1 id="loading-text">loading</h1>
  <p>If this interactive experience does not load, click below</p>
  <button id="reload-button">Reload</button>
</div>
`

const P5_FILE_NAME =
  'https://cdnjs.cloudflare.com/ajax/libs/p5.js/1.4.1/p5.min.js'

class LoadingManager {
  constructor() {
    window.addEventListener('DOMContentLoaded', () => {
      this.mountDOM()
      this.setupAutopause()
    })

    this.rand = Math.floor(Math.random() * 100)

    // HACK: firefox has a bug (https://bugzilla.mozilla.org/show_bug.cgi?id=941146), reload the page if the bug occurs.
    // also, this doesn't always catch the error
    window.addEventListener('error', (event) => {
      if (
        event.error &&
        event.error.name === 'NS_ERROR_FAILURE' &&
        event.error.filename === P5_FILE_NAME
      ) {
        console.error('[FIREFOX BUG] triggering reload')
        this.reloadPage()
      }
    })
  }

  mountDOM() {
    document.body.prepend(LOADING_SCREEN)

    const reloadButton = document.getElementById('reload-button')
    if (reloadButton) {
      reloadButton.addEventListener('click', () => {
        this.reloadPage()
      })
    }

    this.startAnimation()
  }

  unmountDOM() {
    this.stopAnimation()
    LOADING_SCREEN.remove()
  }

  startAnimation() {
    // TODO: maybe make a decent animation
    let i = 0
    this.animationIntervalId = window.setInterval(() => {
      const loadingText = document.getElementById('loading-text')
      if (!loadingText) return

      const dots = '.'.repeat((i % 3) + 1)
      const text = 'Loading' + dots
      loadingText.innerText = text

      i++
    }, 750)
  }

  stopAnimation() {
    window.clearInterval(this.animationIntervalId)
  }

  reloadPage() {
    window.location.reload()
  }

  loaded() {
    this.unmountDOM()
  }

  setupAutopause() {
    this.shouldPause = false
    this.observer = new IntersectionObserver(([entry]) => {
      this.shouldPause = !entry.isIntersecting
    })
    this.observer.observe(document.body)
  }
}

window.loadingManager = new LoadingManager()
