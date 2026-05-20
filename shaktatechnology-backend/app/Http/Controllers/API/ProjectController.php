<?php

namespace App\Http\Controllers\API;

use App\Helpers\CloudinaryHelper;
use App\Http\Controllers\Controller;
use App\Models\Project;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class ProjectController extends Controller
{
    /**
     * List all projects
     */
    public function index()
    {
        return response()->json([
            'success' => true,
            'data' => Project::all()
        ]);
    }

    /**
     * Store a new project
     */
    public function store(Request $request)
    {
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
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
            'url' => 'nullable|url|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        $data = $validator->validated();

        // Handle image upload
        if ($request->hasFile('image')) {
            // $image      = $request->file('image');
            // $imageName  = Str::slug($data['title']) . '.' . $image->getClientOriginalExtension();
            // $image->storeAs('public/projects', $imageName);
            // $data['image'] = $imageName;

            $data['image'] = CloudinaryHelper::uploadImage($request->file('image'), 'projects');

        }

        $project = Project::create($data);

        return response()->json([
            'success' => true,
            'message' => 'Project created successfully',
            'data' => $project
        ], 201);
    }

    /**
     * Show a single project
     */
    public function show($id)
    {
        $project = Project::find($id);

        if (!$project) {
            return response()->json([
                'success' => false,
                'message' => 'Project not found'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $project
        ]);
    }

    /**
     * Update a project
     */
    public function update(Request $request, $id)
    {
        $project = Project::find($id);

        if (!$project) {
            return response()->json([
                'success' => false,
                'message' => 'Project not found'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'title' => 'sometimes|string|max:255|unique:projects,title,' . $id,
            'description' => 'sometimes|string',
            'category' => 'sometimes|string|max:255',
            'client' => 'sometimes|string|max:255',
            'duration' => 'sometimes|string|max:100',
            'technologies' => 'sometimes|array',
            'technologies.*' => 'string|max:50',
            'key_results' => 'sometimes|array',
            'key_results.*' => 'string|max:255',
            'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
            'url' => 'nullable|url|max:255',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        $data = $validator->validated();

        // Handle image update
        if ($request->hasFile('image')) {

            // Delete old image
            if ($project->image && Storage::exists('public/projects/' . $project->image)) {
                Storage::delete('public/projects/' . $project->image);
            }

            $image = $request->file('image');
            $title = $data['title'] ?? $project->title;
            $imageName = Str::slug($title) . '.' . $image->getClientOriginalExtension();
            $image->storeAs('public/projects', $imageName);

            $data['image'] = $imageName;
        }

        $project->update($data);

        return response()->json([
            'success' => true,
            'message' => 'Project updated successfully',
            'data' => $project
        ]);
    }

    /**
     * Delete a project
     */
    public function destroy($id)
    {
        $project = Project::find($id);

        if (!$project) {
            return response()->json([
                'success' => false,
                'message' => 'Project not found'
            ], 404);
        }

        // Delete image if exists
        if ($project->image || Storage::exists('public/projects/' . $project->image)) {
            // Storage::delete('public/projects/' . $project->image);
            CloudinaryHelper::deleteImage($project->image);
        }

        $project->delete();

        return response()->json([
            'success' => true,
            'message' => 'Project deleted successfully'
        ]);
    }
}
