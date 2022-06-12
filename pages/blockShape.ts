export type BlockShape = {
  shapeCode: string
  height: number
  width: number
  color: string
  originalSpaceIdx: number[]
}

export type Block = {
  shapeCode: string
  height: number
  width: number
  color: string
  spaceIdx: number[]
  degrees: number
  left: number
  top: number
}

export const shapes: BlockShape[] = [
  { shapeCode: 'I', height: 1, width: 4, color: 'lightBlue', originalSpaceIdx: [] },
  { shapeCode: 'O', height: 2, width: 2, color: 'yellow', originalSpaceIdx: [] },
  { shapeCode: 'T', height: 2, width: 3, color: 'purple', originalSpaceIdx: [0, 2] },
  { shapeCode: 'L', height: 2, width: 3, color: 'orange', originalSpaceIdx: [0, 1] },
  { shapeCode: 'J', height: 2, width: 3, color: 'blue', originalSpaceIdx: [1, 2] },
  { shapeCode: 'S', height: 2, width: 3, color: 'green', originalSpaceIdx: [0, 5] },
  { shapeCode: 'Z', height: 2, width: 3, color: 'red', originalSpaceIdx: [2, 3] },
]
