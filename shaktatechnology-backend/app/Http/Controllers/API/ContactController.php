<?php

namespace App\Http\Controllers\API;

use App\Http\Controllers\Controller;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use App\Models\Contact;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\Validator;

class ContactController extends Controller
{
    /**
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index():JsonResponse
    {
        try{
            $contacts = Contact::all();

            if($contacts->isEmpty()){
                return response()->json([
                    'success' =>true,
                    'message' =>'no data found',
                    'data' => []
                ],200);
            }
            return response()->json([
                'success' => true,
                'data' => $contacts
            ],200);
        }catch (\Exception $e){
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch contacts',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request):JsonResponse
    {
        try{
            $validator = Validator::make($request->all(), [
                'Company_name' => 'required|string|max:255',
                'email' => 'required|email|max:255',
                'phone' => 'nullable|regex:/^\+?[0-9]+$/|max:20',
                'name' => 'required|string|max:255',
                'services' => 'required|string|max:255',
                'budget' => 'required|numeric|min:0',
                'project_details' => 'required|string',
            ]);
            if ($validator->fails()) {
                return response()->json([
                    'success' => false,
                    'message' => 'Validation error',
                    'errors' => $validator->errors()
                ], 422);
            }
            $contact = Contact::create($request->all());

            return response()->json([
                'success' => true,
                'message' => 'Contact created successfully',
                'data' => $contact,
            ],201);
        }catch (\Exception $e){
            return response()->json([
                'success' => false,
                'message' => 'Failed to create contact',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Display the specified resource.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function show($id):JsonResponse
    {
        try{
            $contact = Contact::find($id);

            if (!$contact) {
                return response()->json([
                    'success' => false,
                    'message' => 'Contact not found'
                ], 404);
            }
            return response()->json([
                'success' => true,
                'data' => $contact,
            ],200);
        }catch (\Exception $e){
            return response()->json([
                'success' => false,
                'message' => 'Failed to fetch contact',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, $id):JsonResponse
    {
        try{
            $contact = Contact::find($id);

            if (!$contact) {
                return response()->json([
                    'success' => false,
                    'message' => 'Contact not found'
                ], 404);
            }

            $validator = Validator::make($request->all(), [
                'Company_name' => 'sometimes|required|string|max:255',
                'email' => 'sometimes|required|email|max:255',
                'phone' => 'nullable|regex:/^\+?[0-9]+$/|max:20',
                'name' => 'sometimes|required|string|max:255',
                'services' => 'sometimes|required|string|max:255',
                'budget' => 'sometimes|required|numeric|min:0',
                'project_details' => 'sometimes|required|string',
            ]);

            if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'message' => 'Validation error',
                'errors' => $validator->errors()
            ], 422);
        }

        $data = $request->all();

        if ($request->hasFile('image')) {
            $image = $request->file('image');
            $imageName = md5_file($image->getRealPath()) . '.' . $image->getClientOriginalExtension();

            // Only delete old image if the name is actually different
            if ($contact->image && $contact->image !== $imageName && Storage::exists('public/services/' . $contact->image)) {
                Storage::delete('public/services/' . $contact->image);
            }

            $image->storeAs('public/services', $imageName);
            $data['image'] = $imageName;
        } else {
            // Remove image from data so it doesn't overwrite with null
            unset($data['image']);
        }

        $contact->fill($data);

        // Check if anything actually changed
        if (!$contact->isDirty()) {
            return response()->json([
                'success' => false,
                'message' => 'No changes made'
            ], 200);
        }

        $contact->save();

        return response()->json([
            'success' => true,
            'message' => 'Contacts updated successfully',
            'data' => $contact
        ], 200);
    } catch (\Exception $e) {
        return response()->json([
            'success' => false,
            'message' => 'Failed to update contact',
            'error' => $e->getMessage()
        ], 500);
    }
}

    /**
     * Remove the specified resource from storage.
     *
     * @param  int  $id
     * @return \Illuminate\Http\Response
     */
    public function destroy($id):JsonResponse
    {
        try{

            $contact = Contact::find($id);

            if (!$contact) {
                return response()->json([
                    'success' => false,
                    'message' => 'Contact not found'
                ], 404);
            }

            $contact->delete();

            return response()->json([
                'success' => true,
                'message' => 'Contact deleted successfully'
            ],200);
        }catch(\Exception $e){
            return response()->json([
                'success' => false,
                'message' => 'Failed to delete contact',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
