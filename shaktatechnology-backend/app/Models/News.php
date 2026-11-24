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
        'meta_title',
        'meta_description',
        'meta_keywords',
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

    public static function generateUniqueSlug(string $source, ?int $ignoreId = null): string
    {
        $baseSlug = \Illuminate\Support\Str::slug($source) ?: 'post';
        $slug = $baseSlug;
        $counter = 2;

        while (
            static::where('slug', $slug)
                ->when($ignoreId !== null, fn ($q) => $q->where('id', '!=', $ignoreId))
                ->exists()
        ) {
            $slug = "{$baseSlug}-{$counter}";
            $counter++;
        }

        return $slug;
    }

    protected static function boot()
    {
        parent::boot();

        static::creating(function ($news) {
            $news->slug = static::generateUniqueSlug($news->slug ?: $news->title);
        });

        static::updating(function ($news) {
            if ($news->isDirty('slug') && !empty($news->slug)) {
                $news->slug = static::generateUniqueSlug($news->slug, $news->id);
            } elseif (empty($news->slug)) {
                $news->slug = static::generateUniqueSlug($news->title, $news->id);
            }
        });
    }
}
