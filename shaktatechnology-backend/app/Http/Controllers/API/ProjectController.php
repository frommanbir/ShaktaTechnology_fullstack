<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Project;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class ProjectController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(): JsonResponse
    {
        try {
            $projects = Project::all()->map(function ($project) {
                $project->technologies = json_decode($project->technologies ?? '[]', true);
                $project->key_results = json_decode($project->key_results ?? '[]', true);
                return $project;
            });

            return response()->json([
                'success' => true,
                'data' => $projects
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve projects',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request): JsonResponse
    {
        try {
            $validator = Validator::make($request->all(), [
                'title' => 'required|string|max:255|unique:projects,title',
                'description' => 'required|string',
                'category' => 'required|string|max:255',
                'client' => 'required|string|max:255',
                'duration' => 'required|string|max:100',
                'technologies' => 'nullable|array',
                'technologies.*' => 'string|max:50',
                'key_results' => 'nullable|array',
                'key_results.*' => 'string|max:255',
                'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation error',
                    'errors' => $validator->errors()
                ], 422);
            }

            $data = $request->all();
            $data['technologies'] = json_encode($request->technologies ?? []);
            $data['key_results'] = json_encode($request->key_results ?? []);

            if ($request->hasFile('image')) {
                $image = $request->file('image');
                $title = $request->input('title');
                $extension = $image->getClientOriginalExtension();

                $imageName = Str::slug($title) . '.' . $extension;
                $image->storeAs('public/projects', $imageName);
                $data['image'] = $imageName;
            }

            $project = Project::create($data);
            $project->technologies = json_decode($project->technologies, true);
            $project->key_results = json_decode($project->key_results, true);

            return response()->json([
                'success' => true,
                'message' => 'Project created successfully',
                'data' => $project
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to create project',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show($id): JsonResponse
    {
        try {
            $project = Project::find($id);

            if (!$project) {
                return response()->json([
                    'success' => false,
                    'message' => 'Project not found'
                ], 404);
            }

            $project->technologies = json_decode($project->technologies ?? '[]', true);
            $project->key_results = json_decode($project->key_results ?? '[]', true);

            return response()->json([
                'success' => true,
                'data' => $project
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve project',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id): JsonResponse
    {
        try {
            $project = Project::find($id);

            if (!$project) {
                return response()->json([
                    'success' => false,
                    'message' => 'Project not found'
                ], 404);
            }

            $validator = Validator::make($request->all(), [
                'title' => 'sometimes|required|string|max:255|unique:projects,title,' . $id,
                'description' => 'sometimes|required|string',
                'category' => 'sometimes|required|string|max:255',
                'client' => 'sometimes|required|string|max:255',
                'duration' => 'sometimes|required|string|max:100',
                'technologies' => 'sometimes|array',
                'technologies.*' => 'string|max:50',
                'key_results' => 'sometimes|array',
                'key_results.*' => 'string|max:255',
                'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation error',
                    'errors' => $validator->errors()
                ], 422);
            }

            $data = $request->all();

            if ($request->has('technologies')) {
                $data['technologies'] = json_encode($request->technologies ?? []);
            }
            if ($request->has('key_results')) {
                $data['key_results'] = json_encode($request->key_results ?? []);
            }

            if ($request->hasFile('image')) {
                $image = $request->file('image');
                $title = $request->input('title', $project->title);
                $extension = $image->getClientOriginalExtension();

                $imageName = Str::slug($title) . '_project.' . $extension;

                if ($project->image && $project->image !== $imageName && Storage::exists('public/projects/' . $project->image)) {
                    Storage::delete('public/projects/' . $project->image);
                }

                $image->storeAs('public/projects', $imageName);
                $data['image'] = $imageName;
            } else {
                unset($data['image']);
            }

            $project->fill($data);

            if (!$project->isDirty()) {
                return response()->json([
                    'success' => false,
                    'message' => 'No changes detected'
                ], 200);
            }

            $project->save();
            $project->technologies = json_decode($project->technologies ?? '[]', true);
            $project->key_results = json_decode($project->key_results ?? '[]', true);

            return response()->json([
                'success' => true,
                'message' => 'Project updated successfully',
                'data' => $project
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update project',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id): JsonResponse
    {
        try {
            $project = Project::find($id);

            if (!$project) {
                return response()->json([
                    'success' => false,
                    'message' => 'Project not found'
                ], 404);
            }

            if ($project->image && Storage::exists('public/projects/' . $project->image)) {
                Storage::delete('public/projects/' . $project->image);
            }

            $project->delete();

            return response()->json([
                'success' => true,
                'message' => 'Project deleted successfully'
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete project',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
