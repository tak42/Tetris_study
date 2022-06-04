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
    shapeid: number
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
    { shapeid: 1, height: 4, width: 1, color: 'lightBlue', spaceIdx: [] },
    { shapeid: 2, height: 2, width: 2, color: 'yellow', spaceIdx: [] },
    { shapeid: 3, height: 2, width: 3, color: 'purple', spaceIdx: [0, 2] },
    { shapeid: 4, height: 3, width: 2, color: 'orange', spaceIdx: [1, 3] },
    { shapeid: 5, height: 3, width: 2, color: 'blue', spaceIdx: [0, 2] },
    { shapeid: 6, height: 2, width: 3, color: 'green', spaceIdx: [0, 5] },
    { shapeid: 7, height: 2, width: 3, color: 'red', spaceIdx: [2, 3] },
  ]

  const baseField: Field = [...Array(200)].map((e, idx) => ({
    point: [Math.floor(idx / 10), idx % 10],
    val: 'gray',
  }))

  const [blocks, setBlocks] = useState([])

  const randomBlocks = (): Block => {
    const idx = Math.floor(Math.random() * shapes.length)
    return { shape: { ...JSON.parse(JSON.stringify(shapes[idx])) }, degrees: 0, left: 4, top: 0 }
  }

  const stanbySet = () => {
    return shapes.map((e) => randomBlocks()).slice(0, 4)
  }

  const nextSet = () => {
    const shift = stanbyBlocks.shift()
    return shift ? shift : randomBlocks()
  }

  const [stanbyBlocks, setStanbyBlocks] = useState<Block[]>(stanbySet)

  const [nextBlocks, setNextBlocks] = useState<Block>(randomBlocks)

  const [field, setField] = useState<Field>(JSON.parse(JSON.stringify(baseField)))
  const [savedField, setSavedField] = useState<Field>(JSON.parse(JSON.stringify(baseField)))
  const [stageN, setStageN] = useState(0)
  const [currentBlock, setCurrentBlock] = useState<Block>({
    shape: { ...JSON.parse(JSON.stringify(shapes[0])) },
    degrees: 0,
    left: 4,
    top: 0,
  })
  const [blockIdx, setBlockIdx] = useState(0)
  const [sidePoint, setSidePoint] = useState(4)
  const [rotation, setRotation] = useState(0)
  const [isStop, setIsStop] = useState(true)
  const [timer, setTimer] = useState(false)

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
    const nextLeftPosition = currentBlock.left - 1 < 0 ? 0 : currentBlock.left
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
    return nextLeftPosition === 0 || alreadyLeftPlacedCells.length > 0
  }, [currentBlock, savedField])

  const isRightContact: boolean = useMemo(() => {
    const blockHeight = currentBlock.shape.height
    const blockWidth = currentBlock.shape.width
    const nextRightPosition =
      currentBlock.left + blockWidth > 9 ? 9 : currentBlock.left + blockWidth - 1
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
    return nextRightPosition === 9 || alreadyRightPlacedCells.length > 0
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

  useKey('ArrowLeft', moveLeft, {}, [isLeftContact])
  useKey('ArrowRight', moveRight, {}, [isRightContact])
  useKey('ArrowDown', moveDown, {}, [isLanded])

  // const renderUp = () => {
  //   // 一回回転させるとどういう形になるか試す
  //   const tryRotatedBlock: number[][] = tryRotaingBlock(stgNum, sidePoint, currentBlock, rotation)
  //   // 接触するかどうかを確認
  //   const tryIsContact: boolean = isContact(stgNum, sidePoint, tryRotatedBlock)
  //   // 接触していなければ本物を回転させる
  //   if (!tryIsContact) {
  //     setRotation((rotation) => (rotation === 3 ? 0 : rotation++))
  //     setCurrentBlock(tryRotatedBlock)
  //   }
  // }

  // useKey('ArrowUp', () => { renderUp() }, {}, [stgNum, sidePoint, currentBlock])
  // 試しに回転したときの形を返す
  // const tryRotaingBlock = (x: number, y: number, block: number[][], rotation: number) => {
  //   // rotation:0=素,1=右に90度,2=右に180度,3=右に270度
  //   const tryRotation = rotation === 3 ? 0 : rotation + 1
  //   let rotatedBlock: number[][] = JSON.parse(JSON.stringify(block))
  //   if (tryRotation === 1) {
  //     const newX = block[0].length
  //     const newY = block.length
  //     const newBlock = [...Array(newX)].map(() => [...Array(newY)].map(() => 0))
  //     for (let i = 0; i < newX; i++) {
  //       for (let l = 0; l < newY; l++) {
  //         newBlock[i][l] = block[newY - l - 1][i]
  //       }
  //     }
  //     rotatedBlock = newBlock
  //   }
  //   return rotatedBlock
  // }

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
  }, [currentBlock, sidePoint, stageN, timer])

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

  const blockColor = (shapeid: number) => {
    const find = shapes.filter((e) => e.shapeid === shapeid).pop()
    return find ? find.color : 'gray'
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
