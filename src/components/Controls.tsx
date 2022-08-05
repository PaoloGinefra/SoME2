import classes from '../styles/Controls.module.css'

export interface Action {
  emoji: string | null
  action: string
  control: any
}

export type ActionName =
  // MazeExperience1 and MazeExperience2
  | 'avraham-move-step'
  | 'avraham-move-crossroads'
  | 'avraham-show-map'
  | 'maze-place-wall'
  | 'maze-remove-wall'

  // all sketches that use the World class
  | 'zoom'
  | 'zoom-reset'

  // conveyor belt
  | 'barrier-switch-position'
  | 'barrier-add'
  | 'barrier-remove'
  | 'viewport-scroll-horizotal'

  // ConveyorBeltGraphVis
  | 'scenario-switch'

  // AutomabotDemo1 and ManyBots
  | 'word-set'
  | 'start_node-set'
  | 'word-walk'

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

  'maze-place-wall': {
    emoji: '🧱',
    action: 'Add wall',
    control: (
      <>
        Enter add mode by clicking the brick button,
        <br />
        then click on the maze
      </>
    ),
  },

  'maze-remove-wall': {
    emoji: '⛏️',
    action: 'Remove wall',
    control: (
      <>
        Enter remove mode by clicking the brick button,
        <br /> then click on the maze
      </>
    ),
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

  'barrier-switch-position': {
    emoji: '🧱',
    action: 'Switch position of a Lego barrier',
    control: 'Click (on the barrier)',
  },

  'barrier-add': {
    emoji: '➕',
    action: 'Add barrier',
    control: 'Click the + button',
  },

  'barrier-remove': {
    emoji: '➖',
    action: 'Remove barrier',
    control: 'Click the - button',
  },

  'viewport-scroll-horizotal': {
    emoji: '↔️',
    action: 'move viewport horizontally',
    control: (
      <>
        Use the bottom scrollbar
        <br />
        (appears only when viewport size exceeds screen size)
      </>
    ),
  },

  'scenario-switch': {
    emoji: '🔄',
    action: 'Switch scenario',
    control: 'Click on the button',
  },

  'word-set': {
    emoji: '⌨️',
    action: 'Set word',
    control: 'Type in the text input',
  },

  'start_node-set': {
    emoji: '📍',
    action: 'Set starting state',
    control: 'Select from drop down menu',
  },

  'word-walk': {
    emoji: '🏁',
    action: 'Walk the graph',
    control: 'Click the Compute button',
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
