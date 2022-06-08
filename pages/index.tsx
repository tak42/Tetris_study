import type { NextPage } from 'next'
import Head from 'next/head'
import { useEffect, useMemo, useState } from 'react'
import { useKey } from 'react-use'
import styled from 'styled-components'

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  min-height: 100vh;
  padding: 0 0.5rem;
  background-color: black;
`
const Header = styled.div`
  margin-bottom: 1rem;
`
const Main = styled.main`
  display: flex;
  flex: 1;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 5rem 0;
`

const Grid = styled.div`
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  max-width: 300px;
  margin-top: 3rem;

  @media (max-width: 600px) {
    flex-direction: column;
    width: 100%;
  }
`
const Area = styled.div<{ color: string }>`
  width: 30px;
  height: 30px;
  border: 1px solid black;
  background-color: ${(props) => props.color};
`

const Home: NextPage = () => {
  type Cell = [number, number]
  type Field = { point: Cell; val: string }[]
  type BlockShape = {
    shapeCode: string
    height: number
    width: number
    color: string
    spaceIdx: number[]
  }
  type Block = {
    shape: BlockShape
    degrees: number
    left: number
    top: number
  }
  const shapes: BlockShape[] = [
    { shapeCode: 'I', height: 1, width: 4, color: 'lightBlue', spaceIdx: [] },
    { shapeCode: 'O', height: 2, width: 2, color: 'yellow', spaceIdx: [] },
    { shapeCode: 'T', height: 2, width: 3, color: 'purple', spaceIdx: [0, 2] },
    { shapeCode: 'L', height: 3, width: 2, color: 'orange', spaceIdx: [1, 3] },
    { shapeCode: 'J', height: 3, width: 2, color: 'blue', spaceIdx: [0, 2] },
    { shapeCode: 'S', height: 2, width: 3, color: 'green', spaceIdx: [0, 5] },
    { shapeCode: 'Z', height: 2, width: 3, color: 'red', spaceIdx: [2, 3] },
  ]

  const [blocks, setBlocks] = useState([])

  const cellConversion = (index: number): Cell => {
    return [Math.floor(index / 10), index % 10]
  }
  const baseField: Field = [...Array(200)].map((e, idx) => ({
    point: cellConversion(idx),
    val: 'gray',
  }))

  const [field, setField] = useState<Field>(JSON.parse(JSON.stringify(baseField)))
  const [savedField, setSavedField] = useState<Field>(JSON.parse(JSON.stringify(baseField)))
  const [stageN, setStageN] = useState(0)
  const [currentBlock, setCurrentBlock] = useState<Block>({
    shape: { ...JSON.parse(JSON.stringify(shapes[0])) },
    degrees: 0,
    left: 4,
    top: 0,
  })
  const [sidePoint, setSidePoint] = useState(4)
  const [isStop, setIsStop] = useState(true)
  const [timer, setTimer] = useState(false)

  const randomBlocks = (): Block => {
    const idx = Math.floor(Math.random() * shapes.length)
    return { shape: { ...JSON.parse(JSON.stringify(shapes[idx])) }, degrees: 0, left: 4, top: 0 }
  }

  const stanbySet = () => {
    return shapes.map((__) => randomBlocks()).slice(0, 4)
  }

  const nextSet = () => {
    const shift = stanbyBlocks.shift()
    return shift ? shift : randomBlocks()
  }

  const [stanbyBlocks, setStanbyBlocks] = useState<Block[]>(stanbySet)

  const [nextBlocks, setNextBlocks] = useState<Block>(randomBlocks)

  const isMatch = (cellA: Cell, cellB: Cell) => {
    return cellA[0] === cellB[0] && cellA[1] === cellB[1]
  }

  const searchAlreadPlacedCells = (targetCells: Cell[], savedField: Field): Cell[] => {
    return targetCells.filter(
      (point) =>
        savedField.filter((cell) => isMatch(point, cell.point) && cell.val !== 'gray').length
    )
  }

  const isLanded = useMemo(() => {
    const blockHeight = currentBlock.shape.height
    const colLength = currentBlock.shape.width
    const alreadyPlacedCells: Cell[] = searchAlreadPlacedCells(
      [...Array(colLength)].map<Cell>((__, idx) => {
        const bottomIdx = (blockHeight - 1) * colLength + idx
        const isEmptyCell = currentBlock.shape.spaceIdx.includes(bottomIdx)
        const xCoordinate = currentBlock.left + idx
        const yCoordinate = isEmptyCell
          ? currentBlock.top + blockHeight - 1
          : currentBlock.top + blockHeight
        return [yCoordinate, xCoordinate]
      }),
      savedField
    )
    return alreadyPlacedCells.length > 0 || currentBlock.top + blockHeight === 20
  }, [currentBlock, savedField])

  const isLeftContact: boolean = useMemo(() => {
    const blockHeight = currentBlock.shape.height
    const blockWidth = currentBlock.shape.width
    const nextLeftPosition = currentBlock.left - 1 < 0 ? 0 : currentBlock.left - 1
    const alreadyLeftPlacedCells: Cell[] = searchAlreadPlacedCells(
      [...Array(blockHeight)].map<Cell>((__, idx) => {
        const leftIdx = idx * blockWidth
        const isEmptyCell = currentBlock.shape.spaceIdx.includes(leftIdx)
        const xCoordinate = isEmptyCell ? currentBlock.left : nextLeftPosition
        const yCoordinate = currentBlock.top + idx
        return [yCoordinate, xCoordinate]
      }),
      savedField
    )
    return currentBlock.left === 0 || alreadyLeftPlacedCells.length > 0 || isLanded
  }, [currentBlock, savedField])

  const isRightContact: boolean = useMemo(() => {
    const blockHeight = currentBlock.shape.height
    const blockWidth = currentBlock.shape.width
    const nextRightPosition =
      currentBlock.left + blockWidth > 9 ? 9 : currentBlock.left + blockWidth
    const alreadyRightPlacedCells: Cell[] = searchAlreadPlacedCells(
      [...Array(blockHeight)].map<Cell>((__, idx) => {
        const currentDepth = idx + 1
        const rightIdx = currentDepth * blockWidth - 1
        const isEmptyCell = currentBlock.shape.spaceIdx.includes(rightIdx)
        const xCoordinate = isEmptyCell ? nextRightPosition - 1 : nextRightPosition
        const yCoordinate = currentBlock.top + idx
        return [yCoordinate, xCoordinate]
      }),
      savedField
    )
    return currentBlock.left === 9 || alreadyRightPlacedCells.length > 0 || isLanded
  }, [currentBlock, savedField])

  const moveLeft = () => {
    setSidePoint((sidePoint) => (isLeftContact === false ? --sidePoint : sidePoint))
  }

  const moveRight = () => {
    setSidePoint((sidePoint) => (isRightContact === false ? ++sidePoint : sidePoint))
  }

  const moveDown = () => {
    setStageN((stageN) => (isLanded === false ? ++stageN : stageN))
  }

  const rotationMethod: {
    [key: number]: (block: Block) => Block
  } = {
    90: (block: Block): Block => {
      return rotateDegrees90(block)
    },
    180: (block: Block): Block => {
      return rotateDegrees180(block)
    },
  }
  const rotateDegrees90 = (block: Block) => {
    // 3*3マスを意識(x-max:3, y-max:3)
    // 上のマス目を0は左下(0,0),90は左上(0,2),180は右上(2,2),270右下(2,0)から生成
    // [row, col]
    const topMinusPoint = 2
    // ポイントを起点にblockを描画
    const newHeight = block.shape.width
    const newWidth = block.shape.height
    // 新しいスペースの位置を特定する必要あり
    const newSpaceIdx = block.shape.spaceIdx
    // fieldのどの位置になるか実際の値を入れ込む
    return {
      shape: { ...block.shape, height: newHeight, width: newWidth, spaceIdx: newSpaceIdx },
      degrees: 90,
      left: block.left,
      top: block.top - topMinusPoint,
    }
  }

  const rotateDegrees180 = (block: Block) => {
    return block
  }

  const tryToRotate = (block: Block) => {
    const nextDegrees = block.degrees + 90 > 270 ? 0 : block.degrees + 90
    const rotatedBlock = rotationMethod[nextDegrees](block)
    console.log(rotatedBlock)
    return block
  }

  const rotateBlock = () => {
    tryToRotate(currentBlock)
    // const contactResult = [isLeftContact(rotatedBlock), isRightContact(rotatedBlock)]
  }

  useKey('ArrowLeft', moveLeft, {}, [isLeftContact])
  useKey('ArrowRight', moveRight, {}, [isRightContact])
  useKey('ArrowDown', moveDown, {}, [isLanded])
  useKey('ArrowUp', rotateBlock, {}, [currentBlock])

  const blockDown: Field = useMemo(() => {
    const newField: Field = JSON.parse(JSON.stringify(baseField))
    const blockHeight = currentBlock.shape.height
    const blockWidth = currentBlock.shape.width
    const blockData: Field = [...Array(blockHeight * blockWidth)].map((__, idx) => ({
      point: [
        Math.floor(idx / blockWidth) + currentBlock.top,
        (idx % blockWidth) + currentBlock.left,
      ],
      val: currentBlock.shape.spaceIdx.includes(idx) ? 'gray' : currentBlock.shape.color,
    }))
    return newField.map((cell) => {
      const find = blockData.find((x) => isMatch(cell.point, x.point))
      find !== undefined ? (cell.val = find.val) : (cell.val = 'gray')
      return cell
    })
  }, [currentBlock, timer])

  const blockLanding: Field = useMemo(() => {
    const landedField: Field = savedField.map((cell, idx) => {
      const blockDownCell = blockDown[idx]
      const colorValue = [cell.val, blockDownCell.val].includes(currentBlock.shape.color)
        ? currentBlock.shape.color
        : 'gray'
      return { point: cell.point, val: isLanded ? colorValue : cell.val }
    })
    const newField = [...Array(20)]
      .map((_, x) =>
        [...Array(10)].map((_, y) => {
          const find = landedField.find((cell) => isMatch(cell.point, [x, y]))
          return find !== undefined ? find.val : 'gray'
        })
      )
      .filter((row: string[]) => !row.every((val) => val !== 'gray'))
    const unshiftCnt = 20 - newField.length
    for (let i = 0; i < unshiftCnt; i++) {
      newField.unshift([...Array(10)].map(() => 'gray'))
    }
    const rtnFld: Field = newField
      .map((row, idx1) =>
        row.map((col, idx2) => {
          const cell: Cell = [idx1, idx2]
          return { point: cell, val: col }
        })
      )
      .flat()
    return rtnFld
  }, [savedField, timer])

  const fusionField = useMemo(() => {
    return [...savedField].map((cell) => {
      const find = blockDown.find((x) => isMatch(x.point, cell.point))
      return { ...cell, val: cell.val === 'gray' && find !== undefined ? find.val : cell.val }
    })
  }, [blockDown, timer])

  const stageReset = () => {
    return new Promise((resolve, reject) => {
      setTimer(false)
      setTimeout(() => {
        setStageN(0)
        setSidePoint(4)
        setTimer(true)
        clearTimeout()
        resolve('clear Success!')
      }, 1000)
    })
  }

  const fieldSetMethodCall = () => {
    setField(fusionField)
    setSavedField(blockLanding)
  }

  const parameterSettingMethodCall = async () => {
    if (isLanded) await stageReset()
    setCurrentBlock({ ...currentBlock, ...{ top: stageN, left: sidePoint } })
  }

  useEffect(() => {
    if (timer === false) return
    fieldSetMethodCall()
    parameterSettingMethodCall()
    // if (savedField.filter((row) => { return row.every((val) => val === 0) }).length > 0) {
    //   setField(fieldFusion)
    //   if (isContact(stgNum, sidePoint, currentBlock)) {
    //     setStgNum(0)
    //     setRotation(0)
    //     setSidePoint(4)
    //     setCurrentBlock(hanger[(blockIdx + 1) % hanger.length])
    //     setBlockIdx((blockIdx) => ++blockIdx)
    //   }
    // } else {
    //   alert('ゲームオーバーです')
    //   onClick()
    // }
  }, [timer, stageN, sidePoint])

  const stageUp = () => {
    setStageN((stgN) => {
      const newN = ++stgN
      return newN > 19 ? 0 : newN
    })
  }

  useEffect(() => {
    if (timer) {
      const timerId = setInterval(stageUp, 500)
      return () => clearTimeout(timerId)
    }
  }, [timer])

  const onClickSwitch = () => {
    isStop ? setTimer(true) : setTimer(false)
    setIsStop(!isStop)
  }

  const onClickReset = () => {
    onClickSwitch()
    setCurrentBlock({ ...JSON.parse(JSON.stringify(currentBlock)), top: 0, left: 4 })
    setField(JSON.parse(JSON.stringify(baseField)))
    setSavedField(JSON.parse(JSON.stringify(baseField)))
    setStageN(0)
    setSidePoint(4)
  }

  return (
    <Container>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Main>
        <Header>
          <button onClick={() => onClickReset()}>リセット</button>
          <button onClick={() => onClickSwitch()}>{isStop ? 'スタート' : 'ストップ'}</button>
        </Header>
        <Grid>
          {field.map((e) => (
            <Area key={`${e.point[0]}-${e.point[1]}`} color={e.val}></Area>
          ))}
        </Grid>
      </Main>
    </Container>
  )
}
export default Home
