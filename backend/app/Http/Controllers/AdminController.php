<?php

namespace App\Http\Controllers;

use App\Models\Application;
use App\Models\AttendanceLog;
use App\Models\Contract;
use App\Models\Project;
use App\Models\Settlement;
use App\Models\Worker;
use App\Support\Payroll;
use App\Support\Present;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;

class AdminController extends Controller
{
    private static function withCounts(): array
    {
        return ['positions' => fn ($q) => $q->withCount([
            'applications as approved_count' => fn ($a) => $a->where('status', 'approved'),
            'applications as applicants_count',
        ])];
    }

    private static function load(Project $project): Project
    {
        return $project->load(self::withCounts());
    }

    /** 계약 서명까지 끝나 근무 예정인 지원 건 */
    private static function crew(Project $project)
    {
        return $project->applications()
            ->where('status', 'approved')
            ->whereHas('contract', fn ($q) => $q->whereNotNull('signed_at'))
            ->with(['worker', 'position', 'logs', 'settlement', 'contract'])
            ->get();
    }

    /** 특정 날짜의 근태 상태: 정상|지각|퇴근|미출근|출근 전 */
    private static function dayStatus(Application $app, Carbon $day): array
    {
        $log = $app->logs->first(fn ($l) => $l->work_date->isSameDay($day));
        $start = $day->copy()->setTimeFromTimeString($app->position->start_time);
        if (! $log?->check_in_at) {
            return [$log, now()->gt($start->addMinutes(10)) ? '미출근' : '출근 전'];
        }
        if ($log->check_out_at) {
            return [$log, '퇴근'];
        }

        return [$log, $log->isLate($app->position) ? '지각' : '정상'];
    }

    public function dashboard()
    {
        $today = today();
        $active = Project::whereDate('start_date', '<=', $today)->whereDate('end_date', '>=', $today)->with('positions')->get();

        $sites = [];
        $tot = ['expected' => 0, 'in' => 0, 'late' => 0, 'absent' => 0];
        foreach ($active as $p) {
            $crew = self::crew($p);
            $contracts = $p->applications()->with('contract')->get()->pluck('contract')->filter();
            $counts = ['in' => 0, 'late' => 0, 'absent' => 0];
            foreach ($crew as $app) {
                [, $st] = self::dayStatus($app, $today);
                if (in_array($st, ['정상', '지각', '퇴근'])) {
                    $counts['in']++;
                }
                if ($st === '지각') {
                    $counts['late']++;
                }
                if ($st === '미출근') {
                    $counts['absent']++;
                }
            }
            $tot['expected'] += $crew->count();
            foreach ($counts as $k => $v) {
                $tot[$k] += $v;
            }
            $sites[] = [
                'id' => $p->id,
                'title' => "{$p->brand} {$p->title}",
                'venue' => $p->venue,
                'positions' => $p->positions->count().'개 · '.$p->positions->sum('headcount').'명',
                'attended' => $counts['in'],
                'expected' => $crew->count(),
                'signed' => $contracts->whereNotNull('signed_at')->count(),
                'contracts' => $contracts->count(),
                'late' => $counts['late'],
                'absent' => $counts['absent'],
            ];
        }

        $unsigned = Contract::whereNull('signed_at')->where('expires_at', '>', now())->get();
        $expiring = $unsigned->filter(fn ($c) => $c->state() === 'expiring')->count();
        $payable = Settlement::whereIn('status', ['draft', 'scheduled'])->get();
        $ending = Project::whereDate('end_date', '<=', $today)->whereDate('end_date', '>=', $today->copy()->subDays(3))
            ->whereDoesntHave('applications.settlement', fn ($q) => $q->where('status', '!=', 'draft'))->get();

        $todo = [];
        if ($tot['absent']) {
            $todo[] = ['tone' => 'warning', 'icon' => 'UserX', 'title' => "미출근 {$tot['absent']}명", 'desc' => '출퇴근 현황에서 매니저 확인 또는 대체 인력을 처리하세요', 'to' => 'attend'];
        }
        if ($unsigned->count()) {
            $todo[] = ['tone' => 'info', 'icon' => 'FileSignature', 'title' => "서명 미완료 {$unsigned->count()}건", 'desc' => $expiring ? "만료 임박 {$expiring}건 · 재발송 가능" : '알림톡 재발송 가능', 'to' => 'contract'];
        }
        foreach ($ending as $p) {
            $todo[] = ['tone' => 'brand', 'icon' => 'Wallet', 'title' => '정산 마감 임박', 'desc' => "{$p->brand} {$p->end_date->format('m/d')} 종료, 정산서 발행 대기", 'to' => 'settle', 'projectId' => $p->id];
        }

        return [
            'today' => $today->format('Y-m-d'),
            'kpis' => [
                'activeProjects' => $active->count(),
                'endingThisWeek' => $active->filter(fn ($p) => $p->end_date->lte($today->copy()->addDays(7)))->count(),
                'attended' => $tot['in'],
                'expected' => $tot['expected'],
                'late' => $tot['late'],
                'absent' => $tot['absent'],
                'unsigned' => $unsigned->count(),
                'expiring' => $expiring,
                'payable' => $payable->sum('net'),
                'payableCount' => $payable->count(),
            ],
            'sites' => $sites,
            'todo' => $todo,
        ];
    }

    public function projects()
    {
        return Project::with(self::withCounts())->latest('start_date')->get()->map(fn ($p) => Present::posting($p) + [
            'active' => $p->isActiveOn(now()),
            'ended' => $p->end_date->lt(today()),
        ]);
    }

    public function project(Project $project)
    {
        self::load($project);

        return [
            'id' => (string) $project->id,
            'brand' => $project->brand,
            'organizer' => $project->organizer,
            'title' => $project->title,
            'venue' => $project->venue,
            'area' => $project->area,
            'startDate' => $project->start_date->format('Y-m-d'),
            'endDate' => $project->end_date->format('Y-m-d'),
            'days' => (int) $project->start_date->diffInDays($project->end_date) + 1,
            'manager' => $project->manager,
            'description' => $project->description,
            'status' => $project->end_date->lt(today()) ? '종료' : ($project->isActiveOn(now()) ? '진행 중' : '준비 중'),
            'positions' => $project->positions->map(fn ($r) => [
                'id' => $r->id,
                'name' => $r->name,
                'hours' => $r->hours(),
                'pay' => $r->pay,
                'payType' => $r->pay_type,
                'headcount' => $r->headcount,
                'filled' => $r->approved_count,
                'applicants' => $r->applicants_count,
            ]),
        ];
    }

    public function createProject(Request $request)
    {
        $d = $request->validate([
            'brand' => 'required|string|max:60',
            'organizer' => 'required|string|max:60',
            'contact' => 'required|string|max:20',
            'title' => 'required|string|max:80',
            'venue' => 'nullable|string|max:80',
            'area' => 'nullable|string|max:40',
            'startDate' => 'required|date',
            'endDate' => 'required|date|after_or_equal:startDate',
            'description' => 'nullable|string|max:1000',
            'postedBy' => ['required', Rule::in(['operator', 'agency'])],
            'consent.agreed' => 'required_if:postedBy,operator|boolean',
            'consent.method' => ['required_if:postedBy,operator', 'nullable', Rule::in(['구두', '이메일', '서면'])],
            'consent.date' => 'required_if:postedBy,operator|nullable|date',
            'role' => 'nullable|string|max:40',
            'headcount' => 'nullable|integer|min:1|max:500',
            'pay' => 'nullable|integer|min:10030|max:1000000', // 2026 최저시급 이상
            'payType' => ['nullable', Rule::in(['hourly', 'daily'])],
            'sourceText' => 'nullable|string|max:5000',
        ]);
        if ($d['postedBy'] === 'operator' && empty($d['consent']['agreed'])) {
            throw ValidationException::withMessages(['consent.agreed' => '주관사 동의 없이는 대행 등록할 수 없어요.']);
        }

        $project = DB::transaction(function () use ($d) {
            $operator = $d['postedBy'] === 'operator';
            $p = Project::create([
                'brand' => $d['brand'],
                'organizer' => $d['organizer'],
                'contact' => $d['contact'],
                'title' => $d['title'],
                'venue' => ($d['venue'] ?? null) ?: '미정',
                'area' => $d['area'] ?? '',
                'start_date' => $d['startDate'],
                'end_date' => $d['endDate'],
                'description' => $d['description'] ?? null,
                'source_text' => $d['sourceText'] ?? null,
                'posted_by' => $d['postedBy'],
                'claim_status' => $operator ? 'unclaimed' : 'claimed',
                'consent_agreed' => (bool) ($d['consent']['agreed'] ?? false),
                'consent_method' => $d['consent']['method'] ?? null,
                'consent_date' => $d['consent']['date'] ?? null,
                'attendance_code' => Project::newAttendanceCode(),
            ]);
            if (! empty($d['role'])) {
                $p->positions()->create([
                    'name' => $d['role'],
                    'headcount' => $d['headcount'] ?? 1,
                    'pay' => $d['pay'] ?? 10030,
                    'pay_type' => $d['payType'] ?? 'hourly',
                ]);
            }

            return $p;
        });

        return response(Present::posting(self::load($project)), 201);
    }

    /** 대행 등록 전 중복 의심 공고 — 기간이 겹치고 브랜드가 같거나 장소가 비슷한 것. */
    public function duplicates(Request $request)
    {
        $d = $request->validate([
            'brand' => 'nullable|string|max:60',
            'venue' => 'nullable|string|max:80',
            'startDate' => 'required|date',
            'endDate' => 'required|date',
        ]);
        $brand = trim($d['brand'] ?? '');
        $venue = trim($d['venue'] ?? '');
        $byVenue = mb_strlen($venue) >= 2 && $venue !== '미정';
        if ($brand === '' && ! $byVenue) {
            return [];
        }

        return Project::whereDate('start_date', '<=', $d['endDate'])
            ->whereDate('end_date', '>=', $d['startDate'])
            ->where(fn ($q) => $q
                ->when($brand !== '', fn ($q) => $q->orWhere('brand', $brand))
                ->when($byVenue, fn ($q) => $q->orWhere('venue', 'like', '%'.$venue.'%')))
            ->limit(5)
            ->get()
            ->map(fn (Project $p) => ['id' => (string) $p->id, 'brand' => $p->brand, 'title' => $p->title, 'venue' => $p->venue, 'period' => Present::period($p)]);
    }

    public function updateProject(Request $request, Project $project)
    {
        $d = $request->validate([
            'title' => 'sometimes|required|string|max:80',
            'venue' => 'sometimes|required|string|max:80',
            'area' => 'sometimes|nullable|string|max:40',
            'startDate' => 'sometimes|required|date',
            'endDate' => 'sometimes|required|date',
            'manager' => 'sometimes|nullable|string|max:40',
            'description' => 'sometimes|nullable|string|max:1000',
        ]);
        $project->fill(collect($d)->mapWithKeys(fn ($v, $k) => [str($k)->snake()->toString() => $v])->all());
        if ($project->end_date->lt($project->start_date)) {
            throw ValidationException::withMessages(['endDate' => '종료일은 시작일 이후여야 해요.']);
        }
        $project->save();

        return $this->project($project);
    }

    public function addPosition(Request $request, Project $project)
    {
        $d = $request->validate([
            'name' => 'required|string|max:40',
            'pay' => 'required|integer|min:10030|max:1000000',
            'payType' => ['nullable', Rule::in(['hourly', 'daily'])],
            'headcount' => 'required|integer|min:1|max:500',
            'startTime' => 'required|date_format:H:i',
            'endTime' => 'required|date_format:H:i|after:startTime',
            'breakMinutes' => 'required|integer|min:0|max:180',
        ]);
        $project->positions()->create([
            'name' => $d['name'],
            'pay' => $d['pay'],
            'pay_type' => $d['payType'] ?? 'hourly',
            'headcount' => $d['headcount'],
            'start_time' => $d['startTime'],
            'end_time' => $d['endTime'],
            'break_minutes' => $d['breakMinutes'],
        ]);

        return $this->project($project);
    }

    public function invite(Project $project)
    {
        abort_if($project->claim_status === 'claimed', 422, '이미 주관사가 관리 중인 공고예요.');
        // shortcut: 실제 알림톡·이메일 발송 없이 상태만 바꾼다. 발송 연동 시 여기서 큐 잡 디스패치.
        $project->update(['claim_status' => 'invited']);

        return Present::posting(self::load($project));
    }

    public function applicants(Project $project)
    {
        return $project->applications()
            ->with(['position', 'worker.records', 'contract'])
            ->orderByRaw("case applications.status when 'applied' then 0 when 'held' then 1 when 'approved' then 2 else 3 end")
            ->get()
            ->map(fn (Application $a) => [
                'applicationId' => $a->id,
                'status' => $a->status,
                'position' => $a->position->name,
                'positionId' => $a->position_id,
                'contracted' => (bool) $a->contract,
                'worker' => Present::worker($a->worker),
            ]);
    }

    public function setApplicationStatus(Request $request)
    {
        $d = $request->validate([
            'ids' => 'required|array|min:1',
            'ids.*' => 'integer|exists:applications,id',
            'status' => ['required', Rule::in(['approved', 'held', 'rejected'])],
        ]);

        DB::transaction(function () use ($d) {
            foreach (Application::with(['position', 'contract'])->whereIn('id', $d['ids'])->get() as $app) {
                if ($app->contract?->signed_at && $d['status'] !== 'approved') {
                    throw ValidationException::withMessages(['ids' => '계약이 체결된 지원자는 상태를 바꿀 수 없어요.']);
                }
                if ($d['status'] === 'approved' && $app->status !== 'approved') {
                    $filled = $app->position->applications()->where('status', 'approved')->count();
                    if ($filled >= $app->position->headcount) {
                        throw ValidationException::withMessages(['ids' => "{$app->position->name} 포지션 정원이 가득 찼어요."]);
                    }
                }
                $app->update(['status' => $d['status']]);
                if ($d['status'] !== 'approved') {
                    $app->contract?->delete();
                }
            }
        });

        return ['updated' => count($d['ids'])];
    }

    public function worker(Worker $worker)
    {
        $worker->load('records');

        // 검수 대기 사진은 관리자 상세에서만 미리보기로 내려준다.
        return Present::worker($worker) + [
            'reviewPhotoUrl' => $worker->photo_path ? '/storage/'.$worker->photo_path : null,
        ];
    }

    public function reviewPhoto(Request $request, Worker $worker)
    {
        $d = $request->validate(['status' => ['required', Rule::in(['approved', 'rejected'])]]);
        abort_unless($worker->photo_path, 422, '검수할 사진이 없어요.');
        $worker->update(['photo_status' => $d['status']]);

        return $this->worker($worker);
    }

    public function contracts(Project $project)
    {
        $rows = $project->applications()->where('status', 'approved')->with(['worker', 'position', 'contract'])->get();
        $contracts = $rows->pluck('contract')->filter();
        $signed = $contracts->whereNotNull('signed_at')->count();

        return [
            'kpis' => [
                'sent' => $contracts->count(),
                'signed' => $signed,
                'pending' => $contracts->filter(fn ($c) => in_array($c->state(), ['pending', 'expiring']))->count(),
                'expiring' => $contracts->filter(fn ($c) => $c->state() === 'expiring')->count(),
                'expired' => $contracts->filter(fn ($c) => $c->state() === 'expired')->count(),
                'unsent' => $rows->whereNull('contract')->count(),
            ],
            'rows' => $rows->map(fn ($a) => [
                'applicationId' => $a->id,
                'contractId' => $a->contract?->id,
                'name' => $a->worker->name,
                'position' => $a->position->name,
                'sentAt' => $a->contract?->sent_at->format('m/d H:i'),
                'signedAt' => $a->contract?->signed_at?->format('m/d H:i'),
                'state' => $a->contract?->state() ?? 'unsent',
            ])->values(),
        ];
    }

    /**
     * 승인자 전원에게 계약서 발송.
     * shortcut: 알림톡(알리고) 미연동 — 계약 레코드만 만들고 워커 앱 '지원 현황'에서 서명한다.
     */
    public function sendContracts(Project $project)
    {
        $apps = $project->applications()->where('status', 'approved')->whereDoesntHave('contract')->get();
        foreach ($apps as $app) {
            $app->contract()->create(['sent_at' => now(), 'expires_at' => now()->addDay()]);
        }

        return ['sent' => $apps->count()];
    }

    public function resendContract(Contract $contract)
    {
        abort_if($contract->signed_at, 422, '이미 서명된 계약이에요.');
        $contract->update(['sent_at' => now(), 'expires_at' => now()->addDay()]);

        return ['ok' => true];
    }

    public function attendance(Request $request, Project $project)
    {
        $day = $request->date('date') ?? today();
        $crew = self::crew($project);
        $rows = $crew->map(function (Application $a) use ($day) {
            [$log, $st] = self::dayStatus($a, $day);

            return [
                'applicationId' => $a->id,
                'name' => $a->worker->name,
                'position' => $a->position->name,
                'checkIn' => $log?->check_in_at?->format('H:i'),
                'checkOut' => $log?->check_out_at?->format('H:i'),
                'method' => $log?->check_in_at ? $log->method : null,
                'status' => $st,
            ];
        });

        return [
            'date' => $day->format('Y-m-d'),
            'active' => $project->isActiveOn($day),
            'venue' => $project->venue,
            'code' => $project->attendance_code,
            'kpis' => [
                'expected' => $rows->count(),
                'in' => $rows->whereIn('status', ['정상', '지각', '퇴근'])->count(),
                'late' => $rows->where('status', '지각')->count(),
                'absent' => $rows->where('status', '미출근')->count(),
                'out' => $rows->where('status', '퇴근')->count(),
                'endTime' => $project->positions()->max('end_time'),
            ],
            'rows' => $rows->values(),
        ];
    }

    public function rotateCode(Project $project)
    {
        $project->update(['attendance_code' => Project::newAttendanceCode()]);

        return ['code' => $project->attendance_code];
    }

    /** 현장 매니저 확인으로 출근/퇴근 처리 (QR 미스캔 정정) */
    public function manualAttendance(Request $request, Application $application)
    {
        $d = $request->validate(['action' => ['required', Rule::in(['in', 'out'])]]);
        abort_unless($application->contract?->signed_at, 422, '계약이 체결되지 않았어요.');
        $log = AttendanceLog::today($application->id);
        if ($d['action'] === 'in') {
            abort_if($log->check_in_at, 422, '이미 출근 처리됐어요.');
            $log->fill(['check_in_at' => now(), 'method' => 'manager']);
        } else {
            abort_unless($log->check_in_at && ! $log->check_out_at, 422, '퇴근 처리할 출근 기록이 없어요.');
            $log->check_out_at = now();
        }
        $log->save();

        return ['ok' => true];
    }

    private static function settlementView(Project $project): array
    {
        $apps = $project->applications()->whereHas('settlement')->with(['worker', 'settlement'])->get();
        $s = $apps->pluck('settlement');

        return [
            'issued' => $s->isNotEmpty() && $s->every(fn ($x) => $x->status !== 'draft'),
            'kpis' => [
                'count' => $s->count(),
                'minutes' => $s->sum('minutes'),
                'gross' => $s->sum(fn ($x) => $x->base + $x->extra),
                'tax' => $s->sum('tax'),
                'disputes' => $s->whereNotNull('dispute_note')->count(),
            ],
            'rows' => $apps->map(fn ($a) => [
                'id' => $a->settlement->id,
                'name' => $a->worker->name,
                'days' => $a->settlement->days,
                'minutes' => $a->settlement->minutes,
                'base' => $a->settlement->base,
                'extra' => $a->settlement->extra,
                'tax' => $a->settlement->tax,
                'net' => $a->settlement->net,
                'status' => $a->settlement->status,
                'dispute' => $a->settlement->dispute_note,
            ])->values(),
        ];
    }

    public function settlements(Project $project)
    {
        return self::settlementView($project);
    }

    public function calculate(Project $project)
    {
        Payroll::calculate($project);

        return self::settlementView($project);
    }

    public function issue(Project $project)
    {
        abort_if(Payroll::issue($project) === 0, 422, '발행할 정산서가 없어요. 먼저 급여를 계산해 주세요.');

        return self::settlementView($project);
    }
}
