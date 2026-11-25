<?php

namespace App\Http\Controllers\API;

use App\Helpers\CloudinaryHelper;
use App\Http\Controllers\Controller;
use App\Models\Career;
use App\Models\CareerType;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Validator;

class CareerController extends Controller
{
    /**
     * Format image URL for local storage or Cloudinary absolute URLs.
     */
    private function formatImageUrl(?string $path): ?string
    {
        if (!$path) {
            return null;
        }

        if (str_starts_with($path, 'http')) {
            return $path;
        }

        return asset('storage/' . ltrim($path, '/'));
    }

    /**
     * List all careers.
     */
    public function index(): JsonResponse
    {
        try {
            $careers = Career::orderBy('created_at', 'desc')->get();
            if ($careers->isEmpty()) {
                return response()->json([
                    'success' => true,
                    'message' => 'No data found',
                    'data' => []
                ], 200);
            }

            foreach ($careers as $career) {
                $career->image = $this->formatImageUrl($career->image);
            }

            return response()->json([
                'success' => true,
                'data' => $careers
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch careers',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Create a new career.
     */
    public function store(Request $request): JsonResponse
    {
        $validTypes = CareerType::pluck('name')->toArray();

        $validator = Validator::make($request->all(), [
            'title'        => 'required|string|max:255',
            'slug'         => 'nullable|string|max:255',
            'department'   => 'nullable|string|max:255',
            'location'     => 'nullable|string|max:255',
            'type'         => 'required|string|in:' . implode(',', $validTypes),
            'description'  => 'required|string',
            'requirements' => 'required|string',
            'benefits'     => 'nullable|string',
            'image'        => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048',
            'is_active'    => 'boolean',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation error',
                'errors'  => $validator->errors()
            ], 422);
        }

        try {
            $data = $validator->validated();
            unset($data['image']);

            if ($request->hasFile('image')) {
                $data['image'] = CloudinaryHelper::uploadImage($request->file('image'), 'careers');
            }

            $career = Career::create($data);
            $career->image = $this->formatImageUrl($career->image);

            return response()->json([
                'success' => true,
                'message' => 'Career created successfully',
                'data'    => $career
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to create career',
                'error'   => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get a specific career.
     */
    public function show($identifier): JsonResponse
    {
        if (ctype_digit((string) $identifier)) {
            $career = Career::where('id', (int) $identifier)
                ->orWhere('slug', $identifier)
                ->first();
        } else {
            $career = Career::where('slug', $identifier)->first();
        }

        if (!$career) {
            return response()->json([
                'success' => false,
                'message' => 'Career not found'
            ], 404);
        }

        $career->image = $this->formatImageUrl($career->image);

        return response()->json([
            'success' => true,
            'data'    => $career
        ]);
    }

    /**
     * Update an existing career.
     */
    public function update(Request $request, int $id): JsonResponse
    {
        $career = Career::find($id);
        if (!$career) {
            return response()->json([
                'success' => false,
                'message' => 'Career not found'
            ], 404);
        }

        $validTypes = CareerType::pluck('name')->toArray();

        $validator = Validator::make($request->all(), [
            'title'        => 'sometimes|required|string|max:255',
            'slug'         => 'nullable|string|max:255',
            'department'   => 'nullable|string|max:255',
            'location'     => 'nullable|string|max:255',
            'type'         => 'sometimes|required|string|in:' . implode(',', $validTypes),
            'description'  => 'sometimes|required|string',
            'requirements' => 'sometimes|required|string',
            'benefits'     => 'nullable|string',
            'image'        => 'nullable|image|mimes:jpg,jpeg,png,webp|max:2048',
            'is_active'    => 'sometimes|boolean',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation error',
                'errors'  => $validator->errors()
            ], 422);
        }

        $data = $validator->validated();
        unset($data['image']);

        try {
            if ($request->hasFile('image')) {
                if ($career->image) {
                    CloudinaryHelper::deleteImage($career->image);
                }

                $data['image'] = CloudinaryHelper::uploadImage($request->file('image'), 'careers');
            }

            $career->fill($data);

            if (!$career->isDirty()) {
                return response()->json([
                    'success' => false,
                    'message' => 'No changes detected'
                ], 400);
            }

            $career->save();
            $career->image = $this->formatImageUrl($career->image);

            return response()->json([
                'success' => true,
                'message' => 'Career updated successfully',
                'data'    => $career
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update career',
                'error'   => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Toggle active status of a career.
     */
    public function toggleStatus(int $id): JsonResponse
    {
        $career = Career::find($id);
        if (!$career) {
            return response()->json([
                'success' => false,
                'message' => 'Career not found'
            ], 404);
        }

        try {
            $career->is_active = !$career->is_active;
            $career->save();
            return response()->json([
                'success' => true,
                'message' => 'Career status updated',
                'data'    => $career
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update status',
                'error'   => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Delete a career.
     */
    public function destroy(int $id): JsonResponse
    {
        $career = Career::find($id);
        if (!$career) {
            return response()->json([
                'success' => false,
                'message' => 'Career not found'
            ], 404);
        }

        try {
            if ($career->image) {
                CloudinaryHelper::deleteImage($career->image);
            }

            $career->delete();
            return response()->json([
                'success' => true,
                'message' => 'Career deleted successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete career',
                'error'   => $e->getMessage()
            ], 500);
        }
    }
}
