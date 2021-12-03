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
  background-color: green;
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
  max-width: 800px;
  margin-top: 3rem;

  @media (max-width: 600px) {
    flex-direction: column;
    width: 100%;
  }
`
const Block = styled.div<{ val: number }>`
  width: 100px;
  height: 100px;
  background-color: ${(props) => (props.val === 1 ? 'yellow' : 'green')};
  border: 1px solid white;
`

const Stone = styled.div<{ val: number }>`
  height: 60px;
  margin: 1rem;
  background-color: ${(props) => (props.val === 1 ? 'black' : 'white')};
  border-radius: 50%;
`

type Cell = { row: number; col: number }
const Home: NextPage = () => {
  // prettier-ignore
  // const [board, setBoard] = useState([
  //   [0,0,0,0,0,0,0,0],
  //   [0,0,0,0,0,0,0,0],
  //   [0,0,0,0,0,0,0,0],
  //   [0,0,0,1,2,0,0,0],
  //   [0,0,0,2,1,0,0,0],
  //   [0,0,0,0,0,0,0,0],
  //   [0,0,0,0,0,0,0,0],
  //   [0,0,0,0,0,0,0,0]
  // ])
  const [board, setBoard] = useState([
    [1,1,1,1,1,1,1,1],
    [1,1,1,1,1,1,1,1],
    [1,1,1,1,1,1,1,1],
    [1,1,1,1,1,1,1,1],
    [1,1,1,1,1,1,1,1],
    [1,1,1,1,1,1,1,1],
    [1,1,1,1,1,1,1,1],
    [0,0,0,0,2,1,1,1],
  ])
  const [turnColor, setTurnColor] = useState(1)
  const [passCount, setPassCount] = useState(0)

  const reverseColor: number = useMemo(() => {
    return turnColor === 1 ? 2 : 1
  }, [turnColor])

  const puttables = useMemo(() => {
    // prettier-ignore
    const rtnList = [
      [0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0]
    ]
    // prettier-ignore
    const directions: number[][] = [
      [-1, 0], [-1, 1], [0, 1], [1, 1], [1, 0], [1, -1], [0, -1], [-1, -1]
    ]
    const candidates: Cell[] = []
    // 石を置く候補となる条件
    // 1.何も置かれていない
    // 2.８方向のどこかに石がある
    // 3.石が置かれている方向に２種類の石がある
    // 4.石を置くと、隣り合う石がひっくり返る
    for (let x = 0; x < 8; x++) {
      for (let y = 0; y < 8; y++) {
        if (board[x][y] === 0) {
          for (const direction of directions) {
            for (let n = 1; n < 8; n++) {
              const newX = x + direction[0] * n
              const newY = y + direction[1] * n
              if (newX < 0 || newY < 0 || newX > 7 || newY > 7) break
              if (board[newX][newY] === reverseColor) {
                candidates.push({ row: newX, col: newY })
              } else if (board[newX][newY] === turnColor) {
                candidates.push({ row: newX, col: newY })
                break
              } else {
                break
              }
            }
            if (candidates.length > 1) {
              const lastCell = candidates[candidates.length - 1]
              if (board[lastCell.row][lastCell.col] === turnColor) {
                rtnList[x][y] = 1
              }
            }
            candidates.splice(0, candidates.length)
          }
        }
      }
    }
    return rtnList
  }, [board, turnColor])

  const isPass = useMemo(() => {
    const OneDimensional = puttables.flat(2)
    return !OneDimensional.includes(1)
  }, [puttables])

  const { whiteCount, blackCount } = useMemo(() => {
    let blCo = 0 // 黒の石の数
    let whCo = 0 // 白の石の数
    for (let x = 0; x < 8; x++) {
      for (let y = 0; y < 8; y++) {
        if (board[x][y] === 2) {
          whCo += 1
        }
        if (board[x][y] === 1) {
          blCo += 1
        }
      }
    }
    return { whiteCount: whCo, blackCount: blCo }
  }, [board])
  useEffect(() => {
    const pCnt: number = isPass ? passCount + 1 : 0
    console.log(pCnt)
    setPassCount(pCnt)
    if (isPass && whiteCount + blackCount < 64) {
      alert('打てるところがないためパスします。')
      setTurnColor(reverseColor)
    }
    if (pCnt > 1) {
      alert('パスが２回続いたので終了します。')
      whiteCount > blackCount ? alert('白の勝ちです。') : alert('黒の勝ちです。')
      resetBoard()
    }
  }, [puttables])

  useEffect(() => {
    if (whiteCount + blackCount === 64) {
      if (whiteCount > blackCount) {
        alert('白の勝ちです。')
      } else {
        alert('黒の勝ちです。')
      }
      resetBoard()
    }
  }, [whiteCount, blackCount])

  const resetBoard = () => {
    // prettier-ignore
    const newBoard: number[][] = [
      [0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0],
      [0,0,0,1,2,0,0,0],
      [0,0,0,2,1,0,0,0],
      [0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0],
      [0,0,0,0,0,0,0,0]
    ]
    setBoard(newBoard)
  }
  const onClick = (x: number, y: number) => {
    const newBoard: number[][] = JSON.parse(JSON.stringify(board)) // boardを直接書き換えないようにコピー作成
    // prettier-ignore
    const directions: number[][] = [
      [-1, 0], [-1, 1], [0, 1], [1, 1], [1, 0], [1, -1], [0, -1], [-1, -1]
    ]
    const candidates: Cell[] = []
    for (const direction of directions) {
      for (let n = 1; n < 8; n++) {
        const newX = x + direction[0] * n
        const newY = y + direction[1] * n
        if (newX < 0 || newY < 0 || newX > 7 || newY > 7) break
        if (newBoard[newX][newY] === reverseColor) {
          candidates.push({ row: newX, col: newY })
        } else if (newBoard[newX][newY] === turnColor) {
          candidates.push({ row: newX, col: newY })
          break
        } else {
          break
        }
      }
      if (candidates.length > 1) {
        const lastCell = candidates[candidates.length - 1]
        if (newBoard[lastCell.row][lastCell.col] === turnColor) {
          candidates.splice(candidates.length - 1, 0)
          for (const cell of candidates) {
            newBoard[cell.row][cell.col] = turnColor
          }
          newBoard[x][y] = turnColor
        }
      }
      candidates.splice(0, candidates.length)
    }
    if (newBoard[x][y] === turnColor) {
      setBoard(newBoard) // boardに変更を反映
      setTurnColor(reverseColor)
    }
  }
  return (
    <Container>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Main>
        <h1>{turnColor === 1 ? '黒の番です。' : '白の番です。'}</h1>
        <Grid>
          {board.map((row, x) =>
            row.map((color, y) => (
              <Block key={`${x}-${y}`} onClick={() => onClick(x, y)} val={puttables[x][y]}>
                {x}, {y}
                {color > 0 && <Stone val={color} />}
              </Block>
            ))
          )}
        </Grid>
      </Main>
    </Container>
  )
}

export default Home
