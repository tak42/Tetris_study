import type { NextPage } from 'next'
import Head from 'next/head'
import { useEffect, useMemo, useState } from 'react'
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
  const longRod: number[] = [4]
  const [timer, setTimer] = useState(0)
  const [blockRow, setBlockRow] = useState(0)
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
  const blockDown = useMemo(() => {
    const newField: number[][] = JSON.parse(JSON.stringify(field))
    for (let n = 0; n < longRod[0]; n++) {
      newField[n + blockRow][4] = 1
    }
    return newField
  }, [field, timer])

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const time = timer + 1
      setTimer(time)
      // console.log(timer)
      setField(blockDown)
      blockRow === 16 ? setBlockRow(0) : setBlockRow(blockRow + 1)
    }, 1000)
    return () => {
      clearTimeout(timeoutId)
    }
  }, [timer])
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
