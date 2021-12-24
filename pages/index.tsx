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
  const [stageNumber, setstageNumber] = useState(0)
  // const [currentParts, setCurrentParts] = useState([[0]])
  const [sidePoint, setSidePoint] = useState(4)
  const [saveParts, setSaveParts] = useState([{}])
  const renderLeft = () => {
    if (stageNumber + longRod.length < 20 && sidePoint > 0) {
      setSidePoint((sidePoint) => --sidePoint)
    }
    // console.log(sidePoint)
  }
  const renderRight = () => {
    if (stageNumber + longRod.length < 20 && sidePoint < 19) {
      setSidePoint((sidePoint) => ++sidePoint)
    }
    // console.log(sidePoint)
  }
  const renderDown = () => {
    if (stageNumber + longRod.length < 20) setstageNumber((stageNumber) => ++stageNumber)
    // console.log(stageNumber)
  }
  // prettier-ignore
  useKey('ArrowLeft', () => { renderLeft() }, {}, [sidePoint, stageNumber])
  // prettier-ignore
  useKey('ArrowRight', () => { renderRight() }, {}, [sidePoint, stageNumber])
  // prettier-ignore
  useKey('ArrowDown', () => { renderDown() }, {}, [stageNumber])
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
    // console.log(sidePoint)
    const addField = new Array(20)
    for (let y = 0; y < 20; y++) {
      addField[y] = new Array(10).fill(0)
    }
    for (let n = 0; n < longRod.length; n++) {
      addField[n + stageNumber][sidePoint] = 1
    }
    return addField
  }, [stageNumber, sidePoint])

  const landingParts = useMemo(() => {
    const newField: number[][] = JSON.parse(JSON.stringify(saveFld))
    console.log(newField)
    const fieldData: number[] = partsDown.flat()
    const positionList = []
    const idxList = []
    if (stageNumber + longRod.length === 20) {
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
      // for (let x = 0; x < 20; x++) {
      //   for (let y = 0; y < 10; y++) {
      //     newField[x][y] = opeFld[x][y]
      //   }
      // }
    }
    return newField
  }, [stageNumber, sidePoint, saveFld])

  const fieldFusion = useMemo(() => {
    const fusionFld = new Array(20)
    for (let y = 0; y < 20; y++) {
      fusionFld[y] = new Array(10).fill(0)
    }
    for (let x = 0; x < 20; x++) {
      for (let y = 0; y < 10; y++) {
        fusionFld[x][y] = opeFld[x][y] + saveFld[x][y] > 0 ? 1 : 0
      }
    }
    return fusionFld
  }, [stageNumber, sidePoint, opeFld, saveFld])

  const fullRowDelete = useMemo(() => {
    const rowNumberList: number[] = []
    const rtnFld = new Array(20)
    for (let y = 0; y < 20; y++) {
      rtnFld[y] = new Array(10).fill(0)
    }
    // console.log(rtnFld)
    saveFld.forEach((row) => {
      rowNumberList.push(row.every((val) => val === 1) ? 1 : 0)
    })
    // console.log(rowNumberList)
    // rowNumberList.sort((a, b) => { return a - b })
    saveFld.forEach((row, i) => {
      // 1で埋まっていない行
      // console.log(rowNumberList[i])
      if (rowNumberList[i] === 0) {
        // console.log(
        //   i +
        //     rowNumberList.filter((val, x) => {
        //       return val === 1 && i < x
        //     }).length
        // )
        rtnFld[
          i +
            rowNumberList.filter((val, x) => {
              return val === 1 && i < x
            }).length
        ] = row
      }
    })
    // console.log(rtnFld)
    return rtnFld
  }, [saveFld])

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setstageNumber((stageNumber) => (stageNumber + longRod.length < 20 ? ++stageNumber : 0))
    }, 1000)
    return () => {
      clearTimeout(timeoutId)
    }
  })

  useEffect(() => {
    setOpeFld(partsDown)
    setSaveFld(fullRowDelete)
    setSaveFld(landingParts)
    setField(fieldFusion)
    // console.log(fullRowDelete)
  }, [stageNumber, opeFld, sidePoint])

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
