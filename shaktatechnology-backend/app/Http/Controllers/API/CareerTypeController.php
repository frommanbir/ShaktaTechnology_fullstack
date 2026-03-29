<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\CareerType;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class CareerTypeController extends Controller
{
    /**
     * List all career types.
     */
    public function index(): JsonResponse
    {
        try {
            $types = CareerType::orderBy('name')->get();
            return response()->json([
                'success' => true,
                'data' => $types
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch career types',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Create a new career type.
     */
    public function store(Request $request): JsonResponse
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:100|unique:career_types,name',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation error',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $type = CareerType::create($validator->validated());
            return response()->json([
                'success' => true,
                'message' => 'Career type created successfully',
                'data' => $type
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to create career type',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update a career type.
     */
    public function update(Request $request, int $id): JsonResponse
    {
        $type = CareerType::find($id);
        if (!$type) {
            return response()->json([
                'success' => false,
                'message' => 'Career type not found'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:100|unique:career_types,name,' . $id,
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation error',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $type->update($validator->validated());
            return response()->json([
                'success' => true,
                'message' => 'Career type updated successfully',
                'data' => $type
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update career type',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Delete a career type.
     */
    public function destroy(int $id): JsonResponse
    {
        $type = CareerType::find($id);
        if (!$type) {
            return response()->json([
                'success' => false,
                'message' => 'Career type not found'
            ], 404);
        }

        try {
            $type->delete();
            return response()->json([
                'success' => true,
                'message' => 'Career type deleted successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete career type',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
