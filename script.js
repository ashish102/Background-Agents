const todoInput = document.getElementById('todoInput');
const addBtn = document.getElementById('addBtn');
const todoList = document.getElementById('todoList');
const emptyMessage = document.getElementById('emptyMessage');
const themeToggle = document.getElementById('themeToggle');
const totalCount = document.getElementById('totalCount');
const activeCount = document.getElementById('activeCount');
const completedCount = document.getElementById('completedCount');

// Load todos from localStorage
let todos = JSON.parse(localStorage.getItem('todos')) || [];

// Load theme preference from localStorage
const savedTheme = localStorage.getItem('theme') || 'light';
applyTheme(savedTheme);

// Render todos on page load
renderTodos();

// Add todo on button click
addBtn.addEventListener('click', addTodo);

// Add todo on Enter key
todoInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        addTodo();
    }
});

function addTodo() {
    const text = todoInput.value.trim();
    
    if (text === '') {
        todoInput.classList.add('shake');
        todoInput.addEventListener('animationend', () => todoInput.classList.remove('shake'), { once: true });
        return;
    }

    const todo = {
        id: Date.now(),
        text: text,
        completed: false
    };

    todos.push(todo);
    saveTodos();
    renderTodos();
    todoInput.value = '';
    todoInput.focus();
}

function deleteTodo(id, listItem) {
    listItem.classList.add('removing');
    listItem.addEventListener('transitionend', () => {
        todos = todos.filter(todo => todo.id !== id);
        saveTodos();
        renderTodos();
    }, { once: true });
}

function toggleComplete(id) {
    todos = todos.map(todo => 
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
    );
    saveTodos();
    renderTodos();
}

function renderTodos() {
    todoList.innerHTML = '';

    if (todos.length === 0) {
        emptyMessage.classList.remove('hidden');
    } else {
        emptyMessage.classList.add('hidden');
    }

    updateTaskTracker();

    todos.forEach(todo => {
        const li = document.createElement('li');
        li.className = `todo-item ${todo.completed ? 'completed' : ''}`;
        
        li.innerHTML = `
            <div class="todo-checkbox" role="checkbox" aria-checked="${todo.completed}" tabindex="0" aria-label="Mark as ${todo.completed ? 'incomplete' : 'complete'}">${todo.completed ? '✓' : ''}</div>
            <span class="todo-text">${escapeHtml(todo.text)}</span>
            <button class="delete-btn" aria-label="Delete todo">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"/></svg>
            </button>
        `;

        const checkbox = li.querySelector('.todo-checkbox');
        checkbox.addEventListener('click', () => toggleComplete(todo.id));
        checkbox.addEventListener('keypress', (e) => {
            if (e.key === 'Enter' || e.key === ' ') toggleComplete(todo.id);
        });

        li.querySelector('.todo-text').addEventListener('click', () => toggleComplete(todo.id));

        li.querySelector('.delete-btn').addEventListener('click', () => deleteTodo(todo.id, li));

        todoList.appendChild(li);
    });
}

function bumpCount(el) {
    el.classList.remove('bump');
    // Reading offsetWidth triggers a synchronous browser reflow,
    // which is necessary so the removed class is flushed before re-adding it,
    // allowing the CSS animation to restart from scratch.
    // eslint-disable-next-line no-unused-expressions
    el.offsetWidth;
    el.classList.add('bump');
}

function updateTaskTracker() {
    const total = todos.length;
    const completed = todos.filter(todo => todo.completed).length;
    const active = total - completed;

    if (totalCount.textContent !== String(total)) {
        totalCount.textContent = total;
        bumpCount(totalCount);
    }
    if (activeCount.textContent !== String(active)) {
        activeCount.textContent = active;
        bumpCount(activeCount);
    }
    if (completedCount.textContent !== String(completed)) {
        completedCount.textContent = completed;
        bumpCount(completedCount);
    }
}

function saveTodos() {
    localStorage.setItem('todos', JSON.stringify(todos));
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Theme toggle functionality
themeToggle.addEventListener('click', () => {
    const currentTheme = document.body.classList.contains('dark-theme') ? 'dark' : 'light';
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    applyTheme(newTheme);
    localStorage.setItem('theme', newTheme);
});

function applyTheme(theme) {
    const themeIcon = document.querySelector('.theme-icon');
    
    if (theme === 'dark') {
        document.body.classList.add('dark-theme');
        themeIcon.textContent = '☀️';
    } else {
        document.body.classList.remove('dark-theme');
        themeIcon.textContent = '🌙';
    }
}
