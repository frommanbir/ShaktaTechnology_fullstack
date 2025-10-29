<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Visit;

class VisitController extends Controller
{
    // 👁 Record a visit
    public function track(Request $request)
    {
        $page = $request->input('page', '/');
        $ip = $request->ip();

        // Either increment existing row or create a new one
        $visit = Visit::firstOrNew(['page' => $page]);
        $visit->ip_address = $ip;
        $visit->count = ($visit->exists ? $visit->count + 1 : 1);
        $visit->save();

        return response()->json(['message' => 'Visit tracked']);
    }

    // 👁 Return total count for a given page
    public function count(Request $request)
    {
        $page = $request->query('page', '/');
        $visit = Visit::where('page', $page)->first();

        return response()->json(['total' => $visit ? $visit->count : 0]);
    }
}
