import './style.css'


const $canvas = document.querySelector('canvas')
const $context = $canvas.getContext('2d')
const $score = document.querySelector('span')

const BLOCK_SIZE = 20
const BOARD_WIDTH = 14
const BOARD_HEIGHT = 30
let score = 0



$canvas.width = BLOCK_SIZE * BOARD_WIDTH
$canvas.height = BLOCK_SIZE * BOARD_HEIGHT

$context.scale(BLOCK_SIZE, BLOCK_SIZE)

const BOARD = createBoard(BOARD_WIDTH, BOARD_HEIGHT)

function createBoard(width, height){
  return Array(height).fill().map(() => Array(width).fill(0))
}


//3. BOARD

// const BOARD = [
//   [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
//   [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
//   [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
//   [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
//   [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
//   [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
//   [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
//   [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
//   [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
//   [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
//   [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
//   [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
//   [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
//   [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
//   [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
//   [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
//   [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
//   [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
//   [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
//   [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
//   [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
//   [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
//   [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
//   [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
//   [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
//   [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
//   [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
//   [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
//   [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
//   [1, 1, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1, 1]
// ]

// 4. piece player

const piece = {
  position: {x:7, y:10},
  shape:[
    [1, 1],
    [1, 1]
  ]
}

// 6. random pieces
const pieces =[
  [
    [1,1],
    [1,1]
  ],
  [
    [1, 1, 1, 1]
  ],
  [
    [0, 1, 0],
    [1, 1, 1],
  ],
  [
    [1, 1, 0],
    [0, 1, 1]
  ],
  [
    [1]
  ],
  [
    [1, 0],
    [1, 0],
    [1, 1]
  ]


]




// 2. game loop, auto drop
let dropCounter = 0
let lastTime = 0
function update(time = 0){

  const deltaTime = time - lastTime
  lastTime = time

  dropCounter += deltaTime

  if(dropCounter > 1000){
    piece.position.y++
    dropCounter = 0

    if (checkCollision()){
      piece.position.y--
      solidfyPiece()
      removeRows()
    }
  }
  draw()
  window.requestAnimationFrame(update)
}

// 5. auto drop


function draw() {
  $context.fillStyle = '#000'
  $context.fillRect(0, 0, $canvas.width, $canvas.height)

  BOARD.forEach((row, y) =>{
      row.forEach((value, x) => {
        if(value === 1){
          $context.fillStyle = 'yellow'
          $context.fillRect(x, y, 1, 1)
        }
      })
  })

  piece.shape.forEach((row, y) => {
    row.forEach((value, x) => {
      if (value){
        $context.fillStyle = 'red'
        $context.fillRect(x + piece.position.x, y + piece.position.y, 1, 1)
      }
    })
  })

  $score.innerText = score
}

document.addEventListener('keydown', event =>{
  if (event.key === 'ArrowLeft') {
    piece.position.x--
    if (checkCollision()){
      piece.position.x++
    }
  }
  if (event.key === 'ArrowRight'){
    piece.position.x++
    if (checkCollision()){
      piece.position.x--
    }
  } 
  if (event.key === 'ArrowDown') {piece.position.y++
    if (checkCollision()){
      piece.position.y--
      solidfyPiece()
      removeRows()
    }
    
  }

  if (event.key === 'ArrowUp'){
    const rotated = []

    for (let i = 0; i < piece.shape[0].length; i++){
      const row = []
      for(let j = piece.shape.length -1; j >= 0; j--){
        row.push(piece.shape[j][i])
      }
      rotated.push(row)
    }
    const previousShape = piece.shape
    piece.shape = rotated
    if (checkCollision()){
      piece.shape = previousShape
    }
    }
  })

function checkCollision(){
  return piece.shape.find((row, y) =>{
    return row.find((value, x) => {
      return (
        value !== 0 &&
        BOARD[y + piece.position.y]?.[x + piece.position.x] !== 0
      )
    })
  })
}

function solidfyPiece(){
  piece.shape.forEach((row, y) =>{
    row.forEach((value, x) => {
      if(value == 1){
        BOARD[y + piece.position.y][x + piece.position.x] = 1
      }
    })
  })

  // get random shape
  piece.shape = pieces[Math.floor(Math.random() * pieces.length)]



  // reset position

  piece.position.x = Math.floor(Math.random() * BOARD_WIDTH)
  piece.position.y = 0

  // Game over
  if (checkCollision()){
    window.alert('Game over - otro día será!!')
    BOARD.forEach((row) => row.fill(0))
  }
}

function removeRows(){
  const rowsToRemove = []

  BOARD.forEach((row,y) =>{
    if(row.every(value => value == 1)){
      rowsToRemove.push(y)
    }
  })

  rowsToRemove.forEach(y =>{
    BOARD.splice(y, 1)
    const newRow = Array(BOARD_WIDTH).fill(0)
    BOARD.unshift(newRow)
    score += 10
  })

 
}
const $section = document.querySelector('section')
$section.addEventListener('click', () =>{
  update()
  $section.remove()
  const audio = new Audio('./02. A-Type Music (v1.0).mp3')
  audio.volume = 0.05
  audio.play()
})





