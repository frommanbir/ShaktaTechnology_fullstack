<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Project extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'description',
        'category',
        'client',
        'duration',
        'technologies',
        'key_results',
        'image',
    ];

    protected $casts = [
        'technologies' => 'array',
        'key_results' => 'array',
    ];
}
