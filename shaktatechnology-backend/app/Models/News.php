<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class News extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
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
}
