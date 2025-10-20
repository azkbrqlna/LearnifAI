<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Module extends Model
{
    protected $fillable = [
        'course_modules_id',
        'title',
        'slug',
    ];

    public function course_module()
    {
        return $this->belongsTo(CourseModule::class, 'course_modules_id');
    }

    public function materials()
    {
        return $this->hasMany(Material::class, 'module_id');
    }
}
