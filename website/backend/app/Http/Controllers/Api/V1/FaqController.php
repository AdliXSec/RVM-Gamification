<?php
namespace App\Http\Controllers\Api\V1;
use App\Http\Controllers\Controller;
use App\Models\Faq;
use Illuminate\Http\Request;
class FaqController extends Controller
{
    public function index() {
        return response()->json(['success' => true, 'data' => ['faqs' => Faq::orderBy('order_num', 'asc')->get()]]);
    }
    public function store(Request $request) {
        $data = $request->validate([
            'question' => 'required|string',
            'answer' => 'required|string',
            'order_num' => 'integer',
            'is_active' => 'boolean'
        ]);
        $faq = Faq::create($data);
        return response()->json(['success' => true, 'message' => 'FAQ created', 'data' => $faq]);
    }
    public function update(Request $request, Faq $faq) {
        $data = $request->validate([
            'question' => 'sometimes|string',
            'answer' => 'sometimes|string',
            'order_num' => 'sometimes|integer',
            'is_active' => 'sometimes|boolean'
        ]);
        $faq->update($data);
        return response()->json(['success' => true, 'message' => 'FAQ updated', 'data' => $faq]);
    }
    public function destroy(Faq $faq) {
        $faq->delete();
        return response()->json(['success' => true, 'message' => 'FAQ deleted']);
    }
}
