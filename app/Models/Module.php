<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Module extends Model
{
    protected $fillable = [
        'title',
    ];

    public function course_module()
    {
        return $this->belongsTo(CourseModule::class);
    }
}
