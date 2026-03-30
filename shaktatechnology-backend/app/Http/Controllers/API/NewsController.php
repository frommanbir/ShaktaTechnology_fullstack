<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Validator;
use App\Models\News;
use App\Helpers\CloudinaryHelper;

class NewsController extends Controller
{
    /**
     * Fix image URL for local old images or Cloudinary absolute URLs.
     */
    private function formatImageUrl(?string $path): ?string
    {
        if (!$path) return null;

        // Cloudinary URLs are already absolute
        if (str_starts_with($path, 'http')) {
            return $path;
        }

        // Old local stored images fallback
        return asset('storage/' . ltrim($path, '/'));
    }

    /**
     * List paginated news.
     */
    public function index(Request $request): JsonResponse
    {
        try {
            $limit = $request->input('limit', 10);
            $news = News::orderBy('created_at', 'desc')->paginate($limit);

            $items = $news->items();

            // Fix image URLs
            foreach ($items as $item) {
                $item->image = $this->formatImageUrl($item->image);
            }

            return response()->json([
                'success' => true,
                'message' => 'News fetched successfully',
                'data' => $items,
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
     * Create news.
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

            // Upload Cloudinary image
            if ($request->hasFile('image')) {
                $data['image'] = CloudinaryHelper::uploadImage($request->file('image'), 'news');
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
     * Show single news.
     */
    public function show($identifier): JsonResponse
    {
        try {
            $news = News::where('id', $identifier)
                        ->orWhere('slug', $identifier)
                        ->firstOrFail();
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
     * Update news.
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

            // Handle image replacement
            if ($request->hasFile('image')) {
                if ($news->image) {
                    CloudinaryHelper::deleteImage($news->image);
                }

                $data['image'] = CloudinaryHelper::uploadImage($request->file('image'), 'news');
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
     * Delete news.
     */
    public function destroy($id): JsonResponse
    {
        try {
            $news = News::findOrFail($id);

            // Delete cloudinary image
            if ($news->image) {
                CloudinaryHelper::deleteImage($news->image);
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
