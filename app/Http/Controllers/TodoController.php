<?php

namespace App\Http\Controllers;

use App\Models\Todo;
use Illuminate\Http\Request;

class TodoController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $todos = Todo::query()
            ->orderByDesc('id')
            ->paginate(20); // No need to specify `page: 0`


        return view('todo.index', ['todos' => $todos]);
    }

    /**
     * Store a newly created resource in storage.
     */

    public function store(Request $request)
    {
        // Validate input
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
        ]);

        // Create new todo
        $todo = new Todo();
        $todo->title = $validated['title'];
        $todo->description = $validated['description'] ?? '';
        $todo->completed = false;
        $todo->save();

        // Return JSON response
        return response()->json($todo);
    }


/**
 * Update the specified resource in storage.
 */
public
function update(Request $request, $id)
{
    $todo = Todo::findOrFail($id);

    $validatedData = $request->validate([
        'title' => 'sometimes|required|string',
        'description' => 'sometimes|required|string',
        'completed' => 'sometimes|boolean',
    ]);

    $todo->update($validatedData);

    return response()->json([
        'success' => true,
        'todo' => $todo
    ]);
}

/**
 * Remove the specified resource from storage.
 */
public
function destroy(Todo $todo)
{
    $todo->delete();
    return response()->json([
        'success' => true,
        'message' => 'Todo deleted successfully'
    ]);
}
}
