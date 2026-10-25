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

    public function isDaily(): bool
    {
        return $this->pay_type === 'daily';
    }

    /** 하루 급여. 일급이면 그대로, 시급이면 소정근로시간(휴게 제외) 기준. */
    public function dailyPay(): int
    {
        if ($this->isDaily()) {
            return $this->pay;
        }
        [$sh, $sm] = array_map('intval', explode(':', $this->start_time));
        [$eh, $em] = array_map('intval', explode(':', $this->end_time));

        return (int) round((($eh * 60 + $em) - ($sh * 60 + $sm) - $this->break_minutes) * $this->pay / 60);
    }

    public function hours(): string
    {
        $break = $this->break_minutes ? ' (휴게 '.($this->break_minutes % 60 ? $this->break_minutes.'m' : ($this->break_minutes / 60).'h').')' : '';

        return "{$this->start_time}~{$this->end_time}{$break}";
    }
}
