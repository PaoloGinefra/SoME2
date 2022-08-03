function htmlString(strs) {
  const html = strs[0].trim()

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

class LoadingManager {
  constructor() {
    window.addEventListener('DOMContentLoaded', () => {
      this.setup()
    })
  }

  setup() {
    document.body.prepend(LOADING_SCREEN)

    // TODO: maybe make a decent animation
    let i = 0
    this.intervalId = window.setInterval(() => {
      const loadingText = document.getElementById('loading-text')
      if (!loadingText) return

      const dots = '.'.repeat((i % 3) + 1)
      const text = 'Loading' + dots
      loadingText.innerText = text

      i++
    }, 750)

    const reloadButton = document.getElementById('reload-button')
    if (reloadButton) {
      reloadButton.addEventListener('click', () => {
        window.location.reload()
      })
    }
  }

  loaded() {
    window.clearInterval(this.intervalId)
    LOADING_SCREEN.remove()
  }
}

window.loadingManager = new LoadingManager()
