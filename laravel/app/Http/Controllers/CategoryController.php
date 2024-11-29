<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use App\Http\Resources\CategoryResource;

class CategoryController extends Controller
{
    /**
     * Prikaz svih kategorija.
     */
    public function index()
    {
        $categories = Category::all();
        return response()->json(CategoryResource::collection($categories), 200);
    }

    /**
     * Prikaz jedne kategorije prema ID-u.
     */
    public function show($id)
    {
        $category = Category::findOrFail($id);
        return response()->json(new CategoryResource($category), 200);
    }

    /**
     * Kreiranje nove kategorije.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $category = Category::create($request->all());
        return response()->json(new CategoryResource($category), 201);
    }

    /**
     * Ažuriranje postojeće kategorije.
     */
    public function update(Request $request, $id)
    {
        $category = Category::findOrFail($id);

        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $category->update($request->all());
        return response()->json(new CategoryResource($category), 200);
    }

    /**
     * Brisanje kategorije prema ID-u.
     */
    public function destroy($id)
    {
        $category = Category::findOrFail($id);
        $category->delete();

        return response()->json(['message' => 'Category deleted successfully.'], 200);
    }
}
