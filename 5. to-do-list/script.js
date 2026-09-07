document.addEventListener('DOMContentLoaded', () => {
    const taskInput = document.getElementById('task-input');
    const addTaskBtn = document.getElementById('add-task-btn');
    const taskList = document.getElementById('task-list');
    const emptyImage = document.querySelector('.empty');
    const todosContainer = document.querySelector('.todos-container');
    const progressBar = document.getElementById('progress');
    const progressNumber = document.getElementById('numbers');

    let tasks = [];

    const toggleEmptyState = () => {
        emptyImage.style.display = tasks.length === 0 ? 'block' : 'none';
        todosContainer.style.width = tasks.length > 0 ? '100%' : '50%';
    };

    const updateProgress = (checkCompletion = true) => {
        let totalTasks = tasks.length;
        let completedTasks = tasks.filter(t => t.completed).length;
        progressBar.style.width = totalTasks ? `${(completedTasks / totalTasks) * 100}%` : '0%';
        progressNumber.textContent = `${completedTasks} / ${totalTasks}`;
        
        if (checkCompletion && totalTasks > 0 && completedTasks === totalTasks) {
            triggerConfettiAnimation();
        }
    };
    
    const createTaskDOM = (taskObject) => {
        const li = document.createElement('li');
        li.setAttribute('data-id', taskObject.id); 
        
        li.innerHTML = `
            <input type="checkbox" class="checkbox" ${taskObject.completed ? 'checked' : ''}>
            <span class="task-text">${escapeHTML(taskObject.text)}</span>
            <div class="task-buttons">
                <button class="edit-btn" style="opacity: ${taskObject.completed ? '0.5' : '1'}">
                    <i class="fa-solid fa-pen-to-square"></i>
                </button>
                <button class="delete-btn" style="opacity: ${taskObject.completed ? '0.5' : '1'}">
                    <i class="fa-solid fa-trash"></i>
                </button>
            </div>
        `;

        const span = li.querySelector('.task-text');
        if (taskObject.completed) {
            span.style.textDecoration = 'line-through';
            span.style.color = 'gray';
        }

        const checkbox = li.querySelector('.checkbox');
        const editBtn = li.querySelector('.edit-btn');
        const deleteBtn = li.querySelector('.delete-btn');

        checkbox.addEventListener('change', () => {
            const currentTask = tasks.find(t => t.id === taskObject.id);
            if (!currentTask) return;

            currentTask.completed = checkbox.checked; 

            if (checkbox.checked) {
                span.style.textDecoration = 'line-through';
                span.style.color = 'gray';
                deleteBtn.style.opacity = '0.5';
                editBtn.style.opacity = '0.5';
            } else {
                span.style.textDecoration = 'none';
                span.style.color = ''; 
                deleteBtn.style.opacity = '1';
                editBtn.style.opacity = '1';
            }
            updateProgress();
        });

        editBtn.addEventListener('click', () => {
            if (!checkbox.checked) {
                taskInput.value = li.querySelector('.task-text').textContent;
                tasks = tasks.filter(t => t.id !== taskObject.id);
                li.remove();
                toggleEmptyState();
                updateProgress();
            }
        });

        deleteBtn.addEventListener('click', () => {
            if (!checkbox.checked) {
                tasks = tasks.filter(t => t.id !== taskObject.id);
                li.remove();  
                toggleEmptyState();
                updateProgress();
            }
        });
        
        taskList.appendChild(li);
        toggleEmptyState();
    };

    const addNewTask = () => {
        const taskText = taskInput.value.trim();
        if (!taskText) return;

        if (taskText.length > 100) {
            alert('Task text cannot exceed 100 characters.');
            return;
        }

        if (tasks.some(task => task.text === taskText)) {
            alert('Task already exists.');
            return;
        }

        if (taskText.length < 3) {
            alert('Task text must be at least 3 characters long.');
            return;
        }

        if (taskText.length == 0) {
            alert('Please enter a task');
            return;
        }

        const newTaskObj = { 
            id: Date.now().toString(), 
            text: taskText, 
            completed: false 
        };

        tasks.push(newTaskObj);
        createTaskDOM(newTaskObj); 
        updateProgress();
        taskInput.value = '';
    };

    function escapeHTML(str) {
        return str.replace(/[&<>'"]/g, 
            tag => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag] || tag)
        );
    }

    addTaskBtn.addEventListener('click', (e) => {
        e.preventDefault(); 
        addNewTask();
    });

    taskInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault(); 
            addNewTask();
        }
    });

    toggleEmptyState();
    updateProgress();
});

const triggerConfettiAnimation = () => {
    const count = 200;
    const defaults = { origin: { y: 0.7 } };

    function fire(particleRatio, opts) {
        confetti(Object.assign({}, defaults, opts, { particleCount: Math.floor(count * particleRatio) }));
    }

    fire(0.25, {
        spread: 26,
        startVelocity: 55
    });
    fire(0.2, { spread: 60 });
    fire(0.35, {
        spread: 100,
        decay: 0.91,
        scalar: 0.8
    });
    fire(0.1, {
        spread: 120,
        startVelocity: 25,
        decay: 0.92,
        scalar: 1.2
    });
    fire(0.1, {
        spread: 120,
        startVelocity: 45
    });
};
