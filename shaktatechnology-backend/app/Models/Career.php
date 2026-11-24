<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Career extends Model
{
    use HasFactory;
    protected $fillable = [
        'title',
        'slug',
        'department',
        'location',
        'type',
        'description',
        'requirements',
        'benefits',
        'is_active',
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];

    public static function generateUniqueSlug(string $source, ?int $ignoreId = null): string
    {
        $baseSlug = \Illuminate\Support\Str::slug($source) ?: 'career';
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

        static::creating(function ($career) {
            $career->slug = static::generateUniqueSlug($career->slug ?: $career->title);
        });

        static::updating(function ($career) {
            if ($career->isDirty('slug') && !empty($career->slug)) {
                $career->slug = static::generateUniqueSlug($career->slug, $career->id);
            } elseif (empty($career->slug)) {
                $career->slug = static::generateUniqueSlug($career->title, $career->id);
            }
        });
    }
}
