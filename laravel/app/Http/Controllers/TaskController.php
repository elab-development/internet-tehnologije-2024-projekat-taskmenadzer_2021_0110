<?php

namespace App\Http\Controllers;

use App\Models\Task;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use App\Http\Resources\TaskResource;
use App\Mail\TaskNotificationMail;
use App\Models\Category;
use App\Models\TaskFile;
use App\Models\User;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Storage;

class TaskController extends Controller
{

    public function index(Request $request)
    {
        $query = Task::query();

        $query->with('files');

        // Filtriranje po naslovu (title)
        if ($request->has('title')) {
            $query->where('title', 'like', '%' . $request->input('title') . '%');
        }

        // Filtriranje po statusu
        if ($request->filled('status')) {
            $query->where('status', $request->input('status'));
        }

        // Filtriranje po kategoriji (category_id)
        if ($request->filled('category_id')) {
            $query->where('category_id', $request->input('category_id'));
        }

        if ($request->has('month') && $request->has('year')) {
            $query->whereYear('deadline', $request->input('year'))
                  ->whereMonth('deadline', $request->input('month'));
        }

        // Dodavanje paginacije
        $tasks = $query->paginate($request->input('per_page', 10)); // Default 10 stavki po stranici

        return TaskResource::collection($tasks);
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

        Mail::to(User::find($task->assigned_to)->email)->send(new TaskNotificationMail(
            "Novi zadatak: {$task->title}",
            "Dodeljen vam je novi zadatak: {$task->title}. Opis: {$task->description}."
        ));
    
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

        // Čuvamo stare vrednosti pre ažuriranja
        $oldValues = $task->getOriginal();

        // Pronalazimo imena starih i novih korisnika
        $oldAssignedUser = User::find($oldValues['assigned_to']);
        $newAssignedUser = User::find($request->assigned_to);

        // Ažuriramo zadatak sa novim podacima
        $task->update($request->all());

        // Pronalazimo korisnika kome je zadatak dodeljen (ako postoji)
        $assignedUser = User::find($task->assigned_to);
        if (!$assignedUser) {
            return response()->json(['error' => 'Nema dodeljenog korisnika'], 404);
        }

        // Pravimo poruku sa izmenjenim poljima
        $changes = [];
        foreach ($request->all() as $key => $value) {
            if ($oldValues[$key] != $value) {
                if ($key === 'assigned_to') {
                    // Menjamo prikaz ID-a u imena korisnika
                    $oldName = $oldAssignedUser ? $oldAssignedUser->name : 'Nije dodeljeno';
                    $newName = $newAssignedUser ? $newAssignedUser->name : 'Nije dodeljeno';
                    $changes[] = "Dodeljeno korisniku: {$oldName} ➝ {$newName}";
                } else {
                    $changes[] = ucfirst(str_replace('_', ' ', $key)) . ": {$oldValues[$key]} ➝ {$value}";
                }
            }
        }

        if (empty($changes)) {
            return response()->json(new TaskResource($task), 200);
        }

        $message = "Zadatak '{$task->title}' je ažuriran.\n\nPromene:\n" . implode("\n", $changes);

        Mail::to($assignedUser->email)->send(new TaskNotificationMail(
            "Izmenjen zadatak: {$task->title}",
            $message
        ));

        return response()->json(new TaskResource($task), 200);
    }

    /**
     * Brisanje zadatka.
     */
    public function destroy($id)
    {
        $task = Task::findOrFail($id);
        $task->delete();

        Mail::to(User::find($task->assigned_to)->email)->send(new TaskNotificationMail(
            "Obrisan zadatak: {$task->title}",
            "Zadatak '{$task->title}' je obrisan."
        ));

        return response()->json(['message' => 'Task deleted successfully'], 200);
    }

    public function exportToPDF()
    {
        $tasks = Task::with('category')->get(); 
        $pdf = Pdf::loadView('tasks.pdf', ['tasks' => $tasks]);
        return $pdf->download('tasks.pdf');
    }

    public function dodajFajl(Request $request,  $taskId)
    {
        $request->validate([
            'file' => 'required|file|mimes:jpg,jpeg,png,pdf,docx|max:2048',
        ]);
    
        $task = Task::findOrFail($taskId);
    
        if ($request->hasFile('file')) {
            $file = $request->file('file');
            $path = $file->store('uploads', 'public');
    
            $taskFile = TaskFile::create([
                'task_id' => $task->id,
                'file_path' => $path,
                'file_name' => $file->getClientOriginalName(),
            ]);

            Mail::to(User::find($task->assigned_to)->email)->send(new TaskNotificationMail(
                "Novi fajl za zadatak: {$task->title}",
                "Dodat je novi fajl '{$file->getClientOriginalName()}' za zadatak '{$task->title}'."
            ));
    
            return response()->json([
                'message' => 'Fajl uspešno otpremljen i povezan sa zadatkom!',
                'file' => $taskFile,
            ], 201);
        }
    
        return response()->json(['message' => 'Fajl nije otpremljen.'], 400);
    }

    public function getTasksByStatus()
    {
        return response()->json(
            Task::selectRaw('status, COUNT(*) as count')
                ->groupBy('status')
                ->get()
        );
    }

    public function getTasksByCategory()
    {
        return response()->json(
            Category::withCount('tasks')->get()
        );
    }

    public function getFilesPerTask()
    {
        return response()->json(
            Task::withCount('files')->get()
        );
    }
}