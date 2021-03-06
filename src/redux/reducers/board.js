let randomNewBoard = addNewNumber(addNewNumber([[0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0], [0, 0, 0, 0]]))
const initialState = {
  board: randomNewBoard,
  score: 0,
  // bestScore: 0,
  gameOverMessage: null,
  // isMoved: true
  direction: null
}

// ============================================================================
// -PURE FUNCTIONS THAT CHANGE THE BOARD-
// ============================================================================

function isMoved (oldboard, newboard) {
  if (JSON.stringify(oldboard) === JSON.stringify(newboard)) {
    return false
  } else {
    return true
  }
}
function deepCopy (x) {
  return JSON.parse(JSON.stringify(x))
}

function getBlankCordinates (board) {
  // this takes in this.state.board, returns an array of blank coordinates
  const blankCoordinates = []
  for (let row = 0; row < board.length; row++) {
    for (let col = 0; col < board[row].length; col++) {
      if (board[row][col] === 0) { blankCoordinates.push([row, col]) }
    }
  }
  return blankCoordinates
}

function getRandomNumber (arr) {
  // it returns a random index in the array
  let r = Math.floor(Math.random() * arr.length)
  return arr[r]
}

function addNewNumber (board) {
  const newboard = deepCopy(board)
  const emptyCordinates = getBlankCordinates(board)
  const cor = getRandomNumber(emptyCordinates)
  newboard[cor[0]][cor[1]] = 2
  return newboard
}

function shiftRowLeft (row) {
  let arr = row.filter(val => val)
  let missing = row.length - arr.length
  let zeros = Array(missing).fill(0)
  arr = arr.concat(zeros)
  return arr
}

function shiftMatrixLeft (board) {
  const newboard = []
  for (let col = 0; col < board.length; col++) {
    let row = board[col]
    let newrow = shiftRowLeft(row)
    newboard.push(newrow)
  }
  return newboard
}

function shiftRowRight (row) {
  let arr = row.filter(val => val)
  let missing = row.length - arr.length
  let zeros = Array(missing).fill(0)
  arr = zeros.concat(arr)
  return arr
}

function shiftMatrixRight (board) {
  let newboard = []
  for (let col = 0; col < board.length; col++) {
    let row = board[col]
    let newrow = shiftRowRight(row)
    newboard.push(newrow)
  }
  return newboard
}

// function mergeRow2Right (row) {
//   for (let key = row.length - 1; key > 0; key--) {
//     if (row[key] === row[key - 1]) {
//       row[key] = 2 * row[key]
//       row[key - 1] = 0
//       row = shiftRowRight(row)
//     }
//   }
//   return row
// }

function merge2Right (board, score) {
  for (let col = 0; col < board.length; col++) {
    for (let row = board[col].length - 1; row > 0; row--) {
      if (board[col][row] > 0 && board[col][row] === board[col][row - 1]) {
        board[col][row] = 2 * board[col][row]
       
        board[col][row - 1] = 0
        board[col] = shiftRowRight(board[col])
      }
    }
  }

  return { board, score }
}

function merge2Left (board, score) {
  for (let col = 0; col < board.length; col++) {
    for (let row = 0; row < board[col].length; row++) {
      if (board[col][row] > 0 && board[col][row] === board[col][row + 1]) {
        board[col][row] = 2 * board[col][row]
        
        board[col][row + 1] = 0
        board[col] = shiftRowLeft(board[col])
      }
    }
  }

  return { board, score }
}

function rotateRight (board) {
  // transpose
  let newboard = []
  for (let col = 0; col < board.length; col++) {
    const newRow = []
    // swap rows
    for (let row = board[col].length - 1; row >= 0; row--) {
      newRow.push(board[row][col])
    }
    newboard.push(newRow)
  }
  return newboard
}

function rotateLeft (board) {
  // transpose and swap columns
  let newboard = []
  for (let col = board.length - 1; col >= 0; col--) {
    const newRow = []
    for (let row = board[col].length - 1; row >= 0; row--) {
      newRow.unshift(board[row][col])
    }
    newboard.push(newRow)
  }
  return newboard
}

function moveRight (board, score, gameOverMessage) {
  let boardcopy = deepCopy(board)
  boardcopy = shiftMatrixRight(boardcopy)
  boardcopy = merge2Right(boardcopy, score).board
  score = merge2Right(boardcopy, score).score
  // if this changes the board, add a new square
  console.log('board,', board)
  console.log('boardcopy,', boardcopy)
  console.log('isMoved', isMoved(board, boardcopy))
  if (isMoved(board, boardcopy)) {
    boardcopy = addNewNumber(boardcopy)
    // check if the game is over
    if (getBlankCordinates(boardcopy).length === 0) {
      gameOverMessage = 'You lost the game.'
      return { boardcopy, score, gameOverMessage }
    // TO DO: show a fail message and reset the game
    } else {
      gameOverMessage = null
      return { boardcopy, score, gameOverMessage }
    }
  } else {
    return { boardcopy, score, gameOverMessage }
  }
}

function moveLeft (board, score, gameOverMessage) {
  let boardcopy = deepCopy(board)
  boardcopy = shiftMatrixLeft(board)
  console.log('shiftleft result', boardcopy)
  boardcopy = merge2Left(boardcopy, score).board
  console.log('merge2left,', boardcopy)
  score = merge2Left(boardcopy, score).score
  console.log('merge2left', score)
  // if this changes the board, add a new square
  console.log('board,', board)
  console.log('boardcopy,', boardcopy)
  console.log('isMoved', isMoved(board, boardcopy))
  if (isMoved(board, boardcopy)) {
    boardcopy = addNewNumber(boardcopy)
    // check if the game is over
    if (getBlankCordinates(boardcopy).length === 0) {
      gameOverMessage = 'You lost the game'
      return { boardcopy, score, gameOverMessage }
    // TO DO: show a fail message and reset the game
    } else {
      gameOverMessage = null
      return { boardcopy, score, gameOverMessage }
    }
  } else {
    return { boardcopy, score, gameOverMessage }
  }
}

function moveUp (board, score, gameOverMessage) {
  let boardcopy = deepCopy(board)
  boardcopy = rotateRight(boardcopy)
  boardcopy = shiftMatrixRight(boardcopy)
  boardcopy = merge2Right(boardcopy, score).board
  score = merge2Right(boardcopy, score).score
  boardcopy = rotateLeft(boardcopy)
  // if this changes the board, add a new square
  // console.log('board,', board)
  // console.log('boardcopy,', boardcopy)
  // console.log('isMoved', isMoved(board, boardcopy))
  if (isMoved(board, boardcopy)) {
    boardcopy = addNewNumber(boardcopy)
    // check if the game is over
    if (getBlankCordinates(boardcopy).length === 0) {
      gameOverMessage = 'You lost the game'
      return { boardcopy, score, gameOverMessage }
    // TO DO: show a fail message and reset the game
    } else {
      gameOverMessage = 'null'
      return { boardcopy, score, gameOverMessage }
    }
  } else {
    return { boardcopy, score, gameOverMessage }
  }
}

function moveDown (board, score, gameOverMessage) {
  let boardcopy = deepCopy(board)
  // console.log(boardcopy)
  let boardcopy1 = rotateRight(boardcopy)
  // console.log(boardcopy1)
  let boardcopy2 = shiftMatrixLeft(boardcopy1)
  // console.log(boardcopy2)
  let boardcopy3 = merge2Left(boardcopy2, score).board
  // console.log(boardcopy3)
  score = merge2Left(boardcopy2, score).score
  let boardcopy4 = rotateLeft(boardcopy3)
  // console.log(boardcopy4)
  // if this changes the board, add a new square
  // console.log('board,', board)
  // console.log('boardcopy,', boardcopy)
  // console.log('isMoved', isMoved(board, boardcopy))
  if (isMoved(board, boardcopy4)) {
    let boardcopy = addNewNumber(boardcopy4)
    // console.log(boardcopy5)
    // check if the game is over
    if (getBlankCordinates(boardcopy).length === 0) {
      gameOverMessage = 'You lost the game'
      console.log('gameOverMessage')
    // TO DO: show a fail message and reset the game
    return { boardcopy, score, gameOverMessage }
    } else {
      gameOverMessage = null
      
      console.log('gameOverMessage is null')
      
      return { boardcopy, score, gameOverMessage }
    }
  } else {
    return { boardcopy, score, gameOverMessage }
  }
}

function getSum(x) {
  var sum = 0;
  const board = x.boardcopy
  for (let row = 0; row < board.length; row++) {
    for (let col=0; col<board[row].length; col++) {
      
      sum = sum + board[row][col]
      console.log('sum row col', sum, row, col, board[row][col])
    }
  }
  console.log('sum', sum)
  return sum 
}
// ===========================================
// -REDUCER-
// ===========================================

const boardReducer = (state = initialState, action) => {
  const stateCopy = deepCopy(state)
  let board = stateCopy.board
  let score = stateCopy.score
  let gameOverMessage = stateCopy.gameOverMessage
  switch (action.type) {
    case 'ADD_NEW':
      const resultAddnew = addNewNumber(board)
      const resultScore = getSum(resultAddnew)
      return { ...state, board: resultAddnew, score: resultScore }

    case 'TEST_NUMBERS':
      const result2048 = [[2, 4, 8, 16], [32, 64, 128, 256], [512, 1024, 2048, 0], [2, 4, 8, 16]]
      return {
        ...state, board: result2048, score: getSum(result2048)
      }

    case 'BUG':
      const resultBug = [[32,8,16,2],[64,16,4,16],[2,8,32,2],[2,2,4,32]]
      return {...state, board:resultBug, score: getSum(resultBug)}

    case 'UP':
      const resultUp = moveUp(board, score, gameOverMessage)
      return {
        ...state, board: resultUp.boardcopy, score: getSum(resultUp), direction:'fas fa-arrow-circle-up is-light'
      }

    case 'DOWN':
      const resultDown = moveDown(board, score, gameOverMessage)
      return { ...state, board: resultDown.boardcopy, score: getSum(resultDown), direction:'fas fa-arrow-circle-down is-light' }

    case 'RIGHT':
      const resultRight = moveRight(board, score, gameOverMessage)
      return { ...state, board: resultRight.boardcopy, score: getSum(resultRight), direction:'fas fa-arrow-circle-right is-light' }

    case 'LEFT':
      let resultLeft = moveLeft(board, score, gameOverMessage)
      return { ...state, board: resultLeft.boardcopy, score: getSum(resultLeft), direction:'fas fa-arrow-circle-left is-light' }

    case 'RESTART':
      return initialState

    default:
      return state
  }
}

export default boardReducer
