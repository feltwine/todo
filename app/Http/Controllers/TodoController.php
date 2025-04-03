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
        $todos = Todo::paginate(
            perPage: 30,
            page: 1,
        );
        return view('todo.index', compact('todos'));
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return view('todo.create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        Todo::create([
            'title' => $request->title,
            'description' => $request->description,
            'completed' => false,
        ]);

       return redirect()->route('todo.index');
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Todo $todo)
    {
        return view('todo.edit', compact('todo'));
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Todo $todo)
    {
        $todo->update([
            'title' => $request->title ?? $todo->title,
            'description' => $request->description ?? $todo->description
        ]);

        return redirect()->route('todo.index');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Todo $todo)
    {
        $this->destroy($todo);
        return redirect()->back();
    }
}
