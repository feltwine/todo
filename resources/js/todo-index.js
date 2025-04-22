// Add this to your existing JavaScript file or create a new one
document.addEventListener('DOMContentLoaded', function () {
    // Modal elements
    const modal = document.getElementById('add-todo-modal');
    const openModalBtn = document.getElementById('new-todo-btn');
    const closeModalBtn = document.getElementById('close-modal');
    const cancelBtn = document.getElementById('cancel-add');
    const addTodoForm = document.getElementById('add-todo-form');

    // Open modal
    openModalBtn.addEventListener('click', function () {
        modal.classList.remove('hidden');
        // Reset form
        addTodoForm.reset();
    });

    // Close modal functions
    function closeModal() {
        modal.classList.add('hidden');
    }

    closeModalBtn.addEventListener('click', closeModal);
    cancelBtn.addEventListener('click', closeModal);

    // Close modal when clicking outside
    modal.addEventListener('click', function (e) {
        if (e.target === modal) {
            closeModal();
        }
    });

    // Handle form submission
    addTodoForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const title = document.getElementById('title').value;
        const description = document.getElementById('description').value;

        if (!title.trim()) {
            alert('Title is required!');
            return;
        }

        // Create form data
        const formData = new FormData();
        formData.append('title', title);
        formData.append('description', description);

        // Send AJAX request to create todo
        fetch('/todos', {
            method: 'POST',
            body: formData,
            headers: {
                'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content
            }
        })
            .then(response => {
                if (response.ok) {
                    return response.json();
                }
                throw new Error('Network response was not ok');
            })
            .then(data => {
                console.log('Todo created:', data);

                // Create new todo element
                const todosContainer = document.querySelector('.todos-container ul');
                const newTodoHtml = `
                <div class="todo-item h-fit my-4 bg-gray-800 mx-4 px-4 pt-3 pb-5 rounded-2xl todo-item"
                     data-id="${data.id}"
                     data-completed="false">
                    <h2 class="todo-title font-sans font-bold text-gray-100 mx-6">${data.title}</h2>
                    <input type="text" class="update-title hidden w-full rounded px-2 py-1 bg-gray-700 text-gray-100"
                           value="${data.title}">

                    <div class="flex flex-row justify-between items-center mt-2">
                        <p class="todo-description font-sans text-gray-100 max-w-4/5">${data.description}</p>
                        <textarea
                                class="update-description hidden w-full rounded px-2 py-1 bg-gray-700 text-gray-100">${data.description}</textarea>

                        <div class="flex flex-row h-full">
                            <div class="action-button edit-button mx-1">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                     stroke-width="1.5" stroke="currentColor" class="size-6 text-gray-100">
                                    <path stroke-linecap="round" stroke-linejoin="round"
                                          d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"/>
                                </svg>
                            </div>
                            <div class="action-button complete-button mx-1 bg-gray-700 hover:bg-[#10b981]">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                     stroke-width="1.5" stroke="currentColor" class="size-6 text-gray-100">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="m4.5 12.75 6 6 9-13.5"/>
                                </svg>
                            </div>
                            <div class="action-button delete-button mx-1">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                     stroke-width="1.5" stroke="currentColor" class="size-6 text-gray-100">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12"/>
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>
            `;

                // Add new todo to the list
                const tempDiv = document.createElement('div');
                tempDiv.innerHTML = newTodoHtml;
                todosContainer.prepend(tempDiv.firstElementChild);

                // Add event listeners to the new buttons
                const newTodoItem = todosContainer.firstElementChild;
                attachEventListeners(newTodoItem);

                // Close modal
                closeModal();
            })
            .catch(error => {
                console.error('Error creating todo:', error);
                alert('Failed to create todo. Please try again.');
            });
    });

    // Function to attach event listeners to new todo items
    document.querySelectorAll('.edit-button').forEach(button => {
        button.addEventListener('click', function () {
            let todoItem = this.closest('.todo-item');
            let title = todoItem.querySelector('.todo-title');
            let description = todoItem.querySelector('.todo-description');
            let updateTitle = todoItem.querySelector('.update-title');
            let updateDescription = todoItem.querySelector('.update-description');
            let editButton = this;

            // Toggle edit mode
            if (title.classList.contains('hidden')) {
                // We're already in edit mode, so save changes
                saveChanges(todoItem);
            } else {
                // Enter edit mode
                // Hide the current title and description
                title.classList.add('hidden');
                description.classList.add('hidden');

                // Show input fields
                updateTitle.classList.remove('hidden');
                updateDescription.classList.remove('hidden');

                // Change edit icon to save icon
                editButton.innerHTML = `
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                     stroke-width="1.5" stroke="currentColor" class="size-6 text-gray-100">
                    <path stroke-linecap="round" stroke-linejoin="round"
                          d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            `;
            }
        });
    });

    function saveChanges(todoItem) {
        const todoId = todoItem.dataset.id;
        const title = todoItem.querySelector('.todo-title');
        const description = todoItem.querySelector('.todo-description');
        const updateTitle = todoItem.querySelector('.update-title');
        const updateDescription = todoItem.querySelector('.update-description');
        const editButton = todoItem.querySelector('.edit-button');

        // Get updated values
        const newTitle = updateTitle.value;
        const newDescription = updateDescription.value;

        // Create form data for the request
        const formData = new FormData();
        formData.append('title', newTitle);
        formData.append('description', newDescription);
        formData.append('_method', 'PUT'); // For Laravel method spoofing

        // Send AJAX request to update the todo
        fetch(`/todos/${todoId}`, {
            method: 'POST',
            body: formData,
            headers: {
                'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content
            }
        })
            .then(response => {
                if (response.ok) {
                    return response.json();
                }
                throw new Error('Network response was not ok');
            })
            .then(data => {
                console.log(data)

                // Update the UI with new values
                title.textContent = newTitle;
                description.textContent = newDescription;

                // Hide input fields and show text elements
                updateTitle.classList.add('hidden');
                updateDescription.classList.add('hidden');
                title.classList.remove('hidden');
                description.classList.remove('hidden');

                // Reset edit button icon
                editButton.innerHTML = `
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                 stroke-width="1.5" stroke="currentColor" class="size-6 text-gray-100">
                <path stroke-linecap="round" stroke-linejoin="round"
                      d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"/>
            </svg>
        `;
            })
            .catch(error => {
                console.error('Error updating todo:', error);
                alert('Failed to update todo. Please try again.');
            })
    }

    document.querySelectorAll('.complete-button').forEach(button => {
        button.addEventListener('click', function () {
            console.log('Clicked complete button');

            let todoItem = this.closest('.todo-item');
            let todoId = todoItem.dataset.id;
            let todoCompleted = todoItem.dataset.completed === 'true';
            console.log('Raw todo completed status:', todoCompleted);

            let change = todoCompleted ? '0' : '1';
            console.log(change);
            let completeButton = this;


            // Create form data for the request
            const formData = new FormData();

            formData.append('completed', change);
            formData.append('_method', 'PUT');

            fetch(`/todos/${todoId}`, {
                method: 'POST',
                body: formData,
                headers: {
                    'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content
                }
            })
                .then(response => {
                    if (response.ok) {
                        return response.json();
                    }
                    throw new Error('Network response was not ok');
                })
                .then(data => {
                    console.log('Update successful:', data);

                    // Update the data attribute to reflect the new state
                    todoItem.dataset.completed = change === '1' ? "true" : "false";
                    completeButton.classList.remove('bg-[#10b981]', 'bg-gray-700');
                    completeButton.classList.add(change === '1' ? 'bg-[#10b981]' : 'bg-gray-700');
                    console.log(todoItem.dataset.completed)
                })
                .catch(error => {
                    console.error('Error updating todo:', error);
                });
        });
    });


    document.querySelectorAll('.delete-button').forEach(button => {
        button.addEventListener('click', function () {
            let todoItem = this.closest('.todo-item');
            let todoId = todoItem.dataset.id;

            // Ask for confirmation before deleting
            if (confirm('Are you sure you want to delete this todo item?')) {
                // Create form data for the request
                const formData = new FormData();
                formData.append('_method', 'DELETE'); // For Laravel method spoofing

                // Send AJAX request to delete the todo
                fetch(`/todos/${todoId}`, {
                    method: 'POST',
                    body: formData,
                    headers: {
                        'X-CSRF-TOKEN': document.querySelector('meta[name="csrf-token"]').content
                    }
                })
                    .then(response => {
                        if (response.ok) {
                            return response.json();
                        }
                        throw new Error('Network response was not ok');
                    })
                    .then(data => {
                        console.log('Delete successful:', data);

                        // Remove the todo item from the DOM with a fade-out effect
                        todoItem.style.opacity = '0';
                        todoItem.style.transition = 'opacity 0.5s ease';

                        // After the fade-out animation, remove the element
                        setTimeout(() => {
                            todoItem.remove();
                        }, 500);
                    })
                    .catch(error => {
                        console.error('Error deleting todo:', error);
                        alert('Failed to delete todo. Please try again.');
                    });
            }
        });
    });
});
