export type State = {
  text: string
}

export const reducer = (state = { text: '' } as State): State => state
