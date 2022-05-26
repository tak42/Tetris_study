import type { NextPage } from 'next'
import Head from 'next/head'
import { useEffect, useMemo, useState } from 'react'
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
  type Block = {
    shapeid: number
    shape: [number, number]
    color: string
    degrees: number
    spaceIdx: number[]
    left: number
    top: number
  }
  const shapes: { shapeid: number; shape: [number, number]; color: string; spaceIdx: number[] }[] =
    [
      { shapeid: 1, shape: [4, 1], color: 'lightBlue', spaceIdx: [] },
      { shapeid: 2, shape: [2, 2], color: 'yellow', spaceIdx: [] },
      { shapeid: 3, shape: [2, 3], color: 'purple', spaceIdx: [] },
      { shapeid: 4, shape: [3, 2], color: 'orange', spaceIdx: [1, 3] },
      { shapeid: 5, shape: [3, 2], color: 'blue', spaceIdx: [0, 2] },
      { shapeid: 6, shape: [2, 3], color: 'green', spaceIdx: [0, 5] },
      { shapeid: 7, shape: [2, 3], color: 'red', spaceIdx: [2, 3] },
    ]

  const baseField: Field = [...Array(200)].map((e, idx) => ({
    point: [Math.floor(idx / 10), idx % 10],
    val: 'gray',
  }))

  const [blocks, setBlocks] = useState([])

  const randomBlocks = (): Block => {
    const idx = Math.floor(Math.random() * shapes.length + 1)
    return { ...shapes[idx], degrees: 0, left: 4, top: 0 }
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

  // const hanger: {}[] = [block_i, block_o, block_t, block_l, block_j, block_s, block_z]
  // const blockColors: string[] = [
  //   'gray',
  //   'lightBlue',
  //   'yellow',
  //   'purple',
  //   'orange',
  //   'blue',
  //   'green',
  //   'red',
  // ]
  // prettier-ignore
  const [field, setField] = useState<Field>(JSON.parse(JSON.stringify(baseField)))
  const [saveFld, setSaveFld] = useState<Field>(JSON.parse(JSON.stringify(baseField)))
  const [stageN, setStageN] = useState(0)
  const [currentBlock, setCurrentBlock] = useState({ ...shapes[0], degrees: 0, left: 4, top: 0 })
  const [blockIdx, setBlockIdx] = useState(0)
  const [sidePoint, setSidePoint] = useState(4)
  const [rotation, setRotation] = useState(0)
  const [isStop, setIsStop] = useState(true)
  const [timer, setTimer] = useState(false)
  // const renderLeft = () => {
  //   if (!isContact(stgNum, sidePoint - 1, currentBlock) && sidePoint > 0) {
  //     setSidePoint((sidePoint) => --sidePoint)
  //   }
  // }

  // const renderRight = () => {
  //   if (
  //     !isContact(stgNum, sidePoint + 1, currentBlock) &&
  //     sidePoint + currentBlock[0].length < 10
  //   ) {
  //     setSidePoint((sidePoint) => ++sidePoint)
  //   }
  // }

  // const renderDown = () => {
  //   if (!isContact(stgNum, sidePoint, currentBlock) && stgNum + currentBlock.length < 20) {
  //     setStgNum((stgNum) => ++stgNum)
  //   }
  // }

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

  // // prettier-ignore
  // useKey('ArrowLeft', () => { renderLeft() }, {}, [sidePoint, stgNum, currentBlock])
  // // prettier-ignore
  // useKey('ArrowRight', () => { renderRight() }, {}, [sidePoint, stgNum, currentBlock])
  // // prettier-ignore
  // useKey('ArrowDown', () => { renderDown() }, {}, [stgNum, sidePoint, currentBlock])
  // // prettier-ignore
  // useKey('ArrowUp', () => { renderUp() }, {}, [stgNum, sidePoint, currentBlock])

  // 最下層または、他のブロックと接触しているかどうか
  const isContact = useMemo(() => {
    const contactBlock = saveFld.filter(
      (square) =>
        square.point[0] === currentBlock.top + currentBlock.shape[0] && square.val !== 'gray'
    )
    return contactBlock.length > 0 || currentBlock.top + currentBlock.shape[0] === 20
  }, [currentBlock])
  //   if (isContact(stgNum, sidePoint, currentBlock)) {
  // const isContact = (x: number, y: number, block: number[][]) => {
  //   const isPartContact: boolean[] = []
  //   if (x + block.length < 20 && y >= 0) {
  //     for (let i = 1; i <= block.length; i++) {
  //       for (let l = 0; l < block[0].length; l++) {
  //         // isPartContact.push(block[i - 1][l] > 0 && saveFld[x + i][y + l] > 0)
  //         // isPartContact.push(block[i - 1][l] > 0 && saveFld[x + i - 1][y + l] > 0)
  //       }
  //     }
  //   }
  //   return x + block.length === 20 || y + block[0].length > 10 || isPartContact.includes(true)
  // }

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

  const isMatch = (cellA: Cell, cellB: Cell) => {
    return cellA[0] === cellB[0] && cellA[1] === cellB[1]
  }

  const blockDown: Field = useMemo(() => {
    const newField = [...baseField]
    const cb = { row: currentBlock.shape[0], col: currentBlock.shape[1] }
    const top = currentBlock.top
    const left = currentBlock.left
    const blockData: Field = [...Array(cb.row * cb.col)].map((e, idx) => ({
      point: [Math.floor(idx / cb.col) + top, (idx % cb.col) + left],
      val: currentBlock.spaceIdx.includes(idx) ? 'gray' : currentBlock.color,
    }))
    return newField.map((e) => {
      const find = blockData.find((x) => isMatch(e.point, x.point))
      find !== undefined ? (e.val = find.val) : (e.val = 'gray')
      return e
    })
  }, [currentBlock])

  const blockLanding: Field = useMemo(() => {
    const landedFld = [...saveFld].map((square) => {
      const find = blockDown.find((x) => isMatch(square.point, x.point))
      return { ...square, val: find !== undefined && isContact ? find.val : square.val }
    })
    const newField = [...Array(20)]
      .map((_, x) =>
        [...Array(10)].map((_, y) => {
          const find = landedFld.find((square) => isMatch(square.point, [x, y]))
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
  }, [blockDown, isContact])
  // const landingBlock: number[][] = useMemo(() => {
  //   const newField: number[][] = JSON.parse(JSON.stringify(saveFld))
  //   if (isContact(stgNum, sidePoint, currentBlock)) {
  //     // prettier-ignore
  //     blockDown.flat().map((elm, idx) => {
  //       return elm > 0 ? { row: Math.floor(idx / 10), col: idx % 10, val: elm } : { row: -1, col: -1, val: 0 }
  //     }).filter((elm) => elm.row >= 0).forEach((elm) => {
  //       newField[elm.row][elm.col] = elm.val
  //     })
  //   }
  //   const rtnField: number[][] = newField.filter((row: number[]) => {
  //     return !row.every((val: number) => val > 0)
  //   })
  //   const unshiftCnt = baseField.length - rtnField.length
  //   for (let i = 0; i < unshiftCnt; i++) {
  //     rtnField.unshift([0, 0, 0, 0, 0, 0, 0, 0, 0, 0])
  //   }
  //   return rtnField
  // }, [stgNum, sidePoint, currentBlock])

  // const fieldFusion = useMemo(() => {
  //   const fusionFld = JSON.parse(JSON.stringify(baseField))
  //   for (let x = 0; x < 20; x++) {
  //     for (let y = 0; y < 10; y++) {
  //       // fusionFld[x][y] = blockDown[x][y] + saveFld[x][y]
  //     }
  //   }
  //   return fusionFld
  // }, [stgNum, sidePoint, blockDown, saveFld, currentBlock])
  const fusionField = useMemo(() => {
    return [...blockLanding].map((square) => {
      const find = blockDown.find((x) => isMatch(x.point, square.point))
      return { ...square, val: square.val === 'gray' && find !== undefined ? find.val : square.val }
    })
  }, [blockDown, blockLanding])

  useEffect(() => {
    if (timer) {
      const timerId = setInterval(stageUp, 1000)
      return () => clearTimeout(timerId)
    }
  }, [timer])

  useEffect(() => {
    const block = { ...currentBlock }
    setCurrentBlock({ ...block, ...{ top: stageN, left: sidePoint } })
    // setSaveFld(blockLanding)
    setField(fusionField)
    // setField(fusionField)
    // if (saveFld.filter((row) => { return row.every((val) => val === 0) }).length > 0) {
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
  }, [stageN, sidePoint])

  const onClickSwitch = () => {
    isStop ? setTimer(true) : setTimer(false)
    setIsStop(!isStop)
  }
  const stageUp = () => {
    setStageN((stgN) => {
      const newN = ++stgN
      return newN > 19 ? 0 : newN
    })
  }

  const onClick = () => {
    // setSaveFld(baseField)
    // setField(baseField)
    // // setCurrentBlock(hanger[0])
    // setCurrentBlock(randomBlocks)
    // setBlockIdx(0)
  }
  const blockColor = (shapeid: number) => {
    const find = shapes.filter((e) => e.shapeid === shapeid).pop()
    return find ? find.color : 'gray'
  }
  // console.log(field)
  return (
    <Container>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Main>
        <Header>
          <button onClick={() => onClick()}>リセット</button>
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
