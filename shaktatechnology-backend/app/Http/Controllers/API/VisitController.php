<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;

use App\Models\Setting;
use Illuminate\Http\Request;
use Exception;
use Illuminate\Support\Facades\Log;

class VisitController extends Controller
{
    /**
     * Get the current visit count.
     * 
     * @return \Illuminate\Http\JsonResponse
     */
    public function index()
    {
        try {
            $settings = Setting::first();

            return response()->json([
                'success' => true,
                'total' => $settings ? $settings->visits : 0
            ]);
        } catch (Exception $e) {
            Log::error('Failed to fetch visit count: ' . $e->getMessage());

            return response()->json([
                'message' => 'Failed to fetch visit count',
                'error' => config('app.debug') ? $e->getMessage() : 'Internal server error'
            ], 500);
        }
    }

    /**
     * Track a page visit by incrementing the visit count in settings.
     * 
     * @param Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function track(Request $request)
    {
        try {
            $settings = Setting::first();

            if (!$settings) {
                return response()->json([
                    'message' => 'Settings not found'
                ], 404);
            }

            $settings->increment('visits');

            return response()->json([
                'success' => true,
                'visits' => $settings->visits,
                'page' => $request->input('page', '/')
            ]);
        } catch (Exception $e) {
            Log::error('Failed to track visit: ' . $e->getMessage());

            return response()->json([
                'message' => 'Failed to track visit',
                'error' => config('app.debug') ? $e->getMessage() : 'Internal server error'
            ], 500);
        }
    }
}
