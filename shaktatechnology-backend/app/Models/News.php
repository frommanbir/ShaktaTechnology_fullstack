<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class News extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'slug',
        'description',
        'category',
        'author',
        'read_time',
        'featured',
        'date',
        'image',
    ];

    protected $casts = [
        'featured' => 'boolean',
        'date' => 'date',
    ];

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($news) {
            if (empty($news->slug)) {
                $news->slug = \Illuminate\Support\Str::slug($news->title);
            }
        });

        static::updating(function ($news) {
            if ($news->isDirty('title') && empty($news->slug)) {
                $news->slug = \Illuminate\Support\Str::slug($news->title);
            }
        });
    }
}
