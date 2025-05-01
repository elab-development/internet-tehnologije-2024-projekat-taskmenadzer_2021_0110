<?php

namespace App\Http\Resources;

use Illuminate\Http\Resources\Json\JsonResource;

class TaskResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     */
    public function toArray($request)
    {
        return [
            'id' => $this->id,
            'title' => $this->title,
            'description' => $this->description,
            'status' => $this->status,
            'deadline' => $this->deadline,
            'category_id' => $this->category_id,
            'user_id' => $this->user->id,
            'category' => $this->category ? $this->category->name : null,
            'assigned_to' => $this->user ? $this->user->name : null,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
            'files' => $this->files->map(function ($file) {
                return [
                    'id' => $file->id,
                    'file_name' => $file->file_name,
                    'file_path' => asset('storage/' . $file->file_path),
                ];
            }),
        ];
    }
}
