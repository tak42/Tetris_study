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
  // prettier-ignore
  const longRod: number[][] = [
    [1],
    [1],
    [1],
    [1]
  ]
  const square: number[][] = [
    [1, 1],
    [1, 1],
  ]
  const convex: number[][] = [
    [0, 1, 0],
    [1, 1, 1],
  ]
  const hanger: number[][][] = [longRod, square, convex]
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
  const [timer, setTimer] = useState(0)
  const [stgNum, setStgNum] = useState(0)
  const [currentParts, setCurrentParts] = useState(longRod)
  const [partsIdx, setPartsIdx] = useState(0)
  const [sidePoint, setSidePoint] = useState(4)
  const [saveParts, setSaveParts] = useState([{}])
  const renderLeft = () => {
    if (stgNum + currentParts.length < 19 && sidePoint > 0) {
      setSidePoint((sidePoint) => --sidePoint)
    }
  }
  const renderRight = () => {
    if (stgNum + currentParts.length < 19 && sidePoint + currentParts[0].length < 10) {
      setSidePoint((sidePoint) => ++sidePoint)
    }
  }
  const renderDown = () => {
    if (stgNum + currentParts.length < 19) setStgNum((stgNum) => ++stgNum)
  }
  // prettier-ignore
  useKey('ArrowLeft', () => { renderLeft() }, {}, [sidePoint, stgNum, currentParts])
  // prettier-ignore
  useKey('ArrowRight', () => { renderRight() }, {}, [sidePoint, stgNum, currentParts])
  // prettier-ignore
  useKey('ArrowDown', () => { renderDown() }, {}, [stgNum, currentParts])
  const [saveFld, setSaveFld] = useState(baseField) // 保存用field
  const [opeFld, setOpeFld] = useState(baseField) //操作用（Operation）field

  const partsDown: number[][] = useMemo(() => {
    const addField = JSON.parse(JSON.stringify(baseField))
    for (let x = 0; x < currentParts.length; x++) {
      for (let y = 0; y < currentParts[x].length; y++) {
        if (currentParts[x][y] == 1) addField[x + stgNum][y + sidePoint] = 1
      }
    }
    return addField
  }, [stgNum, sidePoint, currentParts])

  const landingParts: number[][] = useMemo(() => {
    const newField: number[][] = JSON.parse(JSON.stringify(saveFld))
    // 着地判定
    if (stgNum + currentParts.length === 20) {
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
      console.log(rtnField.length)
      rtnField.unshift([0, 0, 0, 0, 0, 0, 0, 0, 0, 0])
    }
    return rtnField
  }, [stgNum, sidePoint, currentParts])

  const fieldFusion = useMemo(() => {
    const fusionFld = JSON.parse(JSON.stringify(baseField))
    for (let x = 0; x < 20; x++) {
      for (let y = 0; y < 10; y++) {
        fusionFld[x][y] = partsDown[x][y] + saveFld[x][y] > 0 ? 1 : 0
      }
    }
    return fusionFld
  }, [stgNum, sidePoint, partsDown, saveFld, currentParts])

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setStgNum((stgNum) => (stgNum + currentParts.length < field.length ? ++stgNum : 0))
      if (stgNum + currentParts.length === field.length) {
        setCurrentParts(hanger[(partsIdx + 1) % hanger.length])
        setPartsIdx((partsIdx) => ++partsIdx)
      }
    }, 1000)
    return () => {
      clearTimeout(timeoutId)
    }
  })

  useEffect(() => {
    setSaveFld(landingParts)
    setField(fieldFusion)
  }, [stgNum, sidePoint, currentParts])

  return (
    <Container>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Main>
        <Grid>
          {field.map((row, x) =>
            row.map((col, y) => (
              <Area key={`${x}-${y}`} val={field[x][y]}>
                {x}, {y}
              </Area>
            ))
          )}
        </Grid>
      </Main>
    </Container>
  )
}
export default Home
