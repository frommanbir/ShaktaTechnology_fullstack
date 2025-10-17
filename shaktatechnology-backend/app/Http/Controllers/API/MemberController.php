<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Member;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;

class MemberController extends Controller
{
    // pagination
    public function index(Request $request): JsonResponse
    {
        try {
            $page = $request->input("page", 1);
            $limit = $request->input("limit", 10);

            if ($page < 1) $page = 1;
            if ($limit < 1) $limit = 10;
            if ($limit > 100) $limit = 100;

            $total = Member::count();
            $members = Member::skip(($page - 1) * $limit)
                ->take($limit)
                ->get();
            if ($members->isEmpty()) {
                return response()->json([
                    'success' => true,
                    'message' => 'No data found',
                    'data' => [],
                    'total' => 0,
                    'current_page' => $page,
                    'total_pages' => 0
                ], 200);
            }

            return response()->json([
                'success' => true,
                'data' => $members,
                'total' => $total,
                'current_page' => (int)$page,
                'per_page' => (int)$limit,
                'total_pages' => ceil($total / $limit)
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch members',
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
                'name' => 'required|string|max:255',
                'email' => 'required|string|email|max:255|unique:members',
                'phone' => 'nullable|string|max:20',
                'department' => 'nullable|string|max:255',
                'position' => 'nullable|string|max:255',
                'role' => 'nullable|string|max:255',
                'experience' => 'nullable|string',
                'projects_involved' => 'nullable|string',
                'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
                'about' => 'nullable|string',
                'linkedin' => 'nullable|url|max:255',
                'facebook' => 'nullable|url|max:255',
                'instagram' => 'nullable|url|max:255',
                'github' => 'nullable|url|max:255',
                'address' => 'nullable|string|max:255',
                'short_description' => 'nullable|string|max:500',
                'training' => 'nullable|string',
                'education' => 'nullable|string',
                'reference' => 'nullable|string|max:255',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation Error',
                    'errors' => $validator->errors()
                ], 422);
            }

            $data = $request->all();

            if ($request->hasFile('image')) {
                $image = $request->file('image');
                $name = $request->input('name');
                $extension = $image->getClientOriginalExtension();

                $imageName = Str::slug($name) . '.' . $extension;
                $image->storeAs('public/members', $imageName);
                $data['image'] = $imageName;
            }

            $member = Member::create($data);

            return response()->json([
                'success' => true,
                'data' => $member
            ], 201);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to create member',
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
            $member = Member::find($id);

            if (!$member) {
                return response()->json([
                    'success' => false,
                    'message' => 'Member not found'
                ], 404);
            }

            return response()->json([
                'success' => true,
                'data' => $member
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve member',
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
            $member = Member::find($id);

            if (!$member) {
                return response()->json([
                    'success' => false,
                    'message' => 'Member not found'
                ], 404);
            }

            $validator = Validator::make($request->all(), [
                'name' => 'sometimes|required|string|max:255',
                'email' => 'sometimes|required|string|email|max:255|unique:members,email,' . $id,
                'phone' => 'nullable|string|max:20',
                'department' => 'nullable|string|max:255',
                'position' => 'nullable|string|max:255',
                'role' => 'nullable|string|max:255',
                'experience' => 'nullable|string',
                'projects_involved' => 'nullable|string',
                'image' => 'nullable|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
                'about' => 'nullable|string',
                'linkedin' => 'nullable|url|max:255',
                'facebook' => 'nullable|url|max:255',
                'instagram' => 'nullable|url|max:255',
                'github' => 'nullable|url|max:255',
                'address' => 'nullable|string|max:255',
                'short_description' => 'nullable|string|max:500',
                'training' => 'nullable|string',
                'education' => 'nullable|string',
                'reference' => 'nullable|string|max:255',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation Error',
                    'errors' => $validator->errors()
                ], 422);
            }

            $data = $request->all();

            if ($request->hasFile('image')) {
                $image = $request->file('image');
                $name = $request->input('name', $member->name);
                $extension = $image->getClientOriginalExtension();

                $imageName = Str::slug($name) . '.' . $extension;

                if ($member->image && $member->image != $imageName && Storage::exists('public/members/' . $member->image)) {
                    Storage::delete('public/members/' . $member->image);
                }
                $image->storeAs('public/members', $imageName);
                $data['image'] = $imageName;
            } else {
                unset($data['image']);
            }

            $member->fill($data);

            if (!$member->isDirty()) {
                return response()->json([
                    'success' => false,
                    'message' => 'No changes made'
                ], 200);
            }

            $member->save();

            return response()->json([
                'success' => true,
                'message' => 'Member updated successfully',
                'data' => $member
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update member',
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
            $member = Member::find($id);

            if (!$member) {
                return response()->json([
                    'success' => false,
                    'message' => 'Member not found'
                ], 404);
            }

            if ($member->image && Storage::exists('public/members/' . $member->image)) {
                Storage::delete('public/members/' . $member->image);
            }

            $member->delete();

            return response()->json([
                'success' => true,
                'message' => 'Member deleted successfully'
            ], 200);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete member',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
