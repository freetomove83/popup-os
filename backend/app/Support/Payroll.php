<?php

namespace App\Support;

use App\Models\Application;
use App\Models\AttendanceLog;
use App\Models\Project;
use App\Models\Settlement;
use App\Models\WorkRecord;
use Illuminate\Support\Facades\DB;

/**
 * 출퇴근 로그 → 급여 계산.
 * shortcut: 가산·주휴수당은 0, 원천징수는 3.3% 고정(10원 미만 절사). 일용근로소득 선택·정산 규칙 테이블이 생기면 교체.
 */
class Payroll
{
    public const TAX_RATE = 0.033;

    /** 하루 근무 분(分). 4시간 초과 근무일만 포지션 휴게시간을 뺀다. */
    public static function workedMinutes(AttendanceLog $log, int $breakMinutes): int
    {
        if (! $log->check_in_at || ! $log->check_out_at) {
            return 0;
        }
        $raw = (int) $log->check_in_at->diffInMinutes($log->check_out_at);

        return max(0, $raw > 240 ? $raw - $breakMinutes : $raw);
    }

    public static function compute(Application $app): array
    {
        $pos = $app->position;
        $days = 0;
        $minutes = 0;
        foreach ($app->logs as $log) {
            $m = self::workedMinutes($log, $pos->break_minutes);
            if ($m > 0) {
                $days++;
                $minutes += $m;
            }
        }
        $base = (int) round($minutes * $pos->pay / 60);
        $tax = (int) (floor($base * self::TAX_RATE / 10) * 10);

        return ['days' => $days, 'minutes' => $minutes, 'base' => $base, 'extra' => 0, 'tax' => $tax, 'net' => $base - $tax];
    }

    /** 서명 완료 계약 대상자의 정산서를 (재)계산한다. 발행된 정산서는 건드리지 않는다. */
    public static function calculate(Project $project): void
    {
        $apps = $project->applications()
            ->whereHas('contract', fn ($q) => $q->whereNotNull('signed_at'))
            ->with(['position', 'logs', 'settlement'])
            ->get();

        foreach ($apps as $app) {
            if ($app->settlement && $app->settlement->status !== 'draft') {
                continue;
            }
            Settlement::updateOrCreate(['application_id' => $app->id], self::compute($app) + ['status' => 'draft']);
        }
    }

    /** 정산서 발행 — 지급 예정으로 확정하고 워커 커리어에 인증 이력을 남긴다. */
    public static function issue(Project $project): int
    {
        $apps = $project->applications()
            ->whereHas('settlement', fn ($q) => $q->where('status', 'draft'))
            ->with(['position', 'logs', 'settlement'])
            ->get();

        DB::transaction(function () use ($apps, $project) {
            foreach ($apps as $app) {
                $app->settlement->update(['status' => 'scheduled', 'issued_at' => now()]);

                $worked = $app->logs->filter(fn ($l) => $l->check_in_at);
                $status = $worked->isEmpty() ? '노쇼' : ($worked->contains(fn ($l) => $l->isLate($app->position)) ? '지각' : '완료');
                WorkRecord::updateOrCreate(
                    ['worker_id' => $app->worker_id, 'project_id' => $project->id, 'source' => 'platform'],
                    [
                        'organizer' => $project->brand,
                        'project' => $project->title,
                        'role' => $app->position->name,
                        'dates' => Present::period($project),
                        'verified' => true,
                        'status' => $status,
                        'visibility' => 'public',
                    ],
                );
            }
        });

        return $apps->count();
    }
}
