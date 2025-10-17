<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class member extends Model
{
    use HasFactory;
    protected $fillable = [
        'name',
        'email',
        'phone',
        'department',
        'position',
        'role',
        'experience',
        'projects_involved',
        'image',
        'about',
        'linkedin',
        'facebook',
        'instagram',
        'github',
        'address',
        'short_description',
        'training',
        'education',
        'reference'
    ];
}
