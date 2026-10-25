<?php

namespace Tests\Unit;

use App\Models\Application;
use App\Models\AttendanceLog;
use App\Models\Position;
use App\Support\Payroll;
use Illuminate\Support\Carbon;
use Tests\TestCase;

class PayrollTest extends TestCase
{
    /** 9:30~18:30 근무(휴게 60분) 이틀. */
    private function app(array $position): Application
    {
        $log = fn (string $day) => new AttendanceLog([
            'check_in_at' => Carbon::parse("$day 09:30"),
            'check_out_at' => Carbon::parse("$day 18:30"),
        ]);

        return (new Application)
            ->setRelation('position', new Position($position + ['break_minutes' => 60, 'start_time' => '09:30', 'end_time' => '18:30']))
            ->setRelation('logs', collect([$log('2026-10-29'), $log('2026-10-30'), new AttendanceLog]));
    }

    public function test_hourly_pays_worked_minutes(): void
    {
        $r = Payroll::compute($this->app(['pay' => 12000, 'pay_type' => 'hourly']));

        $this->assertSame([2, 960, 192000, 6330], [$r['days'], $r['minutes'], $r['base'], $r['tax']]);
    }

    public function test_daily_pays_per_worked_day(): void
    {
        $r = Payroll::compute($this->app(['pay' => 110000, 'pay_type' => 'daily']));

        // 출근 기록 없는 날은 빠지고, 3.3%는 10원 미만 절사
        $this->assertSame([2, 220000, 7260, 212740], [$r['days'], $r['base'], $r['tax'], $r['net']]);
    }

    public function test_daily_pay_for_contract(): void
    {
        $this->assertSame(96000, (new Position(['pay' => 12000, 'pay_type' => 'hourly', 'start_time' => '09:30', 'end_time' => '18:30', 'break_minutes' => 60]))->dailyPay());
        $this->assertSame(140000, (new Position(['pay' => 140000, 'pay_type' => 'daily']))->dailyPay());
    }
}
