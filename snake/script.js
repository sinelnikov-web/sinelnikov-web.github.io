var game = {
    mapWidth: 25,
    mapHeight: 25,
    gameStart: false,
    lose: false,
    win: false,
    fruitsOnMap: 2,
    fruitsOnMapMaxLimit: 10,
    fruitsOnMapMinLimit: 1,
    fruits: [[Math.floor(Math.random() * 25), Math.floor(Math.random() * 25)]],
    score: 0,
    changeFruitLimit: function (control) {
        switch (control) {
            case '+': {
                if (this.fruitsOnMap < this.fruitsOnMapMaxLimit) {
                    this.fruitsOnMap++
                }
                break
            }
            case '-': {
                if (this.fruitsOnMap > this.fruitsOnMapMinLimit) {
                    this.fruitsOnMap--
                }
                break
            }
        }
        let fruitLimitArea = document.querySelector('.current-fruit-limit')
        fruitLimitArea.value = game.fruitsOnMap
    },
    deleteFruit: function (fruitIndex) {
        this.fruits.splice(fruitIndex, 1)
    },
    updateScore: function (resetScore=false) {
        if (!resetScore) {
            this.score++
            let scoreValue = document.querySelector('.score__value')
            scoreValue.innerHTML = this.score
        } else {
            this.score = 0
            let scoreValue = document.querySelector('.score__value')
            scoreValue.innerHTML = this.score
        }
    },
    generateFruit: function () {
        let validFruit = false
        while (!validFruit) {
            let fruitPos = [Math.floor(Math.random()*25), Math.floor(Math.random()*25)]
            if (snake.x !== fruitPos[0] && snake.y !== fruitPos[1]) {
                let inTail = false
                snake.tail.forEach(tailPart => tailPart[0] === fruitPos[0] && tailPart[1] === fruitPos[1] ? inTail = true : false)
                if (!inTail) {
                    this.fruits.push(fruitPos)
                    validFruit = true
                }
            }
        }


    },
    restartGame: function () {
        this.gameStart = false
        this.win = false
        this.lose = false
        this.updateScore(true)
        snake.x = Math.floor(game.mapWidth / 2)
        snake.y = Math.floor(game.mapWidth / 2)
        snake.direction = 'UP'
        snake.prevPos = []
        snake.tail = [[12, 13], [12, 14], [12, 15]]
        this.fruits = []
        while (this.fruits.length < this.fruitsOnMap) {
            this.generateFruit()
        }
        this.reDrawMap()
    },
    reDrawMap: function () {
        let gameMap = document.querySelector('.snake')
        let gameFields = document.querySelectorAll('.game-block')
        gameFields.forEach(gameField => {
            gameField.classList.remove('tail', 'snake-head', 'fruit')
            let {x: fieldX, y: fieldY} = gameField.dataset
            if (+fieldX === snake.x && +fieldY === snake.y) {
                gameField.classList.add('snake-head')
            } else {
                snake.tail.forEach(tailPart => {
                    if (tailPart[0] === +fieldX && tailPart[1] === +fieldY) {
                        gameField.classList.add('tail')
                    }
                })
                this.fruits.forEach(fruit => {
                    if (fruit[0] === +fieldX && fruit[1] === +fieldY) {
                        gameField.classList.add('fruit')
                    }
                })
            }
        })
    },
    loseMessage: function () {
        let loseMessage = document.querySelector('#lose')
        loseMessage.classList.add('open')
    },
    winMessage: function () {
        let loseMessage = document.querySelector('#win')
        loseMessage.classList.add('open')
    },
    welcomeMessage: function () {
        let loseMessage = document.querySelector('#welcome')
        loseMessage.classList.add('open')
    }
}

var snake = {
    x: Math.floor(game.mapWidth / 2),
    y: Math.floor(game.mapHeight / 2),
    speed: 10,
    maxSpeedLimit: 50,
    minSpeedLimit: 5,
    direction: 'UP',
    tail: [[12, 13], [12, 14], [12, 15]],
    prevPos: [],
    changeSpeed: function (control) {
        switch (control) {
            case '+': {
                if (this.speed < this.maxSpeedLimit) {
                    this.speed += 5
                }
                break
            }
            case '-': {
                if (this.speed > this.minSpeedLimit) {
                    this.speed -= 5
                }
                break
            }
        }
        let speedLimitArea = document.querySelector('.current-speed')
        speedLimitArea.value = snake.speed
    },
    changeTailPartPosition: function (newPos, index) {
        this.tail[index] = newPos
    },
    changeDirection: function (newDir) {
        if (this.direction === 'UP') {
            if (newDir !== 'DOWN') {
                this.direction = newDir
                return true
            }
        } else if (this.direction === 'DOWN') {
            if (newDir !== 'UP') {
                this.direction = newDir
                return true
            }
        } else if (this.direction === 'RIGHT') {
            if (newDir !== 'LEFT') {
                this.direction = newDir
                return true
            }
        } else if (this.direction === 'LEFT') {
            if (newDir !== 'RIGHT') {
                this.direction = newDir
                return true
            }
        } else {
            return false
        }
    }
}

// char map that change different events to similar directions
var dirMap = {
    'w': 'UP',
    's': 'DOWN',
    'a': 'LEFT',
    'd': 'RIGHT',
    'ц': 'UP',
    'ы': 'DOWN',
    'ф': 'LEFT',
    'в': 'RIGHT',
    'ArrowUp': 'UP',
    'ArrowDown': 'DOWN',
    'ArrowLeft': 'LEFT',
    'ArrowRight': 'RIGHT',
    '⇑': 'UP',
    '⇐': 'LEFT',
    '⇒': 'RIGHT',
    '⇓': 'DOWN',
}

// blocking function which provide us to set game speed
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function run() {
    let gameMap = document.querySelector('.snake')
    while (!game.win && !game.lose) {
        // set game speed
        await sleep(1000 / snake.speed);

        // change snake position on one unit
        move()

        // redraw map with new snake position
        draw(gameMap)

        if (game.score === 40) {
            game.win = true
            game.winMessage()
        }
    }

}

function draw(gameMap) {
    if (game.fruits.length < game.fruitsOnMap) {
        game.generateFruit()
        game.fruits.forEach(fruit => {
            let fruitPos = gameMap.querySelector(`[data-x="${fruit[0]}"][data-y="${fruit[1]}"]`)
            fruitPos.classList.add('fruit')
        })
    }
    game.fruits.forEach((fruit, index) => {
        if (fruit[0] === snake.x && fruit[1] === snake.y) {
            let fruitElement = gameMap.querySelector(`[data-x="${fruit[0]}"][data-y="${fruit[1]}"]`)
            fruitElement.classList.remove('fruit')
            game.deleteFruit(index)
            game.updateScore()
            snake.tail.push([])
        }
    })


    // check if snake eat itself
    snake.tail.forEach(tailPart => {
        if (snake.x === tailPart[0] && snake.y === tailPart[1]) {
            game.lose = true
            game.loseMessage()
        }
    })

    // get current snake head position
    let currentPos = gameMap.querySelector(`[data-x="${snake.x}"][data-y="${snake.y}"]`)

    // get all snake fields
    let tailFields = gameMap.querySelectorAll('.tail')
    let snakeField = gameMap.querySelector('.snake-head')

    // clear snake fields
    snakeField.classList.remove('snake-head')
    tailFields.forEach(field => field.classList.remove('tail'))

    // save previous snake head position to provide our tail follow snake head
    let prevPos = snake.prevPos
    currentPos.classList.add('snake-head')

    // change and redraw snake tail in new positions
    snake.tail.forEach((tailPart, index) => {
        let temp = tailPart
        snake.changeTailPartPosition(prevPos, index)
        let currentTailPos = gameMap.querySelector(`[data-x="${snake.tail[index][0]}"][data-y="${snake.tail[index][1]}"]`)
        currentTailPos.classList.add('tail')
        prevPos = temp
    })

}

function move() {
    // save previous snake head position
    snake.prevPos = [snake.x, snake.y]
    const {mapHeight, mapWidth} = game
    switch (snake.direction) {
        case "UP": {
            snake.y--
            if (snake.y < 0) {
                snake.y = mapHeight - 1
            }
            break
        }
        case "DOWN": {
            snake.y++
            if (snake.y > mapHeight - 1) {
                snake.y = 0
            }
            break
        }
        case "LEFT": {
            snake.x--
            if (snake.x < 0) {
                snake.x = mapWidth - 1
            }
            break
        }
        case "RIGHT": {
            snake.x++
            if (snake.x > mapWidth - 1) {
                snake.x = 0
            }
            break
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {

    let fruitLimitArea = document.querySelector('.current-fruit-limit')
    let speedLimitArea = document.querySelector('.current-speed')
    fruitLimitArea.value = game.fruitsOnMap
    speedLimitArea.value = snake.speed

    let fruitControls = document.querySelectorAll('.fruit-control-btn')
    let speedControls = document.querySelectorAll('.speed-control-btn')
    fruitControls.forEach(btn => btn.addEventListener('click', (e) => {
        game.changeFruitLimit(e.target.dataset.control)
    }))
    speedControls.forEach(btn => btn.addEventListener('click', (e) => {
        snake.changeSpeed(e.target.dataset.control)
    }))

    // connect info button with info message
    let infoButton = document.querySelector('.info-btn')
    infoButton.addEventListener('click', () => {
        let infoMessage = document.querySelector('#info')
        infoMessage.classList.add('open')
    })

    // connect close button with message
    let infoMessageCloseButton = document.querySelector('.info-message__button')
    infoMessageCloseButton.addEventListener('click', (e) => {
        e.target.parentElement.parentElement.classList.remove('open')
    })

    // add listener on every 'restart' button
    let startButtons = document.querySelectorAll('.message__button')
    startButtons.forEach(btn => btn.addEventListener('click', (e) => {
        game.restartGame()
        e.target.parentElement.parentElement.classList.remove('open')
    }))

    // add listener on snake control buttons if user hasn't keyboard
    let controlButtons = document.querySelectorAll('.snake-control')
    controlButtons.forEach(btn => btn.addEventListener('click', (e) => {
        let newDirection = dirMap[e.target.textContent]
        if (!game.gameStart) {
            game.gameStart = true
            snake.changeDirection(newDirection)
            run()
        }
        snake.changeDirection(newDirection)
    }))

    // game.welcomeMessage()

    // first initial draw
    let gameMap = document.querySelector('.snake')
    const {mapHeight, mapWidth} = game
    for (let i = 0; i < mapHeight; i++) {
        for (let j = 0; j < mapWidth; j++) {

            // check if current element is tail
            let isTailField = false
            snake.tail.forEach(tail => tail[0] === j && tail[1] === i ? isTailField = true: false)

            // create game block
            let gameBlock = document.createElement('div')
            if (i === Math.floor(mapHeight / 2) && j === Math.floor(mapWidth / 2)) {
                gameBlock.classList.add('game-block', 'snake-head')
            } else if (isTailField) {
                gameBlock.classList.add('game-block', 'tail')
            } else if (game.fruits[0][0] === j && game.fruits[0][1] === i) {
                gameBlock.classList.add('game-block', 'fruit')
            } else {
                gameBlock.classList.add('game-block')
            }
            gameBlock.dataset.x = j
            gameBlock.dataset.y = i
            gameMap.appendChild(gameBlock)
        }
    }

    document.addEventListener('keydown', (e) => {
        if (e.key.match(/[wasdцфыв]|ArrowUp|ArrowDown|ArrowRight|ArrowLeft/)) {
            let openedMessage = document.querySelector('.open')
            let newDirection = dirMap[e.key]
            let changeDirection = snake.changeDirection(newDirection)
            if (!game.gameStart && openedMessage === null && changeDirection) {
                game.gameStart = true
                run()
            }
        }
    })
})