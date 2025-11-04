document.addEventListener('DOMContentLoaded', function() {
    const taskInput = document.getElementById('taskInput');
    const addTaskBtn = document.getElementById('addTaskBtn');
    const taskList = document.getElementById('taskList');

    // Load tasks from localStorage
    loadTasks();

    // Add task event listener
    addTaskBtn.addEventListener('click', addTask);
    taskInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            addTask();
        }
    });

    function addTask() {
        const taskText = taskInput.value.trim();
        if (taskText === '') return;

        const taskItem = createTaskElement(taskText, false);
        taskList.appendChild(taskItem);
        taskInput.value = '';

        saveTasks();
    }

    function createTaskElement(text, completed) {
        const li = document.createElement('li');
        li.className = 'task-item';

        const span = document.createElement('span');
        span.className = 'task-text';
        span.textContent = text;
        if (completed) {
            span.classList.add('completed');
        }

        const completeBtn = document.createElement('button');
        completeBtn.className = 'task-btn complete-btn';
        completeBtn.textContent = completed ? 'Undo' : 'Complete';
        completeBtn.addEventListener('click', function() {
            toggleComplete(span, completeBtn);
        });

        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'task-btn delete-btn';
        deleteBtn.textContent = 'Delete';
        deleteBtn.addEventListener('click', function() {
            li.remove();
            saveTasks();
        });

        li.appendChild(span);
        li.appendChild(completeBtn);
        li.appendChild(deleteBtn);

        return li;
    }

    function toggleComplete(span, button) {
        span.classList.toggle('completed');
        button.textContent = span.classList.contains('completed') ? 'Undo' : 'Complete';
        saveTasks();
    }

    function saveTasks() {
        const tasks = [];
        const taskItems = taskList.querySelectorAll('.task-item');
        taskItems.forEach(item => {
            const text = item.querySelector('.task-text').textContent;
            const completed = item.querySelector('.task-text').classList.contains('completed');
            tasks.push({ text, completed });
        });
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    function loadTasks() {
        const tasks = JSON.parse(localStorage.getItem('tasks') || '[]');
        tasks.forEach(task => {
            const taskItem = createTaskElement(task.text, task.completed);
            taskList.appendChild(taskItem);
        });
    }
});