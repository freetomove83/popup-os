<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class WorkRecord extends Model
{
    protected $guarded = [];

    protected function casts(): array
    {
        return ['verified' => 'boolean', 'evidence' => 'boolean'];
    }
}
