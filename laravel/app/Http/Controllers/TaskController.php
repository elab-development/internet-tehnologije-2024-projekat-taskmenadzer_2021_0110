<?php

namespace App\Http\Controllers;

use App\Models\Task;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use App\Http\Resources\TaskResource;

class TaskController extends Controller
{
 /**
     * Prikaz liste zadataka sa paginacijom i filtriranjem.
     */
    public function index(Request $request)
    {
        $query = Task::query();

        // Filtriranje po naslovu (title)
        if ($request->has('title')) {
            $query->where('title', 'like', '%' . $request->input('title') . '%');
        }

        // Filtriranje po statusu
        if ($request->has('status')) {
            $query->where('status', $request->input('status'));
        }

        // Filtriranje po kategoriji (category_id)
        if ($request->has('category_id')) {
            $query->where('category_id', $request->input('category_id'));
        }

        // Dodavanje paginacije
        $tasks = $query->paginate($request->input('per_page', 10)); // Default 10 stavki po stranici

        return response()->json($tasks);
    }

    /**
     * Prikaz pojedinačnog zadatka.
     */
    public function show($id)
    {
        $task = Task::findOrFail($id);
        return response()->json(new TaskResource($task), 200);
    }

    /**
     * Kreiranje novog zadatka.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'status' => 'required|in:pending,in_progress,completed',
            'deadline' => 'nullable|date',
            'category_id' => 'required|exists:categories,id',
            'assigned_to' => 'required|exists:users,id', // ID korisnika mora biti prosleđen i mora postojati
        ]);
    
        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }
    
        // Kreiranje zadatka sa prosleđenim podacima
        $task = Task::create($request->all());
    
        return response()->json(new TaskResource($task), 201);
    }

    /**
     * Ažuriranje zadatka.
     */
    public function update(Request $request, $id)
    {
        $task = Task::findOrFail($id);

        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'status' => 'required|in:pending,in_progress,completed',
            'deadline' => 'nullable|date',
            'category_id' => 'required|exists:categories,id',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $task->update($request->all());

        return response()->json(new TaskResource($task), 200);
    }

    /**
     * Brisanje zadatka.
     */
    public function destroy($id)
    {
        $task = Task::findOrFail($id);
        $task->delete();

        return response()->json(['message' => 'Task deleted successfully'], 200);
    }
}