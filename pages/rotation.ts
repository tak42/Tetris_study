import { Block, BlockShape, shapes } from './blockShape'

export const rotationMethod: {
  [key: number]: (block: Block) => Block
} = {
  // 3*3マスを意識(x-max:3, y-max:3)
  // 上のマス目を0は左下(0,0),90は左上(2,0),180は右上(2,2),270右下(0,2)から生成
  0: (block: Block): Block => {
    return rotateDegrees90(block)
  },
  90: (block: Block): Block => {
    return rotateDegrees180(block)
  },
  180: (block: Block): Block => {
    return rotateDegrees270(block)
  },
  270: (block: Block): Block => {
    return rotateDegrees0(block)
  },
}

const shapeSearch = (shapeCode: string): BlockShape => {
  return shapes.filter((shape) => shape.shapeCode === shapeCode)[0]
}

const spaceIdxCalculate0To90And180To270 = (block: Block): number[] => {
  const newHeight = block.width
  const newWidth = block.height
  return block.spaceIdx.map((idx) => {
    // 0度から90度になる際の法則(1行目:0→1,1→3,2→5 2行目:3→0,4→2,5→4)
    const isCurrentFirstRowIdx = idx < block.width
    const rotatedIdxAddNumber = block.height
    const oddNumberIdxCalculate = (): number => {
      const rotatedRowHeight = idx * rotatedIdxAddNumber
      const rotatedBlockSecondColumnIdx = 1
      const oddNumberIdx = rotatedRowHeight + rotatedBlockSecondColumnIdx
      return oddNumberIdx
    }
    const evenNumberIdxCalculate = (): number => {
      const rotatedRowHeight = idx - newHeight < 0 ? 0 : idx - newHeight
      const evenNumberIdx = rotatedRowHeight * rotatedIdxAddNumber
      return evenNumberIdx
    }
    const newIdx: number = isCurrentFirstRowIdx ? oddNumberIdxCalculate() : evenNumberIdxCalculate()
    return newIdx
  })
}

const spaceIdxCalculate90To180And270To0 = (block: Block): number[] => {
  const newHeight = block.width
  const newWidth = block.height
  return block.spaceIdx.map((idx) => {
    // 90度から180度になる際の法則(0→2,1→5,2→1,3→4,4→0,5→3)
    const isEvenNumberIdx = idx % 2 === 0
    const currentRowHeight = Math.floor(idx / block.width)
    const firstRowColumnIdxCalculate = (): number => {
      const rotatedFirstRowColumnMaxIdx = newWidth - 1
      const rotatedFirstRowColumnIdx = rotatedFirstRowColumnMaxIdx - currentRowHeight
      return rotatedFirstRowColumnIdx
    }
    const SecondRowColumnIdxCalculate = () => {
      const rotatedBlockMaxIdx = newHeight * newWidth - 1
      const rotatedSecondRowColumnIdx = rotatedBlockMaxIdx - currentRowHeight
      return rotatedSecondRowColumnIdx
    }
    const newIdx: number = isEvenNumberIdx
      ? firstRowColumnIdxCalculate()
      : SecondRowColumnIdxCalculate()
    return newIdx
  })
}

const rotateDegrees90 = (block: Block): Block => {
  const topMinusPoint = 1
  const newHeight = block.width
  const newWidth = block.height
  const shape = shapeSearch(block.shapeCode)
  const newSpaceIdx = spaceIdxCalculate0To90And180To270(block)
  return {
    ...block,
    height: newHeight,
    width: newWidth,
    spaceIdx: newSpaceIdx,
    degrees: 90,
    top: block.top - topMinusPoint,
  }
}

const rotateDegrees180 = (block: Block): Block => {
  const newHeight = block.width
  const newWidth = block.height
  const shape = shapeSearch(block.shapeCode)
  const newSpaceIdx = spaceIdxCalculate90To180And270To0(block)
  return {
    ...block,
    height: newHeight,
    width: newWidth,
    spaceIdx: newSpaceIdx,
    degrees: 180,
  }
}

const rotateDegrees270 = (block: Block): Block => {
  const topMinusPoint = 1
  const newHeight = block.width
  const newWidth = block.height
  const shape = shapeSearch(block.shapeCode)
  const newSpaceIdx = spaceIdxCalculate0To90And180To270(block)
  return {
    ...block,
    height: newHeight,
    width: newWidth,
    spaceIdx: newSpaceIdx,
    degrees: 270,
    top: block.top - topMinusPoint,
  }
}

const rotateDegrees0 = (block: Block): Block => {
  const newHeight = block.width
  const newWidth = block.height
  const shape = shapeSearch(block.shapeCode)
  const newSpaceIdx = spaceIdxCalculate90To180And270To0(block)
  return {
    ...block,
    height: newHeight,
    width: newWidth,
    spaceIdx: newSpaceIdx,
    degrees: 0,
  }
}
