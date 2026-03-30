<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use App\Models\Member;
use App\Helpers\CloudinaryHelper;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;

class MemberController extends Controller
{
    // INDEX (Pagination)
    public function index(Request $request): JsonResponse
    {
        try {
            $page = max(1, (int) $request->input("page", 1));
            $limit = min(100, max(1, (int) $request->input("limit", 10)));

            $query = Member::orderBy('member_order', 'asc');

            $total = $query->count();

            $members = $query->skip(($page - 1) * $limit)->take($limit)->get();

            if ($members->isEmpty()) {
                return response()->json([
                    'success' => true,
                    'message' => 'No data found',
                    'data' => [],
                    'total' => 0,
                    'current_page' => $page,
                    'total_pages' => 0
                ]);
            }

            return response()->json([
                'success' => true,
                'data' => $members,
                'total' => $total,
                'current_page' => $page,
                'per_page' => $limit,
                'total_pages' => ceil($total / $limit)
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch members',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    // STORE MEMBER
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
                'image' => 'nullable|image|max:4096',
                'about' => 'nullable|string',
                'linkedin' => 'nullable|url|max:255',
                'facebook' => 'nullable|url|max:255',
                'instagram' => 'nullable|url|max:255',
                'github' => 'nullable|url|max:255',
                'address' => 'nullable|string|max:255',
                'education' => 'nullable|string',
                'member_order' => 'nullable|integer|unique:members,member_order',
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation Error',
                    'errors' => $validator->errors()
                ], 422);
            }

            $data = $request->all();

            // Upload to Cloudinary
            if ($request->hasFile('image')) {
                $data['image'] = CloudinaryHelper::uploadImage($request->file('image'), 'members');
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

    // SHOW MEMBER
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
            ]);
        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to retrieve member',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    // UPDATE MEMBER
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
                'image' => 'nullable|image|max:4096',
                'about' => 'nullable|string',
                'linkedin' => 'nullable|url|max:255',
                'facebook' => 'nullable|url|max:255',
                'instagram' => 'nullable|url|max:255',
                'github' => 'nullable|url|max:255',
                'address' => 'nullable|string|max:255',
                'education' => 'nullable|string',
                'member_order' => 'nullable|integer|unique:members,member_order,' . $id,
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation Error',
                    'errors' => $validator->errors()
                ], 422);
            }

            $data = $request->all();

            // 🔥 Replace image in Cloudinary
            if ($request->hasFile('image')) {
                // delete old image
                if ($member->image) {
                    CloudinaryHelper::deleteImage($member->image);
                }
                // upload new image
                $data['image'] = CloudinaryHelper::uploadImage($request->file('image'), 'members');
            } elseif ($request->input('remove_image') === 'true') {
                if ($member->image) {
                    CloudinaryHelper::deleteImage($member->image);
                }
                $data['image'] = null;
            }

            $member->update($data);

            return response()->json([
                'success' => true,
                'message' => 'Member updated successfully',
                'data' => $member
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to update member',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    // DELETE MEMBER
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

            if ($member->image) {
                CloudinaryHelper::deleteImage($member->image);
            }

            $member->delete();

            return response()->json([
                'success' => true,
                'message' => 'Member deleted successfully'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete member',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
