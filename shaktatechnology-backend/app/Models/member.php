<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Member extends Model
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
        'education',
        'member_order',
        'is_active'
    ];

    protected $casts = [
        'is_active' => 'boolean',
    ];
}
