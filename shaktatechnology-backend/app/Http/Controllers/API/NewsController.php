<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use App\Models\News;

class NewsController extends Controller
{
    /**
     * Format full image URL for API response.
     */
    private function formatImageUrl(?string $path): ?string
    {
        if (!$path) return null;

        $path = ltrim($path, '/');

        // If already full URL, return as-is
        if (str_starts_with($path, 'http')) {
            return $path;
        }

        // Return absolute public URL
        return asset('storage/' . $path);
    }

    /**
     * Display a paginated listing of news articles.
     */
    public function index(Request $request): JsonResponse
    {
        try {
            $limit = $request->input('limit', 10);
            $news = News::orderBy('created_at', 'desc')->paginate($limit);

            // Transform image URLs
            $news->getCollection()->transform(function ($item) {
                $item->image = $this->formatImageUrl($item->image);
                return $item;
            });

            return response()->json([
                'success' => true,
                'message' => 'News fetched successfully',
                'data' => $news->items(),
                'pagination' => [
                    'total' => $news->total(),
                    'per_page' => $news->perPage(),
                    'current_page' => $news->currentPage(),
                    'last_page' => $news->lastPage(),
                ],
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch news',
                'error' => config('app.debug') ? $e->getMessage() : null,
            ], 500);
        }
    }

    /**
     * Store a newly created news article.
     */
    public function store(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'title'       => 'required|string|max:255',
            'description' => 'required|string',
            'category'    => 'nullable|string|max:100',
            'author'      => 'nullable|string|max:100',
            'read_time'   => 'nullable|string|max:50',
            'featured'    => 'boolean',
            'date'        => 'nullable|date',
            'image'       => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors'  => $validator->errors(),
            ], 422);
        }

        try {
            $data = $request->except('image');

            if ($request->hasFile('image')) {
                $data['image'] = $request->file('image')->store('news', 'public');
            }

            $news = News::create($data);

            $news->image = $this->formatImageUrl($news->image);

            return response()->json([
                'success' => true,
                'message' => 'News article created successfully',
                'data'    => $news,
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to create news article',
                'error'   => config('app.debug') ? $e->getMessage() : null,
            ], 500);
        }
    }

    /**
     * Display a specific news article.
     */
    public function show($id): JsonResponse
    {
        try {
            $news = News::findOrFail($id);
            $news->image = $this->formatImageUrl($news->image);

            return response()->json([
                'success' => true,
                'data'    => $news,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'News not found',
                'error'   => config('app.debug') ? $e->getMessage() : null,
            ], 404);
        }
    }

    /**
     * Update an existing news article.
     */
    public function update(Request $request, $id): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'title'       => 'sometimes|required|string|max:255',
            'description' => 'sometimes|required|string',
            'category'    => 'nullable|string|max:100',
            'author'      => 'nullable|string|max:100',
            'read_time'   => 'nullable|string|max:50',
            'featured'    => 'boolean',
            'date'        => 'nullable|date',
            'image'       => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors'  => $validator->errors(),
            ], 422);
        }

        try {
            $news = News::findOrFail($id);

            $data = $request->except('image');

            if ($request->hasFile('image')) {
                // Delete old image safely
                if ($news->image && Storage::disk('public')->exists($news->getRawOriginal('image'))) {
                    Storage::disk('public')->delete($news->getRawOriginal('image'));
                }

                $data['image'] = $request->file('image')->store('news', 'public');
            }

            $news->update($data);

            $news->image = $this->formatImageUrl($news->image);

            return response()->json([
                'success' => true,
                'message' => 'News updated successfully',
                'data'    => $news,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update news',
                'error'   => config('app.debug') ? $e->getMessage() : null,
            ], 500);
        }
    }

    /**
     * Remove the specified news article.
     */
    public function destroy($id): JsonResponse
    {
        try {
            $news = News::findOrFail($id);

            if ($news->image && Storage::disk('public')->exists($news->getRawOriginal('image'))) {
                Storage::disk('public')->delete($news->getRawOriginal('image'));
            }

            $news->delete();

            return response()->json([
                'success' => true,
                'message' => 'News deleted successfully',
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete news',
                'error'   => config('app.debug') ? $e->getMessage() : null,
            ], 500);
        }
    }
}
