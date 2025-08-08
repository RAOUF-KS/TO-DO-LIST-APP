document.addEventListener('DOMContentLoaded', () => {
    const taskInput = document.getElementById('tsk-input'); // matches HTML id
    const addTaskBtn = document.getElementById('add-task'); // matches HTML id
    const taskList = document.getElementById('task-list');
    const todosContainer = document.querySelector('.todos-container'); // FIXED: added dot for class selector
   const progressBar = document.getElementById('progress');
   const progressNumber =document.getElementById('numbers');

    const toggleEmptyState = () => {
        todosContainer.style.width = taskList.children.length > 0 ? '100%' : '50%';
    };

    const updateProgress = (checkCompletion = true)=>{
      const totalTasks = taskList.children.length;
            const completedTasks = taskList.querySelectorAll('.checkbox:checked').length;
            progressBar.style.width =totalTasks ? `${(completedTasks / totalTasks) *100}%` :
            '0%';
            progressNumber.textContent = ` ${ completedTasks} / ${totalTasks}`;

            if(checkCompletion && totalTasks > 0 && completedTasks ===totalTasks){
                Confetti();
            }
    };

    const saveTasksToLocalStorage =() =>{
        const tasks = Array.from(taskList.querySelectorAll('li')).map(li => ({
            text: li.querySelector('span').textContent,
            completed: li.querySelector('.checkbox').checked
        }));
        localStorage.setItem('tasks', JSON.stringify(tasks));

    };
    const loadTasksFromLocalStorage = () => {
        const saveTasks = JSON.parse(localStorage.getItem('tasks')) || [];
        saveTasks.forEach(({ text, completed}) => addTask(text, completed, false)); // FIXED: added checkCompletion parameter
        toggleEmptyState();
        updateProgress(false); // FIXED: update progress after loading tasks
    }

    const addTask = (text, completed = false , checkCompletion = true) => {
        const taskText = text || taskInput.value.trim();
        if (!taskText) {
            return;
        }
        const li = document.createElement('li');
        li.innerHTML = `
            <input type="checkbox" class="checkbox" ${completed ? 'checked' : ''} />
            <span>${taskText}</span>
            <div class="task-buttons">
                <button class="edit-btn"><i class="fa-solid fa-pen"></i></button>
                <button class="delete-btn"><i class="fa-solid fa-trash"></i></button>
            </div>
        `;
        const checkbox = li.querySelector('.checkbox'); // FIXED: typo checbox -> checkbox
        const editBtn = li.querySelector('.edit-btn');
        if (completed) {
            li.classList.add('completed');
            editBtn.disabled = true;
            editBtn.style.opacity = '0.5'; // FIXED: style property
            editBtn.style.pointerEvents = 'none';
        }

        checkbox.addEventListener('change', () => {
            const isChecked = checkbox.checked;
            li.classList.toggle('completed', isChecked); // FIXED: toggle only 'completed'
            editBtn.disabled = isChecked;
            editBtn.style.opacity = isChecked ? '0.5' : '1';
            editBtn.style.pointerEvents = isChecked ? 'none' : 'auto';
             updateProgress();
             saveTasksToLocalStorage();
        });

        editBtn.addEventListener('click', () => {
            if (!checkbox.checked) {
                taskInput.value = li.querySelector('span').textContent;
                li.remove();
                toggleEmptyState();
                 updateProgress(false);
                              saveTasksToLocalStorage();

            }
        });

        li.querySelector('.delete-btn').addEventListener('click', () => {
            li.remove();
            toggleEmptyState();
             updateProgress();
            saveTasksToLocalStorage();

        });

        taskList.appendChild(li);
        taskInput.value = '';
        toggleEmptyState(); // update state after adding
        updateProgress(checkCompletion);
                     saveTasksToLocalStorage();


    };

    addTaskBtn.addEventListener('click', (e) => {
        e.preventDefault();
        addTask();
    });

    taskInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            addTask();
        }
    });
    loadTasksFromLocalStorage();
});

const Confetti = () => {
    const count = 200,
  defaults = {
    origin: { y: 0.7 },
  };

function fire(particleRatio, opts) {
  confetti(
    Object.assign({}, defaults, opts, {
      particleCount: Math.floor(count * particleRatio),
    })
  );
}

fire(0.25, {
  spread: 26,
  startVelocity: 55,
});

fire(0.2, {
  spread: 60,
});

fire(0.35, {
  spread: 100,
  decay: 0.91,
  scalar: 0.8,
});

fire(0.1, {
  spread: 120,
  startVelocity: 25,
  decay: 0.92,
  scalar: 1.2,
});

fire(0.1, {
  spread: 120,
  startVelocity: 45,
});
};