function ticTacMapAnalyze (gameMap) {
    // search in rows
    for (let i = 0; i < gameMap.length; i++) {
        if (gameMap[i].includes('')) {
            continue
        }
        const rowSet = new Set(gameMap[i])
        if (rowSet.size === 1) {
            return Array.from(rowSet)[0]
        }
    }
    // search in cols
    for (let i = 0; i < gameMap.length; i++) {
        const col = [gameMap[0][i], gameMap[1][i], gameMap[2][i]]
        if (col.includes('')) {
            continue
        }
        const colSet = new Set(col)
        if (colSet.size === 1) {
            return Array.from(colSet)[0]
        }
    }
    //search in diagonals
    let mainDiagonal = []
    let sideDiagonal = []
    for (let i = 0; i < gameMap.length; i++) {
        for (let j = 0; j < gameMap[i].length; j++) {
            if (i === j) {
                mainDiagonal.push(gameMap[i][j])
            }
            if (i + j === gameMap[i].length - 1) {
                sideDiagonal.push(gameMap[i][j])
            }
        }
    }
    if (!mainDiagonal.includes('')) {
        let mainDiagonalSet = new Set(mainDiagonal)
        if (mainDiagonalSet.size === 1) {
            return Array.from(mainDiagonalSet)[0]
        }
    }
    if (!sideDiagonal.includes('')) {
        let sideDiagonalSet = new Set(sideDiagonal)
        if (sideDiagonalSet.size === 1) {
            return Array.from(sideDiagonalSet)[0]
        }
    }
    // check draw
    let fullRows = 0
    for (let i = 0; i < gameMap.length; i++) {
        if (!gameMap[i].includes('')) {
            fullRows++
        }
    }
    if (fullRows === 3) {
        return 'draw'
    }
    return false
}

function clearMap () {
    let gameFields = document.querySelectorAll(".tic-tac-toe__field")
    gameFields.forEach(field => {
        const shapeElement = field.querySelector(".shape")
        shapeElement.classList.remove(gameShapes[field.dataset.user])
        const userColor = field.dataset.user === 'x' ? 'bg-primary' : 'bg-danger'
        field.classList.remove('bg-gradient', userColor)
        field.dataset.user = ''
        currentUser = 'x'
    })
}

function updateScore(user) {
    gameScore[user]++
    let userScoreBoard = document.querySelector(`.${user}-user-score`)
    userScoreBoard.innerHTML = gameScore[user]
}

var currentUser = 'x'

var gameShapes = {
    x: 'cross',
    o: 'circle'
}

var gameScore = {
    x: 0,
    o: 0
}

document.addEventListener('DOMContentLoaded', () => {
    let gameFields = document.querySelectorAll(".tic-tac-toe__field")
    gameFields.forEach((field) => {
        field.addEventListener('click', (e) => {
            if (e.target.dataset.user) {
                return
            }
            e.target.dataset.user = currentUser
            const userColor = currentUser === 'x' ? 'bg-primary' : 'bg-danger'
            e.target.classList.add(userColor, 'bg-gradient')
            const shapeElement = e.target.querySelector(".shape")
            shapeElement.dataset.user = currentUser
            shapeElement.classList.add(gameShapes[currentUser])
            currentUser = currentUser === 'x' ? 'o' : 'x'
            // console.log(e.target.dataset)
            let gameFields = document.querySelectorAll(".tic-tac-toe__field")
            let gameMap = [[], [], []]
            gameFields.forEach(field => {
                gameMap[field.dataset.row].push(field.dataset.user)
            })
            const result = ticTacMapAnalyze(gameMap)
            console.log(result)
            if (result) {
                switch (result) {
                    case 'x': {
                        alert('Победили крестики!!!')
                        updateScore(result)
                        clearMap()
                        break
                    }
                    case 'o': {
                        alert('Победили нолики!!!')
                        updateScore(result)
                        clearMap()
                        break
                    }
                    case 'draw': {
                        alert('Ничья')
                        clearMap()
                        break
                    }
                }
            }
        })
    })

})

