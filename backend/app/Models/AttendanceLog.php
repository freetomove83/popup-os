<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class AttendanceLog extends Model
{
    protected $guarded = [];

    protected function casts(): array
    {
        return ['work_date' => 'date', 'check_in_at' => 'datetime', 'check_out_at' => 'datetime'];
    }

    /** 오늘 로그(없으면 저장 전 새 인스턴스). date 캐스트는 시각까지 저장되므로 whereDate 로 찾는다. */
    public static function today(int $applicationId): self
    {
        return self::where('application_id', $applicationId)->whereDate('work_date', today())->first()
            ?? new self(['application_id' => $applicationId, 'work_date' => today()]);
    }

    public function application(): BelongsTo
    {
        return $this->belongsTo(Application::class);
    }

    /** 근무 시작 10분 초과 체크인은 지각 */
    public function isLate(Position $position): bool
    {
        if (! $this->check_in_at) {
            return false;
        }
        $start = $this->work_date->copy()->setTimeFromTimeString($position->start_time);

        return $this->check_in_at->gt($start->addMinutes(10));
    }
}
