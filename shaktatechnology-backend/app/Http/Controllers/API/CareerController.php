<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Career;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Validator;

class CareerController extends Controller
{
    /**
     * List all careers.
     */
    public function index(): JsonResponse
    {
        try {
            $careers = Career::all();
            if($careers->isEmpty()){
                return response()->json([
                    'success' =>true,
                    'message' =>'No data found',
                    'data' =>[]
                ],200);

            }
            return response()->json([
                'success' =>true,
                'data' => $careers
            ],200);
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
        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255|unique:careers,title',
            'department' => 'nullable|string|max:255',
            'location' => 'nullable|string|max:255',
            'type' => 'required|in:Full-time,Part-time,Internship,Contract',
            'description' => 'required|string',
            'requirements' => 'required|string',
            'benefits' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation error',
                'errors' => $validator->errors()
            ], 422);
        }

        try {
            $career = Career::create($validator->validated());
            return response()->json([
                'success' => true,
                'message' => 'Career created successfully',
                'data' => $career
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to create career',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Get a specific career.
     */
    public function show(int $id): JsonResponse
    {
        $career = Career::find($id);
        if (!$career) {
            return response()->json([
                'success' => false,
                'message' => 'Career not found'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $career
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

        $validator = Validator::make($request->all(), [
            'title' => 'sometimes|required|string|max:255|unique:careers,title,' . $id,
            'department' => 'nullable|string|max:255',
            'location' => 'nullable|string|max:255',
            'type' => 'sometimes|required|in:Full-time,Part-time,Internship,Contract',
            'description' => 'sometimes|required|string',
            'requirements' => 'sometimes|required|string',
            'benefits' => 'nullable|string',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation error',
                'errors' => $validator->errors()
            ], 422);
        }

        $career->fill($validator->validated());

        if (!$career->isDirty()) {
            return response()->json([
                'success' => false,
                'message' => 'No changes detected'
            ], 400);
        }

        try {
            $career->save();
            return response()->json([
                'success' => true,
                'message' => 'Career updated successfully',
                'data' => $career
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update career',
                'error' => $e->getMessage()
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
            $career->delete();
            return response()->json([
                'success' => true,
                'message' => 'Career deleted successfully'
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete career',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
