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
  height: 100vh;
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
  max-width: 500px;
  margin-top: 3rem;

  @media (max-width: 600px) {
    flex-direction: column;
    width: 100%;
  }
`
const Area = styled.div<{ color: string }>`
  width: 50px;
  height: 50px;
  border: 1px solid black;
  background-color: ${(props) => props.color};
`

const Home: NextPage = () => {
  // Tetrisの特徴
  // 1.ある一定の時間がたったらブロックが投下される
  // 2.時間経過中は下り続ける
  // 3.１行うまったらクリアされる
  // 4.クリア行より上の行は１段さがる
  // 5.最上段より上にブロックが来たら負け
  const block_i: number[][] = [[1], [1], [1], [1]]
  const block_o: number[][] = [
    [2, 2],
    [2, 2],
  ]
  const block_t: number[][] = [
    [0, 3, 0],
    [3, 3, 3],
  ]
  const block_l: number[][] = [
    [4, 0],
    [4, 0],
    [4, 4],
  ]
  const block_j: number[][] = [
    [0, 5],
    [0, 5],
    [5, 5],
  ]
  const block_s: number[][] = [
    [0, 6, 6],
    [6, 6, 0],
  ]
  const block_z: number[][] = [
    [7, 7, 0],
    [0, 7, 7],
  ]
  const hanger: number[][][] = [block_i, block_o, block_t, block_l, block_j, block_s, block_z]
  const blockColors: string[] = [
    'gray',
    'lightBlue',
    'yellow',
    'purple',
    'orange',
    'blue',
    'green',
    'red',
  ]
  // prettier-ignore
  const baseField: number[][] = [
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
    [0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  ]
  const [field, setField] = useState(baseField)
  const [saveFld, setSaveFld] = useState(baseField) // 保存用field
  const [stgNum, setStgNum] = useState(0)
  const [currentBlock, setCurrentBlock] = useState(hanger[0])
  const [blockIdx, setBlockIdx] = useState(0)
  const [sidePoint, setSidePoint] = useState(4)
  const [rotation, setRotation] = useState(0)
  const renderLeft = () => {
    if (!isContact(stgNum, sidePoint - 1, currentBlock) && sidePoint > 0) {
      setSidePoint((sidePoint) => --sidePoint)
    }
  }
  const renderRight = () => {
    if (
      !isContact(stgNum, sidePoint + 1, currentBlock) &&
      sidePoint + currentBlock[0].length < 10
    ) {
      setSidePoint((sidePoint) => ++sidePoint)
    }
  }
  const renderDown = () => {
    if (!isContact(stgNum, sidePoint, currentBlock) && stgNum + currentBlock.length < 20) {
      setStgNum((stgNum) => ++stgNum)
    }
  }
  const renderUp = () => {
    // 一回回転させるとどういう形になるか試す
    const tryRotatedBlock: number[][] = tryRotaingBlock(stgNum, sidePoint, currentBlock, rotation)
    // 接触するかどうかを確認
    const tryIsContact: boolean = isContact(stgNum, sidePoint, tryRotatedBlock)
    // 接触していなければ本物を回転させる
    if (!tryIsContact) {
      setRotation((rotation) => (rotation === 3 ? 0 : rotation++))
      setCurrentBlock(tryRotatedBlock)
    }
  }
  // prettier-ignore
  useKey('ArrowLeft', () => { renderLeft() }, {}, [sidePoint, stgNum, currentBlock])
  // prettier-ignore
  useKey('ArrowRight', () => { renderRight() }, {}, [sidePoint, stgNum, currentBlock])
  // prettier-ignore
  useKey('ArrowDown', () => { renderDown() }, {}, [stgNum, sidePoint, currentBlock])
  // prettier-ignore
  useKey('ArrowUp', () => { renderUp() }, {}, [stgNum, sidePoint, currentBlock])

  // 最下層または、他のブロックと接触しているかどうか
  const isContact = (x: number, y: number, block: number[][]) => {
    const isPartContact: boolean[] = []
    if (x + block.length < 20 && y >= 0) {
      for (let i = 1; i <= currentBlock.length; i++) {
        for (let l = 0; l < currentBlock[0].length; l++) {
          isPartContact.push(currentBlock[i - 1][l] > 0 && saveFld[stgNum + i][sidePoint + l] > 0)
        }
      }
      for (let i = 0; i < block[0].length; i++) {
        isPartContact.push(block[block.length - 1][i] > 0 && saveFld[x + block.length][y + i] > 0)
      }
    }
    return x + block.length === 20 || y + block[0].length > 10 || isPartContact.includes(true)
  }

  // 試しに回転したときの形を返す
  const tryRotaingBlock = (x: number, y: number, block: number[][], rotation: number) => {
    // rotation:0=素,1=右に90度,2=右に180度,3=右に270度
    const tryRotation = rotation === 3 ? 0 : rotation + 1
    let rotatedBlock: number[][] = JSON.parse(JSON.stringify(block))
    if (tryRotation === 1) {
      const newX = block[0].length
      const newY = block.length
      const newBlock = [...Array(newX)].map(() => [...Array(newY)].map(() => 0))
      for (let i = 0; i < newX; i++) {
        for (let l = 0; l < newY; l++) {
          newBlock[i][l] = block[newY - l - 1][i]
        }
      }
      rotatedBlock = newBlock
    }
    return rotatedBlock
  }
  const blockDown: number[][] = useMemo(() => {
    const addField = JSON.parse(JSON.stringify(baseField))
    for (let x = 0; x < currentBlock.length; x++) {
      for (let y = 0; y < currentBlock[x].length; y++) {
        if (currentBlock[x][y] > 0) addField[x + stgNum][y + sidePoint] = currentBlock[x][y]
      }
    }
    return addField
  }, [stgNum, sidePoint, currentBlock])

  const landingBlock: number[][] = useMemo(() => {
    const newField: number[][] = JSON.parse(JSON.stringify(saveFld))
    if (isContact(stgNum, sidePoint, currentBlock)) {
      // prettier-ignore
      blockDown.flat().map((elm, idx) => {
        return elm > 0 ? { row: Math.floor(idx / 10), col: idx % 10, val: elm } : { row: -1, col: -1, val: 0 }
      }).filter((elm) => elm.row >= 0).forEach((elm) => {
        newField[elm.row][elm.col] = elm.val
      })
    }
    const rtnField: number[][] = newField.filter((row: number[]) => {
      return !row.every((val: number) => val > 0)
    })
    const unshiftCnt = baseField.length - rtnField.length
    for (let i = 0; i < unshiftCnt; i++) {
      rtnField.unshift([0, 0, 0, 0, 0, 0, 0, 0, 0, 0])
    }
    return rtnField
  }, [stgNum, sidePoint, currentBlock])

  const fieldFusion = useMemo(() => {
    const fusionFld = JSON.parse(JSON.stringify(baseField))
    for (let x = 0; x < 20; x++) {
      for (let y = 0; y < 10; y++) {
        fusionFld[x][y] = blockDown[x][y] + saveFld[x][y]
      }
    }
    return fusionFld
  }, [stgNum, sidePoint, blockDown, saveFld, currentBlock])

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setStgNum((stgNum) => ++stgNum)
    }, 1000)
    return () => {
      clearTimeout(timeoutId)
    }
  })

  useEffect(() => {
    console.log(
      saveFld.filter((row) => {
        return row.every((val) => val === 0)
      }).length
    )
    // prettier-ignore
    if (saveFld.filter((row) => { return row.every((val) => val === 0) }).length > 0) {
      setSaveFld(landingBlock)
      setField(fieldFusion)
      if (isContact(stgNum, sidePoint, currentBlock)) {
        setStgNum(0)
        setRotation(0)
        setSidePoint(4)
        setCurrentBlock(hanger[(blockIdx + 1) % hanger.length])
        setBlockIdx((blockIdx) => ++blockIdx)
      }
    } else {
      alert('ゲームオーバーです')
      onClick()
    }
  }, [stgNum, sidePoint, currentBlock])

  const onClick = () => {
    setSaveFld(baseField)
    setField(baseField)
    setCurrentBlock(hanger[0])
    setBlockIdx(0)
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
          <button onClick={() => onClick()}>リセット</button>
        </Header>
        <Grid>
          {field.map((row, x) =>
            row.map((col, y) => (
              <Area key={`${x}-${y}`} color={blockColors[field[x][y]]}>
                {/* {x}, {y} */}
              </Area>
            ))
          )}
        </Grid>
      </Main>
    </Container>
  )
}
export default Home
