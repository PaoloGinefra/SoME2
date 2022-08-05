import classes from '../styles/Controls.module.css'

export interface Action {
  emoji: string | null
  action: string
  control: any
}

export type ActionName =
  | 'avraham-move-step'
  | 'avraham-move-crossroads'
  | 'avraham-show-map'
  | 'zoom'
  | 'zoom-reset'

const WASD_KEYS = (
  <>
    <kbd>W</kbd> <kbd>A</kbd> <kbd>S</kbd> <kbd>D</kbd>
  </>
)

const ARROW_KEYS = (
  <>
    <kbd>&larr;</kbd> <kbd>&uarr;</kbd> <kbd>&rarr;</kbd> <kbd>&darr;</kbd>
  </>
)

const actionsMap: { [k in ActionName]: Action } = {
  'avraham-move-step': {
    emoji: '🚶',
    action: 'Move',
    control: (
      <>
        {WASD_KEYS} or {ARROW_KEYS}
      </>
    ),
  },

  'avraham-move-crossroads': {
    emoji: '🚶',
    action: 'Move to the next crossroads',
    control: (
      <>
        {WASD_KEYS} or {ARROW_KEYS}
      </>
    ),
  },

  'avraham-show-map': {
    emoji: '🗺️',
    action: 'Show map',
    control: 'Click (on Avraham)',
  },

  zoom: {
    emoji: '🔍',
    action: 'Zoom',
    control: 'Mouse scroll (inside the frame)',
  },

  'zoom-reset': {
    emoji: null,
    action: 'Reset zoom',
    control: <kbd>R</kbd>,
  },
}

export interface ControlsProps {
  actions: ActionName[]
}

export default function Controls({ actions: names }: ControlsProps) {
  const actions = names.map((name) => actionsMap[name])

  return (
    <div className={classes.container}>
      <table className={classes.table}>
        <thead>
          <tr>
            <td></td>
            <th scope="col">Action</th>
            <th scope="col">Key</th>
          </tr>
        </thead>

        <tbody>
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
        </tbody>
      </table>
    </div>
  )
}
