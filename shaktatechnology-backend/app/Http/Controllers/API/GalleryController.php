<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Gallery;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use App\Helpers\CloudinaryHelper;

class GalleryController extends Controller
{
    /**
     * List all galleries.
     */
    public function index(): JsonResponse
    {
        try {
            $galleries = Gallery::orderBy('created_at', 'desc')->get();

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
     * Create new gallery item.
     */
    public function store(Request $request): JsonResponse
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'images' => 'nullable|array',
            'images.*' => 'image|mimes:jpg,jpeg,png,webp|max:5120',
        ]);

        try {
            $gallery = new Gallery();
            $gallery->title = $request->title;
            $gallery->description = $request->description;

            if ($request->hasFile('images')) {
                $imageUrls = [];
                foreach ($request->file('images') as $file) {
                    $imageUrls[] = CloudinaryHelper::uploadImage($file, 'galleries');
                }
                $gallery->images = $imageUrls;
                $gallery->image = count($imageUrls) > 0 ? $imageUrls[0] : null;
            }

            $gallery->save();

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
     * Update gallery.
     */
    public function update(Request $request, int $id): JsonResponse
    {
        $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'images' => 'nullable|array',
            'images.*' => 'image|mimes:jpg,jpeg,png,webp|max:5120',
            'existing_images' => 'nullable|array',
            'existing_images.*' => 'string',
        ]);

        try {
            $gallery = Gallery::findOrFail($id);
            $gallery->title = $request->title;
            $gallery->description = $request->description;

            $existingImages = $request->input('existing_images', []);
            $currentImages = $gallery->images ?? [];

            // Find images to delete
            $imagesToDelete = array_diff($currentImages, $existingImages);
            foreach ($imagesToDelete as $imgToDelete) {
                CloudinaryHelper::deleteImage($imgToDelete);
            }

            $finalImages = $existingImages;

            if ($request->hasFile('images')) {
                foreach ($request->file('images') as $file) {
                    $finalImages[] = CloudinaryHelper::uploadImage($file, 'galleries');
                }
            }

            $gallery->images = $finalImages;
            $gallery->image = count($finalImages) > 0 ? $finalImages[0] : null;

            $gallery->save();

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
     * Delete gallery item.
     */
    public function destroy(int $id): JsonResponse
    {
        try {
            $gallery = Gallery::findOrFail($id);

            if (!empty($gallery->images)) {
                foreach ($gallery->images as $img) {
                    CloudinaryHelper::deleteImage($img);
                }
            } elseif ($gallery->image) {
                CloudinaryHelper::deleteImage($gallery->image);
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
