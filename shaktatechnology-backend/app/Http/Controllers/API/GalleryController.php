<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Gallery;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Storage;

class GalleryController extends Controller
{
    /**
     * Format full image URL for API response.
     */
    private function formatImageUrl(?string $path): ?string
    {
        if (!$path) return null;

        $path = ltrim($path, '/');

        if (str_starts_with($path, 'http')) {
            return $path;
        }

        return asset('storage/' . $path);
    }

    /**
     * List all galleries.
     */
    public function index(): JsonResponse
    {
        try {
            $galleries = Gallery::orderBy('created_at', 'desc')->get();

            $galleries->transform(function ($gallery) {
                $gallery->image = $this->formatImageUrl($gallery->image);
                return $gallery;
            });

            return response()->json([
                'success' => true,
                'message' => 'Galleries fetched successfully',
                'data' => $galleries
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch galleries',
                'error' => config('app.debug') ? $e->getMessage() : null,
            ], 500);
        }
    }

    /**
     * Show a single gallery item.
     */
    public function show(int $id): JsonResponse
    {
        try {
            $gallery = Gallery::findOrFail($id);
            $gallery->image = $this->formatImageUrl($gallery->image);

            return response()->json([
                'success' => true,
                'data' => $gallery
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Gallery not found',
                'error' => config('app.debug') ? $e->getMessage() : null,
            ], 404);
        }
    }

    /**
     * Create a new gallery item.
     */
    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'image' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048',
        ]);

        try {
            $gallery = new Gallery();
            $gallery->title = $request->title;
            $gallery->description = $request->description;

            if ($request->hasFile('image')) {
                $gallery->image = $request->file('image')->store('galleries', 'public');
            }

            $gallery->save();
            $gallery->image = $this->formatImageUrl($gallery->image);

            return response()->json([
                'success' => true,
                'message' => 'Gallery created successfully',
                'data' => $gallery,
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to create gallery',
                'error' => config('app.debug') ? $e->getMessage() : null,
            ], 500);
        }
    }

    /**
     * Update a gallery item.
     */
    public function update(Request $request, int $id): JsonResponse
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'image' => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048',
        ]);

        try {
            $gallery = Gallery::findOrFail($id);
            $gallery->title = $request->title;
            $gallery->description = $request->description;

            if ($request->hasFile('image')) {
                // Delete old image
                if ($gallery->image && Storage::disk('public')->exists($gallery->getRawOriginal('image'))) {
                    Storage::disk('public')->delete($gallery->getRawOriginal('image'));
                }

                $gallery->image = $request->file('image')->store('galleries', 'public');
            }

            $gallery->save();
            $gallery->image = $this->formatImageUrl($gallery->image);

            return response()->json([
                'success' => true,
                'message' => 'Gallery updated successfully',
                'data' => $gallery,
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update gallery',
                'error' => config('app.debug') ? $e->getMessage() : null,
            ], 500);
        }
    }

    /**
     * Delete a gallery item.
     */
    public function destroy(int $id): JsonResponse
    {
        try {
            $gallery = Gallery::findOrFail($id);

            if ($gallery->image && Storage::disk('public')->exists($gallery->getRawOriginal('image'))) {
                Storage::disk('public')->delete($gallery->getRawOriginal('image'));
            }

            $gallery->delete();

            return response()->json([
                'success' => true,
                'message' => 'Gallery deleted successfully',
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete gallery',
                'error' => config('app.debug') ? $e->getMessage() : null,
            ], 500);
        }
    }
}
