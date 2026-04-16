<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Tag;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class TagController extends Controller
{
    public function index(): JsonResponse
    {
        return response()->json(Tag::orderBy('name')->get());
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:50|unique:tags,name',
            'slug' => 'nullable|string|unique:tags,slug',
        ]);

        $validated['slug'] = $validated['slug'] ?? Str::slug($validated['name']);

        $tag = Tag::create($validated);

        return response()->json($tag, 201);
    }

    public function destroy(int $id): JsonResponse
    {
        Tag::findOrFail($id)->delete();

        return response()->json(['message' => 'タグを削除しました。']);
    }
}
