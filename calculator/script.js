


var calculatorState = {
    input: null,
    result: 0,
    currentNumber: '0',
    prevNumber: '',
    currentChar: '',
    currentOperation: '',
    calculate: function (btn) {

        // get element with character
        const btnChar = btn.querySelector('.calculator__character')

        // get btn type
        const charType = btnChar.dataset.type

        // define need actions
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
        // some debug code
        console.group('Debug info')
        console.log('currentNumber:', this.currentNumber)
        console.log('prevNumber:', this.prevNumber)
        console.log('currentChar:', this.currentChar)
        console.log('currentOperation:', this.currentOperation)
        console.log('result:', this.result)
        console.groupEnd()
    },
    number: function (btnChar) {
        // if (isNaN(parseFloat(this.currentChar)) && this.currentChar !== '.') {
        //     this.currentOperation = this.currentChar
        // }
        // check if user try to input non float number
        if (this.input.value === '0' && btnChar.innerHTML !== '.') {
            this.input.value = ''
            this.currentNumber = ''
        }
        if (btnChar.innerHTML === '.' && this.input.value.includes('.')) {
            return
        }

        // set current char
        this.currentChar = btnChar.innerHTML

        // add current char to current number
        this.currentNumber += this.currentChar

        // show current number in Input
        this.input.value = this.currentNumber
    },
    operation: function (btnChar) {
        // check if we have an operation that hasn't been applied
        if (this.currentOperation) {
            this.applyOperation()

            // set current operation
            this.currentOperation = btnChar.innerHTML
        }
        // check if we haven't any unapplied operation
        if (!this.currentOperation) {
            this.currentOperation = btnChar.innerHTML
        }
        // if user want to find square root then show result immediately
        if (btnChar.innerHTML === '√') {
            this.showResult()
        } else {
            // set current operation
            this.currentChar = btnChar.innerHTML
            this.input.value = this.currentOperation

            // change current number to previous number
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
                // check if user want to divide by zero
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
        // fix 0.1 + 0.2 problem
        if (!Number.isInteger(+this.currentNumber) || !Number.isInteger(+this.prevNumber)) {
            let currFloat = this.currentNumber.split('.')
            let prevFloat = this.prevNumber.split('.')
            currFloat = currFloat.length === 2 ? currFloat[1].length : 0
            prevFloat = prevFloat.length === 2 ? prevFloat[1].length : 0
            this.result = +this.result.toFixed(Math.max(currFloat, prevFloat))
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