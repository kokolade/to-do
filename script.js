document.addEventListener('DOMContentLoaded', () => {
    const [form, input, error, list, empty, count, clear] =
        ['todo-form', 'todo-input', 'todo-error', 'todo-list', 'empty-message', 'todo-count', 'clear-completed']
            .map(id => document.getElementById(id));
    const filters = document.querySelectorAll('.filter');

    function load() {
        try {
            const saved = JSON.parse(localStorage.getItem('michael-todo-tasks'));
            return Array.isArray(saved) ? saved.filter(t => t && typeof t.text === 'string') : [];
        } catch (err) {
            return [];
        }
    }

    let tasks = load();
    let filter = 'all';

    function render() {
        try { localStorage.setItem('michael-todo-tasks', JSON.stringify(tasks)); } catch (err) {}
        const shown = tasks.filter(t => filter === 'all' || t.done === (filter === 'completed'));

        list.innerHTML = '';
        shown.forEach(t => {
            const li = document.createElement('li');
            li.className = 'todo-item' + (t.done ? ' done' : '');
            li.dataset.id = t.id;
            li.innerHTML = '<input type="checkbox"><span class="todo-text"></span><button class="delete-btn">\u00d7</button>';
            li.querySelector('input').checked = t.done;
            li.querySelector('span').textContent = t.text; // textContent keeps user input safe
            list.append(li);
        });

        const left = tasks.filter(t => !t.done).length;
        count.textContent = `${left} ${left === 1 ? 'task' : 'tasks'} left`;
        clear.hidden = tasks.every(t => !t.done);
        empty.textContent = shown.length ? '' : {
            all: 'No tasks yet. Add one above!',
            active: 'Nothing left to do. Nice work!',
            completed: 'No completed tasks yet.'
        }[filter];
    }

    form.addEventListener('submit', e => {
        e.preventDefault();
        const text = input.value.trim();
        error.textContent = text ? '' : 'Please type a task first.';
        if (!text) return;
        tasks.push({ id: Date.now(), text, done: false });
        input.value = '';
        input.focus();
        render();
    });

    input.addEventListener('input', () => error.textContent = '');

    list.addEventListener('click', e => {
        const id = +e.target.closest('li')?.dataset.id;
        if (!id) return;
        if (e.target.type === 'checkbox') {
            const task = tasks.find(t => t.id === id);
            task.done = !task.done;
        } else if (e.target.matches('.delete-btn')) {
            tasks = tasks.filter(t => t.id !== id);
        } else return;
        render();
    });

    filters.forEach(btn => btn.addEventListener('click', () => {
        filter = btn.dataset.filter;
        filters.forEach(b => b.classList.toggle('active', b === btn));
        render();
    }));

    clear.addEventListener('click', () => {
        tasks = tasks.filter(t => !t.done);
        render();
    });

    render();
});
