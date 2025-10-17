<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\Storage;

class Gallery extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'image',
        'description',
    ];

    protected $appends = ['image_url'];
        public function getImageUrlAttribute()
        {
            if ($this->image && storage::disk('public')->exists($this->image)) {
                return asset('storage/' . $this->image);
            }
            return null;
        }
}
