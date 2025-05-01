<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use App\Http\Resources\CategoryResource;
use Illuminate\Support\Facades\Cache;

class CategoryController extends Controller
{

    public function index()
    {
    // Keširaj kategorije na 60 minuta (3600 sekundi)
    $categories = Cache::remember('categories_cache', 60 * 60, function () {
        return Category::all();
    });

    return response()->json(CategoryResource::collection($categories), 200);
    }


    public function show($id)
    {
        $category = Category::findOrFail($id);
        return response()->json(new CategoryResource($category), 200);
    }


    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $category = Category::create($request->all());

        Cache::forget('categories_cache');
        return response()->json(new CategoryResource($category), 201);
    }


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

        Cache::forget('categories_cache');

        return response()->json(new CategoryResource($category), 200);
    }


    public function destroy($id)
    {
        $category = Category::findOrFail($id);
        $category->delete();

        Cache::forget('categories_cache');

        return response()->json(['message' => 'Category deleted successfully.'], 200);
    }
}
