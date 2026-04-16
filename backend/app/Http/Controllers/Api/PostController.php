<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Post;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class PostController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $query = Post::with('tags')
            ->whereNotNull('published_at')
            ->where('published_at', '<=', now())
            ->orderByDesc('published_at');

        if ($request->filled('tag')) {
            $query->whereHas('tags', fn($q) => $q->where('slug', $request->tag));
        }

        return response()->json($query->get());
    }

    public function show(string $slug): JsonResponse
    {
        $post = Post::with('tags')
            ->whereNotNull('published_at')
            ->where('published_at', '<=', now())
            ->where('slug', $slug)
            ->firstOrFail();

        return response()->json($post);
    }

    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'body' => 'required|string',
            'slug' => 'nullable|string|unique:posts,slug',
            'published_at' => 'nullable|date',
            'tag_ids' => 'nullable|array',
            'tag_ids.*' => 'exists:tags,id',
        ]);

        $validated['slug'] = $validated['slug'] ?? Str::slug($validated['title']);

        $post = Post::create($validated);

        if (!empty($validated['tag_ids'])) {
            $post->tags()->attach($validated['tag_ids']);
        }

        return response()->json($post->load('tags'), 201);
    }

    public function update(Request $request, int $id): JsonResponse
    {
        $post = Post::findOrFail($id);

        $validated = $request->validate([
            'title' => 'sometimes|string|max:255',
            'body' => 'sometimes|string',
            'slug' => 'sometimes|string|unique:posts,slug,' . $id,
            'published_at' => 'nullable|date',
            'tag_ids' => 'nullable|array',
            'tag_ids.*' => 'exists:tags,id',
        ]);

        $post->update($validated);

        if (array_key_exists('tag_ids', $validated)) {
            $post->tags()->sync($validated['tag_ids'] ?? []);
        }

        return response()->json($post->load('tags'));
    }

    public function destroy(int $id): JsonResponse
    {
        Post::findOrFail($id)->delete();

        return response()->json(['message' => '記事を削除しました。']);
    }
}
