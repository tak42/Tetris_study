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
  const [field, setField] = useState([
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
  ])
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
  const [saveFld, setSaveFld] = useState([
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
  ]) // 保存用field
  const [opeFld, setOpeFld] = useState([
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
  ]) //操作用（Operation）field

  const partsDown = useMemo(() => {
    const addField = new Array(20)
    for (let y = 0; y < 20; y++) {
      addField[y] = new Array(10).fill(0)
    }
    console.log(currentParts)
    for (let x = 0; x < currentParts.length; x++) {
      for (let y = 0; y < currentParts[x].length; y++) {
        if (currentParts[x][y] == 1) addField[x + stgNum][y + sidePoint] = 1
      }
    }
    return addField
  }, [stgNum, sidePoint, currentParts])

  const landingParts = useMemo(() => {
    const newField: number[][] = JSON.parse(JSON.stringify(saveFld))
    const fieldData: number[] = partsDown.flat()
    const positionList = []
    const idxList = []
    if (stgNum + currentParts.length === 20) {
      for (let i = 0; i < fieldData.length; i++) {
        if (fieldData[i] === 1) idxList.push(i)
      }
      for (const elm of idxList) {
        const exclusion = Math.floor(elm / 10)
        const surplus = elm % 10
        positionList.push({ row: exclusion, col: surplus })
      }
      for (const position of positionList) {
        newField[position.row][position.col] = 1
      }
      newField.forEach((row: number[]) => {
        if (row.every((val: number) => val === 1)) {
          for (let i = 0; i < 10; i++) {
            row[i] = 0
          }
        }
      })
    }
    return newField
  }, [stgNum, sidePoint, saveFld, currentParts])

  const fieldFusion = useMemo(() => {
    const fusionFld = new Array(20)
    for (let y = 0; y < 20; y++) {
      fusionFld[y] = new Array(10).fill(0)
    }
    for (let x = 0; x < 20; x++) {
      for (let y = 0; y < 10; y++) {
        fusionFld[x][y] = partsDown[x][y] + saveFld[x][y] > 0 ? 1 : 0
      }
    }
    return fusionFld
  }, [stgNum, sidePoint, partsDown, saveFld, currentParts])

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setStgNum((stgNum) => (stgNum + currentParts.length < field.length ? ++stgNum : 0)) // currentPartsが変わるとクリアできない
      if (stgNum + currentParts.length === field.length) {
        setPartsIdx((partsIdx) => ++partsIdx)
        setCurrentParts(hanger[partsIdx % hanger.length]) // stgNumとかみ合わず、範囲外に描写する羽目になる
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
