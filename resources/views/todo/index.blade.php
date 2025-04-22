<!doctype html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport"
          content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <meta name="csrf-token" content="{{ csrf_token() }}">
    @vite(['resources/css/app.css', 'resources/js/app.js'])

    <title>Todo-app</title>
</head>
<body class="h-screen w-screen bg-gray-800">
<div class="w-full h-full flex flex-col place-items-center">
    <div class="search-container">
        <div class="w-full flex place-content-center items-center">
            <input type="text" placeholder="Search..."
                   class="w-2/5 h-9 text-gray-100 font-medium pl-5 rounded-full bg-gray-700">
        </div>
        <div class="adjust-results w-full bg-gray-700 rounded-3xl">

        </div>
    </div>

    <div class="todos-container w-1/2 bg-gray-700 rounded-3xl flex items-center">
        <ul>
            @foreach($todos as $todo)
                <div class="todo-item h-fit my-4 bg-gray-800 mx-4 px-4 pt-3 pb-5 rounded-2xl todo-item"
                     data-id="{{ $todo->id }}"
                     data-completed="{{ $todo->completed ? 'true' : 'false' }}">
                    <h2 class="todo-title font-sans font-bold text-gray-100 mx-6">{{ $todo->title }}</h2>
                    <input type="text" class="update-title hidden w-full rounded px-2 py-1 bg-gray-700 text-gray-100"
                           value="{{ $todo->title }}">

                    <div class="flex flex-row justify-between items-center mt-2">
                        <p class="todo-description font-sans text-gray-100 max-w-4/5">{{ $todo->description }}</p>
                        <textarea
                            class="update-description hidden w-full rounded px-2 py-1 bg-gray-700 text-gray-100">{{ $todo->description }}</textarea>

                        <div class="flex flex-row h-full">
                            <div class="action-button edit-button mx-1">
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                     stroke-width="1.5" stroke="currentColor" class="size-6 text-gray-100">
                                    <path stroke-linecap="round" stroke-linejoin="round"
                                          d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"/>
                                </svg>
                            </div>
                            <div class="action-button complete-button mx-1 {{ $todo->completed ? 'bg-[#10b981]' : 'bg-gray-700' }} hover:bg-[#10b981]">
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
            @endforeach
        </ul>
    </div>
    <div class="py-7">
        {{ $todos->links() }}
    </div>
</div>

<!-- Fixed Add Todo Button in bottom left corner -->
<button id="new-todo-btn" class="fixed right-8 bottom-8 bg-blue-600 hover:bg-blue-700 text-gray-100 font-medium p-4 rounded-full shadow-lg flex items-center justify-center z-10 transition-all duration-300 hover:scale-105">
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5"
         stroke="currentColor" class="size-6">
        <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
    </svg>
</button>

<!-- Add Todo Modal -->
<div id="add-todo-modal" class="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center hidden z-50">
    <div class="bg-gray-800 rounded-lg p-6 w-1/3 max-w-md">
        <div class="flex justify-between items-center mb-4">
            <h3 class="text-xl font-bold text-gray-100">Add New Todo</h3>
            <button id="close-modal" class="text-gray-400 hover:text-gray-100">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                     stroke-width="1.5" stroke="currentColor" class="size-6">
                    <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12"/>
                </svg>
            </button>
        </div>

        <form id="add-todo-form">
            <div class="mb-4">
                <label for="title" class="block text-gray-300 mb-2">Title</label>
                <input type="text" id="title" name="title" class="w-full bg-gray-700 text-gray-100 border border-gray-600 rounded py-2 px-3">
            </div>

            <div class="mb-4">
                <label for="description" class="block text-gray-300 mb-2">Description</label>
                <textarea id="description" name="description" rows="4" class="w-full bg-gray-700 text-gray-100 border border-gray-600 rounded py-2 px-3"></textarea>
            </div>

            <div class="flex justify-end">
                <button type="button" id="cancel-add" class="bg-gray-600 hover:bg-gray-700 text-white font-medium py-2 px-4 rounded mr-2">
                    Cancel
                </button>
                <button type="submit" class="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded">
                    Add Todo
                </button>
            </div>
        </form>
    </div>
</div>
</body>
</html>
