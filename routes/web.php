<?php

use App\Http\Controllers\TodoController;
use Illuminate\Support\Facades\Route;

Route::controller(TodoController::class)->group(function() {
    Route::get('/', 'index')->name('index');
    Route::put('/todos/{id}', 'update')->name('todos.update');
    Route::delete('/todos/{todo}', 'destroy')->name('todos.destroy');
    Route::post('/todos', 'store');
});
