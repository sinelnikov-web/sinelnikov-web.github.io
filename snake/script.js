var game = {
    mapWidth: 25,
    mapHeight: 25,
    gameStart: false,
    lose: false,
    win: false,
    maxFruitsOnMap: 1,
    fruits: [[Math.floor(Math.random() * 25), Math.floor(Math.random() * 25)]],
    score: 0,
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
    restartGame: function () {
        this.gameStart = false
        this.win = false
        this.lose = false
        this.updateScore(true)
        snake.x = Math.floor(game.mapWidth / 2)
        snake.y = Math.floor(game.mapWidth / 2)
        snake.direction = ''
        snake.prevPos = []
        snake.snail = [[12, 13], [12, 14], [12, 15]]
        if (this.fruits.length < this.maxFruitsOnMap) {
            game.fruits.push([Math.floor(Math.random() * 25), Math.floor(Math.random() * 25)])
        }
        this.reDrawMap()
    },
    reDrawMap: function () {
        let gameMap = document.querySelector('.snake')
        let gameFields = document.querySelectorAll('.game-block')
        gameFields.forEach(gameField => {
            gameField.classList.remove('snail', 'snake-head', 'fruit')
            let {x: fieldX, y: fieldY} = gameField.dataset
            if (+fieldX === snake.x && +fieldY === snake.y) {
                gameField.classList.add('snake-head')
            } else if (+fieldX === this.fruits[0][0] && +fieldY === this.fruits[0][1]) {
                gameField.classList.add('fruit')
            } else {
                snake.snail.forEach(snailPart => {
                    if (snailPart[0] === +fieldX && snailPart[1] === +fieldY) {
                        gameField.classList.add('snail')
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
    direction: '',
    snail: [[12, 13], [12, 14], [12, 15]],
    prevPos: [],
    changeSnailPartPosition: function (newPos, index) {
        this.snail[index] = newPos
    }
}

var dirMap = {
    'w': 'UP',
    's': 'DOWN',
    'a': 'LEFT',
    'd': 'RIGHT',
    '⇑': 'UP',
    '⇐': 'LEFT',
    '⇒': 'RIGHT',
    '⇓': 'DOWN',
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function run() {
    let gameMap = document.querySelector('.snake')
    while (!game.win && !game.lose) {
        await sleep(1000 / snake.speed);
        move()
        draw(gameMap)
        if (game.score === 10) {
            game.win = true
            game.winMessage()
        }
    }

}

function draw(gameMap) {
    if (game.fruits.length < game.maxFruitsOnMap) {
        game.fruits.push([Math.floor(Math.random() * 25), Math.floor(Math.random() * 25)])
        game.fruits.forEach(fruit => {
            let fruitPos = gameMap.querySelector(`[data-x="${fruit[0]}"][data-y="${fruit[1]}"]`)
            fruitPos.classList.add('fruit')
        })
    }
    if (game.fruits[0][0] === snake.x && game.fruits[0][1] === snake.y) {
        let fruitElement = gameMap.querySelector(`[data-x="${game.fruits[0][0]}"][data-y="${game.fruits[0][1]}"]`)
        fruitElement.classList.remove('fruit')
        game.fruits.pop()
        game.updateScore()
        snake.snail.push([])
    }
    snake.snail.forEach(snailPart => {
        if (snake.x === snailPart[0] && snake.y === snailPart[1]) {
            game.lose = true
            game.loseMessage()
        }
    })
    let currentPos = gameMap.querySelector(`[data-x="${snake.x}"][data-y="${snake.y}"]`)
    let snailFields = gameMap.querySelectorAll('.snail')
    let snakeField = gameMap.querySelector('.snake-head')
    snakeField.classList.remove('snake-head')
    snailFields.forEach(field => field.classList.remove('snail'))
    let prevPos = snake.prevPos
    currentPos.classList.add('snake-head')
    snake.snail.forEach((snailPart, index) => {
        let temp = snailPart
        snake.changeSnailPartPosition(prevPos, index)
        let currentSnailPos = gameMap.querySelector(`[data-x="${snake.snail[index][0]}"][data-y="${snake.snail[index][1]}"]`)
        currentSnailPos.classList.add('snail')
        prevPos = temp
    })

}

function move() {
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
    let infoButton = document.querySelector('.info-btn')
    infoButton.addEventListener('click', () => {
        let infoMessage = document.querySelector('#info')
        infoMessage.classList.add('open')
    })
    let infoMessageButton = document.querySelector('.info-message__button')
    infoMessageButton.addEventListener('click', (e) => {
        e.target.parentElement.parentElement.classList.remove('open')
    })
    let startButtons = document.querySelectorAll('.message__button')
    startButtons.forEach(btn => btn.addEventListener('click', (e) => {
        game.restartGame()
        e.target.parentElement.parentElement.classList.remove('open')
    }))
    let controlButtons = document.querySelectorAll('.snake-control')
    controlButtons.forEach(btn => btn.addEventListener('click', (e) => {
        if (!game.gameStart) {
            game.gameStart = true
            snake.direction = dirMap[e.target.textContent]
            run()
        }
        snake.direction = dirMap[e.target.textContent]
    }))
    // game.welcomeMessage()
    let gameMap = document.querySelector('.snake')
    const {mapHeight, mapWidth} = game
    for (let i = 0; i < mapHeight; i++) {
        for (let j = 0; j < mapWidth; j++) {
            let isSnailField = false
            snake.snail.forEach(snail => snail[0] === j && snail[1] === i ? isSnailField = true: false)
            if (i === Math.floor(mapHeight / 2) && j === Math.floor(mapWidth / 2)) {
                let gameBlock = document.createElement('div')
                gameBlock.classList.add('game-block', 'snake-head')
                gameBlock.dataset.x = j
                gameBlock.dataset.y = i
                gameMap.appendChild(gameBlock)
            } else if (isSnailField) {
                let gameBlock = document.createElement('div')
                gameBlock.classList.add('game-block', 'snail')
                gameBlock.dataset.x = j
                gameBlock.dataset.y = i
                gameMap.appendChild(gameBlock)
            } else if (game.fruits[0][0] === j && game.fruits[0][1] === i) {
                let gameBlock = document.createElement('div')
                gameBlock.classList.add('game-block', 'fruit')
                gameBlock.dataset.x = j
                gameBlock.dataset.y = i
                gameMap.appendChild(gameBlock)
            } else {
                let gameBlock = document.createElement('div')
                gameBlock.classList.add('game-block')
                gameBlock.dataset.x = j
                gameBlock.dataset.y = i
                gameMap.appendChild(gameBlock)
            }
        }
    }
    document.addEventListener('keydown', (e) => {
        if (e.key.match(/[wasd]/)) {
            let openedMessage = document.querySelector('.open')
            if (!game.gameStart && openedMessage === null) {
                game.gameStart = true
                snake.direction = dirMap[e.key]
                run()
            }
            snake.direction = dirMap[e.key]
        }
    })
})