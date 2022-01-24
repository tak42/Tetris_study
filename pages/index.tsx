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
const Area = styled.div<{ val: number }>`
  width: 50px;
  height: 50px;
  border: 1px solid black;
  background-color: ${(props) => (props.val === 1 ? 'lightBlue' : 'gray')};
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
    [1, 1],
    [1, 1],
  ]
  const block_t: number[][] = [
    [0, 1, 0],
    [1, 1, 1],
  ]
  const block_l: number[][] = [
    [1, 0],
    [1, 0],
    [1, 1],
  ]
  const block_j: number[][] = [
    [0, 1],
    [0, 1],
    [1, 1],
  ]
  const block_s: number[][] = [
    [0, 1, 1],
    [1, 1, 0],
  ]
  const block_z: number[][] = [
    [1, 1, 0],
    [0, 1, 1],
  ]
  const hanger: number[][][] = [block_i, block_o, block_t, block_l, block_j, block_s, block_z]
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
  const [stgNum, setStgNum] = useState(0)
  const [currentParts, setCurrentParts] = useState(hanger[0])
  const [partsIdx, setPartsIdx] = useState(0)
  const [sidePoint, setSidePoint] = useState(4)
  const [rotation, setRotation] = useState(0)
  const renderLeft = () => {
    if (!isContact(stgNum, sidePoint - 1, currentParts) && sidePoint > 0) {
      setSidePoint((sidePoint) => --sidePoint)
    }
  }
  const renderRight = () => {
    if (
      !isContact(stgNum, sidePoint + 1, currentParts) &&
      sidePoint + currentParts[0].length < 10
    ) {
      setSidePoint((sidePoint) => ++sidePoint)
    }
  }
  const renderDown = () => {
    if (!isContact(stgNum, sidePoint, currentParts) && stgNum + currentParts.length < 20) {
      setStgNum((stgNum) => ++stgNum)
    }
  }
  const renderUp = () => {
    // 一回回転させるとどういう形になるか試す
    const tryRotatedParts: number[][] = tryRotaingParts(stgNum, sidePoint, currentParts, rotation)
    // 接触するかどうかを確認
    const tryIsContact: boolean = isContact(stgNum, sidePoint, tryRotatedParts)
    // 接触していなければ本物を回転させる
    console.log(tryIsContact)
    if (!tryIsContact) {
      setRotation((rotation) => (rotation === 3 ? 0 : rotation++))
      setCurrentParts(tryRotatedParts)
    }
  }
  // prettier-ignore
  useKey('ArrowLeft', () => { renderLeft() }, {}, [sidePoint, stgNum, currentParts])
  // prettier-ignore
  useKey('ArrowRight', () => { renderRight() }, {}, [sidePoint, stgNum, currentParts])
  // prettier-ignore
  useKey('ArrowDown', () => { renderDown() }, {}, [stgNum, sidePoint, currentParts])
  // prettier-ignore
  useKey('ArrowUp', () => { renderUp() }, {}, [stgNum, sidePoint, currentParts])
  const [saveFld, setSaveFld] = useState(baseField) // 保存用field

  // 最下層または、他のブロックと接触しているかどうか
  const isContact = (x: number, y: number, parts: number[][]) => {
    const isPartContact: boolean[] = []
    if (x + parts.length < 20 && y >= 0) {
      for (let i = 1; i < parts.length; i++) {
        for (let l = 0; l < parts[0].length; l++) {
          isPartContact.push(parts[i][l] === 1 && saveFld[x + i][y + l] === 1)
        }
      }
      console.log(x + parts.length - 1)
      for (let i = 0; i < parts[0].length; i++) {
        isPartContact.push(
          parts[parts.length - 1][i] === 1 && saveFld[x + parts.length][y + i] === 1
        )
      }
    }
    return x + parts.length === 20 || isPartContact.includes(true)
  }

  // 試しに回転したときの形を返す
  const tryRotaingParts = (x: number, y: number, parts: number[][], rotation: number) => {
    // rotation:0=素,1=右に90度,2=右に180度,3=右に270度
    const tryRotation = rotation === 3 ? 0 : rotation + 1
    let rotatedParts: number[][] = JSON.parse(JSON.stringify(parts))
    if (tryRotation === 1) {
      const newX = parts[0].length
      const newY = parts.length
      const newParts = [...Array(newX)].map(() => [...Array(newY)].map(() => 0))
      for (let i = 0; i < newX; i++) {
        for (let l = 0; l < newY; l++) {
          newParts[i][l] = parts[newY - l - 1][i]
        }
      }
      rotatedParts = newParts
    }
    return rotatedParts
  }
  const partsDown: number[][] = useMemo(() => {
    const addField = JSON.parse(JSON.stringify(baseField))
    for (let x = 0; x < currentParts.length; x++) {
      for (let y = 0; y < currentParts[x].length; y++) {
        if (currentParts[x][y] === 1) addField[x + stgNum][y + sidePoint] = 1
      }
    }
    return addField
  }, [stgNum, sidePoint, currentParts])

  const landingParts: number[][] = useMemo(() => {
    const newField: number[][] = JSON.parse(JSON.stringify(saveFld))
    if (!isContact(stgNum, sidePoint, currentParts)) {
      partsDown
        .flat()
        .map((elm, idx) => {
          return elm === 1 ? { row: Math.floor(idx / 10), col: idx % 10 } : { row: -1, col: -1 }
        })
        .filter((elm) => elm.row >= 0)
        .forEach((elm) => {
          newField[elm.row][elm.col] = 1
        })
    }
    const rtnField: number[][] = newField.filter((row: number[]) => {
      return !row.every((val: number) => val === 1)
    })
    const unshiftCnt = baseField.length - rtnField.length
    for (let i = 0; i < unshiftCnt; i++) {
      rtnField.unshift([0, 0, 0, 0, 0, 0, 0, 0, 0, 0])
    }
    return rtnField
  }, [stgNum, sidePoint, currentParts])

  const fieldFusion = useMemo(() => {
    const fusionFld = JSON.parse(JSON.stringify(baseField))
    for (let x = 0; x < 20; x++) {
      for (let y = 0; y < 10; y++) {
        // fusionFld[x][y] = partsDown[x][y] + saveFld[x][y] > 0 ? 1 : 0
        fusionFld[x][y] = landingParts[x][y]
      }
    }
    return fusionFld
  }, [stgNum, sidePoint, partsDown, saveFld, currentParts])

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (
        saveFld.filter((row) => {
          return row.includes(1)
        }).length > 19
      ) {
        // clearTimeout(timeoutId)
      } else {
        setStgNum((stgNum) => ++stgNum)
      }
    }, 1000)
    return () => {
      clearTimeout(timeoutId)
    }
  }, [saveFld])

  useEffect(() => {
    if (
      saveFld.filter((row) => {
        return row.includes(1)
      }).length < 20
    ) {
      console.log(stgNum)
      if (isContact(stgNum, sidePoint, currentParts)) {
        setStgNum(0)
        setRotation(0)
        setSidePoint(4)
        setCurrentParts(hanger[(partsIdx + 1) % hanger.length])
        setPartsIdx((partsIdx) => ++partsIdx)
      }
      // setSaveFld(landingParts)
      setField(fieldFusion)
    }
  }, [stgNum, sidePoint, currentParts])

  const onClick = () => {
    setSaveFld(baseField)
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
              <Area key={`${x}-${y}`} val={field[x][y]}>
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
