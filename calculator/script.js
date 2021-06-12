


var calculatorState = {
    input: null,
    result: 0,
    currentNumber: '',
    prevNumber: '',
    currentChar: '',
    currentOperation: '',
    calculate: function (btn) {
        const btnChar = btn.querySelector('.calculator__character')
        const charType = btnChar.dataset.type
        switch (charType) {
            case 'operation': {
                this.operation(btnChar)
                break
            }
            case 'number': {
                this.number(btnChar)
                break
            }
            case 'result': {
                this.showResult()
                break
            }
            case 'clear': {
                this.clear(btnChar)
                break
            }
        }
        console.group('Debug info')
        console.log('currentNumber:', this.currentNumber)
        console.log('prevNumber:', this.prevNumber)
        console.log('currentChar:', this.currentChar)
        console.log('currentOperation:', this.currentOperation)
        console.log('result:', this.result)
        console.groupEnd()
    },
    number: function (btnChar) {
        if (isNaN(parseFloat(this.currentChar)) && this.currentChar !== '.') {
            this.currentOperation = this.currentChar
        }
        if (this.input.value === '0' && btnChar.innerHTML !== '.') {
            this.input.value = ''
            this.currentNumber = ''
        }
        this.currentChar = btnChar.innerHTML
        this.currentNumber += this.currentChar
        this.input.value = this.currentNumber
    },
    operation: function (btnChar) {
        if (this.currentOperation) {
            this.applyOperation()
            this.currentOperation = btnChar.innerHTML
        }
        if (!this.currentOperation) {
            this.currentOperation = btnChar.innerHTML
        }
        if (btnChar.innerHTML === '√') {
            this.showResult()
        } else {
            this.currentChar = btnChar.innerHTML
            this.input.value = this.currentOperation
            this.prevNumber = this.currentNumber
            this.currentNumber = ''
        }

    },
    applyOperation: function () {
        switch (this.currentOperation) {
            case '+': {
                this.result = +this.prevNumber + +this.currentNumber
                break
            }
            case '-': {
                this.result = +this.prevNumber - +this.currentNumber
                break
            }
            case '*': {
                this.result = +this.prevNumber * +this.currentNumber
                break
            }
            case '÷': {
                if (+this.currentNumber === 0) {
                    alert('На ноль делить нельзя!')
                    break
                }
                this.result = +this.prevNumber / +this.currentNumber
                break
            }
            case '√': {
                this.result = Math.sqrt(this.currentNumber)
                break
            }
        }
        if (!Number.isInteger(+this.currentNumber)) {
            const currFloat = this.currentNumber.split('.')[1]
            const curr = this.currentNumber.includes('.') ? currFloat.length : 0
            this.result = parseInt(currFloat) === 0 ? +this.result.toFixed(0) : +this.result.toFixed(curr)
            if (parseInt(this.result.toString().split('.')[1]) === 0) {
                this.result = +this.result.toFixed(0)
            }
        }
        this.currentOperation = ''
        this.currentNumber = this.result.toString()
        this.prevNumber = ''
    },
    showResult: function () {
        this.applyOperation()
        this.input.value = this.result
    },
    clear: function (btnChar) {
        switch (btnChar.innerHTML) {
            case 'CE': {
                this.clearChar()
                break
            }
            case 'C': {
                this.clearInput()
                break
            }
            case 'CA': {
                this.clearCalculator()
                break
            }
        }
    },
    clearChar: function () {
        const newValue = this.input.value.slice(0, this.input.value.length - 1)
        this.input.value = newValue === '' ? '0' : newValue
        this.currentNumber = this.input.value
    },
    clearInput: function () {
        this.input.value = ''
        this.currentNumber = this.input.value
    },
    clearCalculator: function () {
        this.result = 0
        this.currentNumber = ''
        this.prevNumber = ''
        this.currentChar = ''
        this.currentOperation = ''
        this.input.value = ''
    }
}

var keyMap = {
    'Backspace': 'CE',
    'Enter': '=',
    '=': '=',
    '+': '+',
    '-': '-',
    '*': '*',
    '/': '÷',
    '.': '.',
    '0': '0',
    '1': '1',
    '2': '2',
    '3': '3',
    '4': '4',
    '5': '5',
    '6': '6',
    '7': '7',
    '8': '8',
    '9': '9',
}

document.addEventListener('DOMContentLoaded', () => {
    let calcBtns = document.querySelectorAll('.calculator__button')
    calculatorState.input = document.querySelector('.calculator__input')
    document.addEventListener('keydown', event => {
        if ((event.key).match(/[0-9\/.*\-+=]|Backspace|Enter/)) {
            let calcBtns = document.querySelectorAll('.calculator__button')
            calcBtns.forEach(btn => {
                let btnChar = btn.querySelector('.calculator__character')
                if (btnChar.innerHTML === keyMap[event.key]) {
                    calculatorState.calculate(btn)
                }
            })
        }
    })
    calcBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            calculatorState.calculate(btn)
        })
    })
})