import type { NextPage } from 'next'
import Head from 'next/head'
import { useEffect, useMemo, useState } from 'react'
import { useKey } from 'react-use'
import styled from 'styled-components'
import { Block, shapes } from './blockShape'
import { rotationMethod } from './rotation'

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
  type physical = { len: number; min: number; max: number }
  type config = { heigth: physical; width: physical }

  const config = {
    height: { len: 20, min: 0, max: 19 },
    width: { len: 10, min: 0, max: 9 },
  }

  const [blocks, setBlocks] = useState([])

  const cellConversion = (index: number): Cell => {
    return [Math.floor(index / config.width.len), index % config.width.len]
  }
  const baseField: Field = [...Array(config.height.len * config.width.len)].map((e, idx) => ({
    point: cellConversion(idx),
    val: 'gray',
  }))

  const [field, setField] = useState<Field>(JSON.parse(JSON.stringify(baseField)))
  const [savedField, setSavedField] = useState<Field>(JSON.parse(JSON.stringify(baseField)))
  const [stageN, setStageN] = useState(0)
  const [currentBlock, setCurrentBlock] = useState<Block>({
    shapeCode: shapes[3].shapeCode,
    height: shapes[3].height,
    width: shapes[3].width,
    color: shapes[3].color,
    spaceIdx: shapes[3].originalSpaceIdx,
    degrees: 0,
    left: 4,
    top: 0,
  })
  const [sidePoint, setSidePoint] = useState(4)
  const [isStop, setIsStop] = useState(true)
  const [timer, setTimer] = useState(false)

  const randomBlocks = (): Block => {
    const idx = Math.floor(Math.random() * shapes.length)
    return {
      shapeCode: shapes[idx].shapeCode,
      height: shapes[idx].height,
      width: shapes[idx].width,
      color: shapes[idx].color,
      spaceIdx: shapes[idx].originalSpaceIdx,
      degrees: 0,
      left: 4,
      top: 0,
    }
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
    const alreadyPlacedCells: Cell[] = searchAlreadPlacedCells(
      [...Array(currentBlock.width)].map<Cell>((__, colIdx) => {
        const currentColSpaceIdx: number[] = [...Array(currentBlock.height)]
          .map<number>((__, rowIdx) => colIdx + currentBlock.width * rowIdx)
          .filter((idx) => currentBlock.spaceIdx.includes(idx))
        const isEmptyExist = currentColSpaceIdx.length > 0
        const bottomIdx = (currentBlock.height - 1) * currentBlock.width + colIdx
        const isEmptyLastIdxCol = currentBlock.spaceIdx.includes(bottomIdx)
        const baseHeight = currentBlock.top + currentBlock.height
        const xCoordinate = currentBlock.left + colIdx
        const yCoordinate =
          isEmptyExist && isEmptyLastIdxCol ? baseHeight - currentColSpaceIdx.length : baseHeight
        return [yCoordinate, xCoordinate]
      }),
      savedField
    )
    return alreadyPlacedCells.length > 0 || currentBlock.top + currentBlock.height === 20
  }, [currentBlock, savedField])

  const isLeftContact = (currentBlock: Block, savedField: Field): boolean => {
    const blockHeight = currentBlock.height
    const blockWidth = currentBlock.width
    const nextLeftPosition = currentBlock.left - 1
    const alreadyLeftPlacedCells: Cell[] = searchAlreadPlacedCells(
      [...Array(blockHeight)].map<Cell>((__, idx) => {
        const leftIdx = idx * blockWidth
        const isEmptyCell = currentBlock.spaceIdx.includes(leftIdx)
        const xCoordinate = isEmptyCell ? currentBlock.left : nextLeftPosition
        const yCoordinate = currentBlock.top + idx
        return [yCoordinate, xCoordinate]
      }),
      savedField
    )
    return nextLeftPosition < 0 || alreadyLeftPlacedCells.length > 0 || isLanded
  }

  const isRightContact = (currentBlock: Block, savedField: Field): boolean => {
    const blockHeight = currentBlock.height
    const blockWidth = currentBlock.width
    const nextRightPosition = currentBlock.left + blockWidth
    const alreadyRightPlacedCells: Cell[] = searchAlreadPlacedCells(
      [...Array(blockHeight)].map<Cell>((__, idx) => {
        const currentDepth = idx + 1
        const rightIdx = currentDepth * blockWidth - 1
        const isEmptyCell = currentBlock.spaceIdx.includes(rightIdx)
        const xCoordinate = isEmptyCell ? nextRightPosition - 1 : nextRightPosition
        const yCoordinate = currentBlock.top + idx
        return [yCoordinate, xCoordinate]
      }),
      savedField
    )
    return nextRightPosition > 9 || alreadyRightPlacedCells.length > 0 || isLanded
  }

  const moveLeft = () => {
    setSidePoint((sidePoint) =>
      isLeftContact(currentBlock, savedField) === false ? --sidePoint : sidePoint
    )
  }

  const moveRight = () => {
    setSidePoint((sidePoint) =>
      isRightContact(currentBlock, savedField) === false ? ++sidePoint : sidePoint
    )
  }

  const moveDown = () => {
    setStageN((stageN) => (isLanded === false ? ++stageN : stageN))
  }

  const rotateBlock = () => {
    const rotatedBlock = rotationMethod[currentBlock.degrees](currentBlock)
    const contactResult = [
      isLeftContact(rotatedBlock, savedField),
      isRightContact(rotatedBlock, savedField),
    ]
    console.log(contactResult)
    if (contactResult.every((isContact) => !isContact)) setCurrentBlock(rotatedBlock)
  }

  useKey('ArrowLeft', moveLeft, {}, [currentBlock, savedField])
  useKey('ArrowRight', moveRight, {}, [currentBlock, savedField])
  useKey('ArrowDown', moveDown, {}, [isLanded])
  useKey('ArrowUp', rotateBlock, {}, [currentBlock])

  const blockDown: Field = useMemo(() => {
    const newField: Field = JSON.parse(JSON.stringify(baseField))
    const blockHeight = currentBlock.height
    const blockWidth = currentBlock.width
    const blockData: Field = [...Array(blockHeight * blockWidth)].map((__, idx) => ({
      point: [
        Math.floor(idx / blockWidth) + currentBlock.top,
        (idx % blockWidth) + currentBlock.left,
      ],
      val: currentBlock.spaceIdx.includes(idx) ? 'gray' : currentBlock.color,
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
      const colorValue = [cell.val, blockDownCell.val].includes(currentBlock.color)
        ? currentBlock.color
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
  }, [blockDown, timer, currentBlock.degrees])

  const resetParam = () => {
    setStageN(0)
    setSidePoint(4)
    setCurrentBlock({
      shapeCode: shapes[3].shapeCode,
      height: shapes[3].height,
      width: shapes[3].width,
      color: shapes[3].color,
      spaceIdx: shapes[3].originalSpaceIdx,
      degrees: 0,
      left: 4,
      top: 0,
    })
  }

  const stageReset = () => {
    return new Promise((resolve, reject) => {
      setTimer(false)
      setTimeout(() => {
        resetParam()
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
      const timerId = setInterval(stageUp, 1000)
      return () => clearTimeout(timerId)
    }
  }, [timer])

  const onClickSwitch = () => {
    isStop ? setTimer(true) : setTimer(false)
    setIsStop(!isStop)
  }

  const onClickReset = () => {
    onClickSwitch()
    resetParam()
    setField(JSON.parse(JSON.stringify(baseField)))
    setSavedField(JSON.parse(JSON.stringify(baseField)))
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
