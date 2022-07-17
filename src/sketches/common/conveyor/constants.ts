export const CONVEYOR_SPEED = 0.5
export const SECTIONS_NUMBER = 7

// all possible states
export const states = [0, 1, 2, 3] as const

// all possible actions
export const actions = [0, 1] as const

// any possible state
export type State = typeof states[number]

// any possible action
export type Action = typeof actions[number]

// represents the transition matrix
export type Automaton = {
  [key in State]: {
    [key in Action]: State
  }
}

// represents additiona data that each state can hold
export type StateAssociatedData<T> = { [key in State]: T }

export const orientations: StateAssociatedData<number> = [
  0,
  Math.PI / 2,
  Math.PI,
  3 * (Math.PI / 2),
]

export const automaton: Automaton = [
  [3, 1],
  [1, 2],
  [2, 3],
  [3, 0],
]
