<?php

namespace App\Http\Controllers\API;

use App\Models\Setting;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Log;
use App\Http\Controllers\Controller;
use Illuminate\Support\Str;
use Exception;

class SettingController extends Controller
{
    public function index()
    {
        try {
            $settings = Setting::first();

            if (!$settings) {
                return response()->json([
                    'message' => 'Data not found'
                ], 404);
            }

            return response()->json($settings);
        } catch (Exception $e) {
            Log::error('Failed to fetch settings: ' . $e->getMessage());

            return response()->json([
                'message' => 'Failed to retrieve settings',
                'error' => config('app.debug') ? $e->getMessage() : 'Internal server error'
            ], 500);
        }
    }
    public function store(Request $request)
{
    try {
        $validator = Validator::make($request->all(), [
            'company_name' => 'required|string|max:255',
            'phone' => 'required|string|max:20',
            'email' => 'required|email|max:255',
            'address' => 'required|string',
            'logo' => 'sometimes|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
            'website' => 'nullable|url|max:255',
            'linkedin' => 'nullable|url|max:255',
            'instagram' => 'nullable|url|max:255',
            'facebook' => 'nullable|url|max:255',
            'twitter' => 'nullable|url|max:255',
            'about' => 'nullable|string'
        ]);

        if ($validator->fails()) {
            return response()->json([
                'message' => 'Validation failed',
                'errors' => $validator->errors()
            ], 422);
        }

        $data = $request->except('logo');

        if ($request->hasFile('logo')) {
            $companyamNe = $request->input('company_name');
            $file = $request->file('logo');
            $extension = $file->getClientOriginalExtension( );

            $filename = Str::slug($companyamNe) . '_logo' . $extension;

            $logoPath = $file->storeAs('logos',$filename,'public');
            $data['logo'] = $logoPath;
        }

        $setting = Setting::create($data);

        return response()->json([
            'message' => 'Settings created successfully',
            'data' => $setting
        ], 201);

    } catch (Exception $e) {
        \Log::error('Failed to create settings: ' . $e->getMessage());
        return response()->json([
            'message' => 'Failed to create settings',
            'error' => config('app.debug') ? $e->getMessage() : 'Internal server error'
        ], 500);
    }
}


    public function update(Request $request, $id)
    {
        try {
            $settings = Setting::find($id);

            if (!$settings) {
                return response()->json([
                    'message' => 'Settings not found'
                ], 404);
            }

            $validator = Validator::make($request->all(), [
                'company_name' => 'sometimes|required|string|max:255',
                'phone' => 'sometimes|required|string|max:20',
                'email' => 'sometimes|required|email|max:255',
                'address' => 'sometimes|required|string',
                'logo' => 'sometimes|image|mimes:jpeg,png,jpg,gif,svg|max:2048',
                'website' => 'sometimes|nullable|url|max:255',
                'linkedin' => 'sometimes|nullable|url|max:255',
                'instagram' => 'sometimes|nullable|url|max:255',
                'facebook' => 'sometimes|nullable|url|max:255',
                'twitter' => 'sometimes|nullable|url|max:255',
                'about' => 'sometimes|nullable|string'
            ]);

            if ($validator->fails()) {
                return response()->json([
                    'message' => 'Validation failed',
                    'errors' => $validator->errors()
                ], 422);
            }

            $data = $request->except(['logo', '_method', '_token']);
            $hasChanges = false;

            if ($request->hasFile('logo')) {
                if ($settings->logo && Storage::exists($settings->logo)) {
                    Storage::delete($settings->logo);
                }
                $companyName = $request->input('company_name',$settings->company_name);
                $file = $request->file('logo');
                $extension = $file->getClientOriginalExtension();

                $fileName = Str::slug($companyName) . '_logo.' . $extension;

                $logoPath = $file->storeAs('logos',$fileName,'public');
                $data['logo'] = $logoPath;
                $hasChanges = true;
            }

            foreach ($data as $key => $value) {
                if ($settings->$key != $value) {
                    $settings->$key = $value;
                    $hasChanges = true;
                }
            }

            if (!$hasChanges) {
                return response()->json([
                    'message' => 'No changes detected',
                    'data' => $settings
                ], 200);
            }

            $settings->save();

            return response()->json([
                'message' => 'Settings updated successfully',
                'data' => $settings
            ]);

        } catch (Exception $e) {
            Log::error('Failed to update settings: ' . $e->getMessage());

            return response()->json([
                'message' => 'Failed to update settings',
                'error' => config('app.debug') ? $e->getMessage() : 'Internal server error'
            ], 500);
        }
    }

    public function destroy($id)
    {
        try {
            $settings = Setting::find($id);

            if (!$settings) {
                return response()->json([
                    'message' => 'Data not found'
                ], 404);
            }

            if ($settings->logo && Storage::exists($settings->logo)) {
                Storage::delete($settings->logo);
            }

            $settings->delete();

            return response()->json([
                'message' => 'Settings deleted successfully'
            ]);

        } catch (Exception $e) {
            Log::error('Failed to delete settings: ' . $e->getMessage());

            return response()->json([
                'message' => 'Failed to delete settings',
                'error' => config('app.debug') ? $e->getMessage() : 'Internal server error'
            ], 500);
        }
    }
}
