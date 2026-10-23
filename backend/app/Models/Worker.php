<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Laravel\Sanctum\HasApiTokens;

class Worker extends Authenticatable
{
    use HasApiTokens;

    protected $guarded = [];

    protected function casts(): array
    {
        return ['flags' => 'array', 'tags' => 'array'];
    }

    public function records(): HasMany
    {
        return $this->hasMany(WorkRecord::class)->latest('id');
    }

    public function applications(): HasMany
    {
        return $this->hasMany(Application::class);
    }
}
