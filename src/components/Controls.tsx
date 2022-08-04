import classes from '../styles/Controls.module.css'

interface Action {
  emoji: string | null
  action: string
  control: any

  // TODO: implement dekstop detection
  desktopOnly?: boolean
}

export default function Controls() {
  const WASD = (
    <>
      <kbd>W</kbd> <kbd>A</kbd> <kbd>S</kbd> <kbd>D</kbd>
    </>
  )

  const ARROWS = (
    <>
      <kbd>&larr;</kbd> <kbd>&uarr;</kbd> <kbd>&rarr;</kbd> <kbd>&darr;</kbd>
    </>
  )

  const actions: Action[] = [
    {
      emoji: '🚶',
      action: 'Move',
      control: (
        <>
          {WASD} or {ARROWS}
        </>
      ),
    },

    {
      emoji: '🗺️',
      action: 'Show map',
      control: 'Click (on Avraham)',
    },

    {
      emoji: '🔍',
      action: 'Zoom',
      control: 'Mouse scroll (inside the frame)',
      desktopOnly: true,
    },

    {
      emoji: '🔍❌',
      action: 'Reset zoom',
      control: <kbd>R</kbd>,
      desktopOnly: true,
    },
  ]

  return (
    <div className={classes.container}>
      <table className={classes.table}>
        <tr>
          <td></td>
          <th scope="col">Action</th>
          <th scope="col">Key</th>
        </tr>

        {actions.map((item) => (
          <tr key={item.action}>
            {/* emoji */}
            {item.emoji ? (
              <td>
                <span className="emoji">{item.emoji}</span>{' '}
              </td>
            ) : (
              <td></td>
            )}

            <th scope="row">{item.action}</th>
            <td>{item.control}</td>
          </tr>
        ))}
      </table>
    </div>
  )
}
