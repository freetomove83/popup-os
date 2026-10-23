<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasManyThrough;
use Illuminate\Support\Carbon;

class Project extends Model
{
    protected $guarded = [];

    protected function casts(): array
    {
        return [
            'start_date' => 'date',
            'end_date' => 'date',
            'consent_date' => 'date',
            'consent_agreed' => 'boolean',
            'tags' => 'array',
        ];
    }

    public function positions(): HasMany
    {
        return $this->hasMany(Position::class);
    }

    public function applications(): HasManyThrough
    {
        return $this->hasManyThrough(Application::class, Position::class);
    }

    public static function newAttendanceCode(): string
    {
        return str_pad((string) random_int(0, 999999), 6, '0', STR_PAD_LEFT);
    }

    public function isActiveOn(Carbon $day): bool
    {
        return $day->betweenIncluded($this->start_date->startOfDay(), $this->end_date->endOfDay());
    }

    /** 시작 전이면 시작까지, 진행 중이면 종료까지 남은 일수 */
    public function dday(): int
    {
        $today = today();
        $target = $today->lt($this->start_date) ? $this->start_date : $this->end_date;

        return max(0, (int) $today->diffInDays($target));
    }

    /** 모집중|마감임박|마감 — positions.approved_count 가 로드돼 있어야 정확하다 */
    public function recruitStatus(): string
    {
        $headcount = $this->positions->sum('headcount');
        $filled = $this->positions->sum(fn ($p) => $p->approved_count ?? 0);
        if ($this->end_date->lt(today()) || ($headcount > 0 && $filled >= $headcount)) {
            return '마감';
        }

        return $this->dday() <= 3 ? '마감임박' : '모집중';
    }
}
