
function checkBody() {
    let todoBody = document.querySelector('.todo__body')
    if (todoBody.scrollHeight - todoBody.scrollTop > todoBody.clientHeight) {
        let scrollVisualizer = todoBody.querySelector('.scroll-visualizer')
        scrollVisualizer.classList.add('active')
    } else {
        let scrollVisualizer = todoBody.querySelector('.scroll-visualizer')
        scrollVisualizer.classList.remove('active')
    }
}

function addTask() {
    const parser = new DOMParser()
    let taskTextInput = document.querySelector('.todo__input')
    if (taskTextInput.value) {
        let taskList = document.querySelector('.todo__task-list')
        let tasks = taskList.querySelectorAll('.todo__task-item')
        // create new task
        const newTask = `<li class="shadow todo__task-item" id="${tasks.length + 1}" data-completed="">\n` +
            '                <div class="todo__task-info"><p class="todo__task-text">\n' +
            `                    ${taskTextInput.value}\n` +
            '                </p></div>\n' +
            '                <div class="todo__task-controls">\n' +
            `                    <button class="todo__task-controls__btn todo__task-complete btn"">&#10004;</button>\n` +
            '                    <button class="todo__task-controls__btn todo__task-delete btn">&#10006;</button>\n' +
            '                </div>\n' +
            '            </li>'

        // reset input
        taskTextInput.value = ''

        // create task element from string
        const newTaskElement = parser.parseFromString(newTask, 'text/html')

        // add events
        const completeButton = newTaskElement.querySelector('.todo__task-complete')
        completeButton.addEventListener('click', (e) => completeTask(e))
        const deleteButton = newTaskElement.querySelector('.todo__task-delete')
        deleteButton.addEventListener('click', (e) => deleteTask(e))
        const editButton = newTaskElement.querySelector('.todo__task-text')
        editButton.addEventListener('click', (e) => editTask(e))
        taskList.appendChild(newTaskElement.body.lastChild)

        // update task list in localStorage
        localStorage.setItem('tasks', taskList.innerHTML)
    }

    // check body if need to show scroll button
    checkBody()
}

function completeTask(e) {
    let taskList = document.querySelector('.todo__task-list')
    let taskElement = e.target.parentElement.parentElement
    let taskTextElement = taskElement.querySelector('.todo__task-text')
    if (!taskElement.dataset.completed) {
        taskTextElement.innerHTML = `<strike>${taskTextElement.innerHTML}</strike>`
        taskElement.style.backgroundColor = "rgba(0, 0, 0, 0.2)"
        taskElement.dataset.completed = 'true'
    } else {
        taskTextElement.innerHTML = taskTextElement.textContent
        taskElement.style.backgroundColor = "white"
        taskElement.dataset.completed = ''
    }
    localStorage.setItem('tasks', taskList.innerHTML)
}

function deleteTask(e) {
    let taskList = document.querySelector('.todo__task-list')
    // get current task
    let taskElement = e.target.parentElement.parentElement
    taskElement.remove()

    // update task list in localStorage
    localStorage.setItem('tasks', taskList.innerHTML)

    // check body if need to show scroll button
    checkBody()
}

function editTask(e) {
    // get current task
    let taskElement = e.target.parentElement.parentElement
    let taskTextElement = taskElement.querySelector('.todo__task-text')
    let infoBlock = taskElement.querySelector('.todo__task-info')
    let taskText = taskTextElement.textContent
    infoBlock.lastChild.removeEventListener('click', () => {})
    // change paragraph to edit input
    infoBlock.innerHTML = `<input class="todo__task-edit" type="text" value="${taskText.trim()}">`
    infoBlock.lastChild.addEventListener('focus', (e) => {
        e.target.selectionStart = e.target.selectionEnd = e.target.value.length
    })
    infoBlock.lastChild.focus()
    infoBlock.lastChild.addEventListener('blur', (e) => handleEditEnd(e))

    // check body if need to show scroll button
    checkBody()
}

function handleEditEnd(e) {
    let taskList = document.querySelector('.todo__task-list')
    // get current task
    let taskElement = e.target.parentElement.parentElement
    let infoBlock = taskElement.querySelector('.todo__task-info')
    // get new value
    let taskText = infoBlock.lastChild.value
    // remove listener from edit input
    infoBlock.lastChild.removeEventListener('blur', () => {})
    // change edit input to paragraph with new text
    infoBlock.innerHTML = `<p class="todo__task-text">${taskText}</p>`
    infoBlock.lastChild.addEventListener('click', (e) => editTask(e))

    // update task list in localStorage
    localStorage.setItem('tasks', taskList.innerHTML)

    // check body if need to show scroll button
    checkBody()
}


document.addEventListener('DOMContentLoaded', () => {
    let todoBody = document.querySelector('.todo__body')
    todoBody.addEventListener('scroll', (e) => {
        let scrollVisualizer = document.querySelector('.scroll-visualizer')
        if (e.target.scrollHeight - e.target.scrollTop === e.target.clientHeight) {
            scrollVisualizer.classList.remove('active')
        } else {
            if (!scrollVisualizer.classList.contains('active')) {
                scrollVisualizer.classList.add('active')
            }
        }
    })
    // focus input on load
    let taskTextInput = document.querySelector('.todo__input').focus()
    let scrollVisualizer = document.querySelector('.scroll-visualizer')
    // add scroll event on click scroll button
    scrollVisualizer.addEventListener('click', (e) => {
        e.target.parentElement.scrollTo({
            behavior: 'smooth',
            top: e.target.parentElement.scrollHeight
        })
        e.target.classList.remove('active')
    })

    // check if user have tasks in localStorage
    if (localStorage.getItem('tasks')) {
        let taskList = document.querySelector('.todo__task-list')
        const parser = new DOMParser()
        let taskElements = parser.parseFromString(localStorage.getItem('tasks'), 'text/html')
        taskList.innerHTML = taskElements.body.innerHTML
        let completeButtons = document.querySelectorAll('.todo__task-complete')
        completeButtons.forEach(btn => btn.addEventListener('click', (e) => completeTask(e)))
        let deleteButtons = document.querySelectorAll('.todo__task-delete')
        deleteButtons.forEach(btn => btn.addEventListener('click', (e) => deleteTask(e)))
        let editButtons = document.querySelectorAll('.todo__task-text')
        editButtons.forEach(btn => btn.addEventListener('click', (e) => editTask(e)))
    }
    // check body if need to show scroll button
    checkBody()

    // listen keydown events
    document.addEventListener('keydown', (e) => {
        let taskEdit = document.querySelector('.todo__task-edit')
        if (e.key === 'Enter') {
            // check if user focus in task edit field
            if (taskEdit !== document.activeElement) {
                addTask()
            } else {
                taskEdit.blur()
            }
        } else {
            // check if user focus in task edit field
            if (taskEdit !== document.activeElement) {
                // change user focus on task add field if he start writing
                let taskTextInput = document.querySelector('.todo__input').focus()
            }
        }
    })

    let addTaskButton = document.querySelector('.add-task-btn')
    addTaskButton.addEventListener('click', addTask)
})