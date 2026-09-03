<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
class Guide extends Model
{
    use HasFactory;
    protected $fillable = ['step_number', 'title', 'description', 'icon', 'is_active'];
    protected $casts = ['is_active' => 'boolean'];
}
