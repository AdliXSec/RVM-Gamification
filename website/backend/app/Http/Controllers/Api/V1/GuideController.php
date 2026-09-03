<?php
namespace App\Http\Controllers\Api\V1;
use App\Http\Controllers\Controller;
use App\Models\Guide;
use Illuminate\Http\Request;
class GuideController extends Controller
{
    public function index() {
        return response()->json(['success' => true, 'data' => ['guides' => Guide::orderBy('step_number', 'asc')->get()]]);
    }
    public function store(Request $request) {
        $data = $request->validate([
            'title' => 'required|string',
            'description' => 'required|string',
            'step_number' => 'integer',
            'icon' => 'nullable|string',
            'is_active' => 'boolean'
        ]);
        $guide = Guide::create($data);
        return response()->json(['success' => true, 'message' => 'Guide created', 'data' => $guide]);
    }
    public function update(Request $request, Guide $guide) {
        $data = $request->validate([
            'title' => 'sometimes|string',
            'description' => 'sometimes|string',
            'step_number' => 'sometimes|integer',
            'icon' => 'nullable|string',
            'is_active' => 'sometimes|boolean'
        ]);
        $guide->update($data);
        return response()->json(['success' => true, 'message' => 'Guide updated', 'data' => $guide]);
    }
    public function destroy(Guide $guide) {
        $guide->delete();
        return response()->json(['success' => true, 'message' => 'Guide deleted']);
    }
}
