<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Position extends Model
{
    protected $guarded = [];

    protected function casts(): array
    {
        return ['tags' => 'array'];
    }

    public function project(): BelongsTo
    {
        return $this->belongsTo(Project::class);
    }

    public function applications(): HasMany
    {
        return $this->hasMany(Application::class);
    }

    public function hours(): string
    {
        $break = $this->break_minutes ? ' (휴게 '.($this->break_minutes % 60 ? $this->break_minutes.'m' : ($this->break_minutes / 60).'h').')' : '';

        return "{$this->start_time}~{$this->end_time}{$break}";
    }
}
