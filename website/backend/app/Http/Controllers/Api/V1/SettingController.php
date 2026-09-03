<?php
declare(strict_types=1);

namespace App\Http\Controllers\Api\V1;

use App\Http\Controllers\Controller;
use App\Models\Setting;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Cache;

class SettingController extends Controller
{
    public function index(): JsonResponse
    {
        $settings = Cache::rememberForever('settings.all', function () {
            return Setting::pluck('value', 'key')->toArray();
        });

        return $this->success(['settings' => $settings]);
    }

    public function update(Request $request): JsonResponse
    {
        $data = $request->validate([
            'key' => 'required|string',
            'value' => 'required|string',
        ]);

        $setting = Setting::updateOrCreate(
            ['key' => $data['key']],
            ['value' => $data['value']]
        );

        Cache::forget('settings.all');

        return $this->success(['setting' => $setting], 'Pengaturan berhasil diperbarui.');
    }
}
