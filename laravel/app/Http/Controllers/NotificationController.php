<?php

namespace App\Http\Controllers;

use App\Models\Notification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use App\Http\Resources\NotificationResource;

class NotificationController extends Controller
{
    /**
     * Prikaz svih notifikacija.
     */
    public function index()
    {
        $notifications = Notification::all();
        return response()->json(NotificationResource::collection($notifications), 200);
    }

    /**
     * Prikaz jedne notifikacije prema ID-u.
     */
    public function show($id)
    {
        $notification = Notification::findOrFail($id);
        return response()->json(new NotificationResource($notification), 200);
    }

    /**
     * Kreiranje nove notifikacije.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'type' => 'required|string|max:255',
            'message' => 'required|string',
            'user_id' => 'required|exists:users,id',
            'task_id' => 'nullable|exists:tasks,id',
            'is_read' => 'nullable|boolean',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $notification = Notification::create($request->all());
        return response()->json(new NotificationResource($notification), 201);
    }

    /**
     * Ažuriranje postojeće notifikacije.
     */
    public function update(Request $request, $id)
    {
        $notification = Notification::findOrFail($id);

        $validator = Validator::make($request->all(), [
            'type' => 'sometimes|required|string|max:255',
            'message' => 'sometimes|required|string',
            'user_id' => 'sometimes|required|exists:users,id',
            'task_id' => 'nullable|exists:tasks,id',
            'is_read' => 'nullable|boolean',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $notification->update($request->all());
        return response()->json(new NotificationResource($notification), 200);
    }

    /**
     * Brisanje notifikacije prema ID-u.
     */
    public function destroy($id)
    {
        $notification = Notification::findOrFail($id);
        $notification->delete();

        return response()->json(['message' => 'Notification deleted successfully.'], 200);
    }
}
