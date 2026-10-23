<?php

namespace App\Http\Controllers;

use App\Models\Application;
use App\Models\AttendanceLog;
use App\Models\Contract;
use App\Models\Position;
use App\Models\Project;
use App\Models\Settlement;
use App\Models\Worker;
use App\Support\Present;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;
use Illuminate\Validation\ValidationException;

class WorkerController extends Controller
{
    private static function jobQuery()
    {
        return Project::whereHas('positions')->with(['positions' => fn ($q) => $q->withCount([
            'applications as approved_count' => fn ($a) => $a->where('status', 'approved'),
            'applications as applicants_count',
        ])]);
    }

    private function me(Request $request): Worker
    {
        return $request->user();
    }

    // ── 공고 (비로그인 열람 가능) ────────────────────────────

    public function jobs(Request $request)
    {
        $q = trim((string) $request->query('q'));

        return self::jobQuery()
            ->whereDate('end_date', '>=', today())
            ->when($q !== '', fn ($w) => $w->where(fn ($x) => $x->where('title', 'like', "%{$q}%")->orWhere('brand', 'like', "%{$q}%")->orWhere('area', 'like', "%{$q}%")))
            ->orderBy('start_date')
            ->get()
            ->map(fn ($p) => Present::job($p));
    }

    public function job(Request $request, Project $project)
    {
        $job = Present::job(self::jobQuery()->findOrFail($project->id));
        $worker = auth('sanctum')->user();
        $job['myApplication'] = $worker instanceof Worker
            ? Application::where('worker_id', $worker->id)->whereIn('position_id', $project->positions()->pluck('id'))->with('position')->first()?->only(['id', 'status', 'position_id'])
            : null;

        return $job;
    }

    // ── 검카드 ───────────────────────────────────────────

    /** 본인 검카드 — 본인 데이터라 정확값·원문 연락처를 그대로 준다. */
    public function profile(Request $request)
    {
        $w = $this->me($request)->load('records');
        $trust = Present::trust($w->records);

        return [
            'id' => $w->id,
            'phone' => $w->phone,
            'name' => $w->name,
            'gender' => $w->gender,
            'age' => $w->age,
            'area' => $w->area,
            'available' => $w->available,
            'bio' => $w->bio,
            'height' => $w->height,
            'weight' => $w->weight,
            'instagram' => $w->instagram,
            'tags' => $w->tags ?? [],
            'verified' => (bool) ($w->flags['verified'] ?? false),
            'photoStatus' => $w->photo_status,
            'photoUrl' => $w->photo_path ? '/storage/'.$w->photo_path : null,
            'stats' => $trust['stats'],
            'records' => $w->records->map(fn ($r) => Present::record($r))->values(),
        ];
    }

    public function updateProfile(Request $request)
    {
        $d = $request->validate([
            'name' => 'required|string|max:30',
            'gender' => ['nullable', Rule::in(['여', '남'])],
            'age' => 'nullable|integer|min:15|max:80',
            'area' => 'nullable|string|max:30',
            'available' => 'nullable|string|max:40',
            'bio' => 'nullable|string|max:500',
            'height' => 'nullable|integer|min:140|max:210',
            'weight' => 'nullable|integer|min:30|max:150',
            'instagram' => 'nullable|string|max:40',
            'tags' => 'nullable|array|max:12',
            'tags.*' => 'array|size:2',
            'tags.*.0' => ['string', Rule::in(['default', 'pos', 'lang'])],
            'tags.*.1' => 'string|max:20',
        ]);
        // 자기소개에 연락처를 적으면 마스킹이 무력화되므로 저장 단계에서 막는다.
        if (! empty($d['bio']) && preg_match('/01\d[-\s.]?\d{3,4}[-\s.]?\d{4}|@[A-Za-z0-9_.]{3,}|카톡|kakao/iu', $d['bio'])) {
            throw ValidationException::withMessages(['bio' => '자기소개에는 전화번호·SNS를 적을 수 없어요.']);
        }
        $this->me($request)->update($d);

        return $this->profile($request);
    }

    public function uploadPhoto(Request $request)
    {
        $request->validate(['photo' => 'required|image|max:5120']);
        $w = $this->me($request);
        if ($w->photo_path) {
            Storage::disk('public')->delete($w->photo_path);
        }
        $w->update(['photo_path' => $request->file('photo')->store('photos', 'public'), 'photo_status' => 'pending']);

        return $this->profile($request);
    }

    public function addRecord(Request $request)
    {
        $d = $request->validate([
            'organizer' => 'required|string|max:60',
            'project' => 'required|string|max:80',
            'role' => 'required|string|max:40',
            'dates' => 'required|string|max:40',
            'evidence' => 'boolean',
            'visibility' => ['required', Rule::in(['private', 'link', 'public'])],
        ]);
        $this->me($request)->records()->create($d + ['source' => 'self', 'verified' => false]);

        return $this->profile($request);
    }

    // ── 지원 ────────────────────────────────────────────

    public function apply(Request $request)
    {
        $d = $request->validate(['positionId' => 'required|integer|exists:positions,id']);
        $w = $this->me($request);
        if (! $w->name) {
            throw ValidationException::withMessages(['positionId' => '검카드(이름)를 먼저 작성해 주세요.']);
        }
        $position = Position::with('project')->findOrFail($d['positionId']);
        if ($position->project->end_date->lt(today())) {
            throw ValidationException::withMessages(['positionId' => '마감된 공고예요.']);
        }
        if ($position->applications()->where('status', 'approved')->count() >= $position->headcount) {
            throw ValidationException::withMessages(['positionId' => '정원이 모두 찬 포지션이에요.']);
        }
        if (Application::where('worker_id', $w->id)->whereIn('position_id', $position->project->positions()->pluck('id'))->exists()) {
            throw ValidationException::withMessages(['positionId' => '이미 이 공고에 지원했어요.']);
        }

        return response(Application::create(['worker_id' => $w->id, 'position_id' => $position->id])->only(['id', 'status', 'position_id']), 201);
    }

    /** 지원 → 승인 → 계약 → 근무 → 정산 단계를 워커 화면 상태 하나로 접는다. */
    private static function stage(Application $a): array
    {
        $p = $a->position->project;
        $c = $a->contract;
        if ($a->settlement && $a->settlement->status !== 'draft') {
            return ['정산 완료', ['label' => '정산 내역 보기', 'href' => '/worker/settle', 'icon' => 'Wallet']];
        }
        if ($a->status === 'rejected') {
            return ['미선정', null];
        }
        if ($a->status !== 'approved') {
            return ['지원 완료', null];
        }
        if (! $c || ! $c->signed_at) {
            return $c && $c->state() !== 'expired'
                ? ['승인됨', ['label' => '계약 서명하기', 'href' => "/worker/contract?id={$c->id}", 'icon' => 'PenLine']]
                : ['승인됨', null];
        }
        if ($p->isActiveOn(now())) {
            return ['근무중', ['label' => '출근 체크인', 'href' => '/worker/checkin', 'icon' => 'LogIn']];
        }

        return $p->end_date->lt(today()) ? ['근무 종료', null] : ['계약 완료', null];
    }

    public function applications(Request $request)
    {
        return $this->me($request)->applications()
            ->with(['position.project', 'contract', 'settlement'])
            ->latest()
            ->get()
            ->map(function (Application $a) {
                [$status, $action] = self::stage($a);
                $p = $a->position->project;

                return [
                    'id' => $a->id,
                    'jobId' => (string) $p->id,
                    'brand' => $p->brand,
                    'title' => $p->title,
                    'role' => $a->position->name,
                    'dates' => $p->start_date->format('m.d').' ~ '.$p->end_date->format('m.d'),
                    'pay' => number_format($a->position->pay).'원/시',
                    'status' => $status,
                    'action' => $action,
                ];
            });
    }

    // ── 계약 ────────────────────────────────────────────

    private function ownContract(Request $request, ?int $id): ?Contract
    {
        $q = Contract::whereHas('application', fn ($a) => $a->where('worker_id', $this->me($request)->id))
            ->with('application.position.project');

        return $id ? $q->findOrFail($id) : $q->whereNull('signed_at')->where('expires_at', '>', now())->oldest('sent_at')->first();
    }

    private static function contractView(Contract $c, Worker $w): array
    {
        $pos = $c->application->position;
        $p = $pos->project;
        [$sh, $sm] = array_map('intval', explode(':', $pos->start_time));
        [$eh, $em] = array_map('intval', explode(':', $pos->end_time));
        $dailyMinutes = ($eh * 60 + $em) - ($sh * 60 + $sm) - $pos->break_minutes;

        return [
            'id' => $c->id,
            'workerName' => $w->name,
            'brand' => $p->brand,
            'venue' => $p->venue,
            'role' => $pos->name,
            'period' => $p->start_date->format('Y.m.d').' ~ '.$p->end_date->format('m.d').' ('.((int) $p->start_date->diffInDays($p->end_date) + 1).'일)',
            'hours' => $pos->hours(),
            'pay' => $pos->pay,
            'dailyPay' => (int) round($dailyMinutes * $pos->pay / 60),
            'payday' => '근로종료 후 7일 이내',
            'state' => $c->state(),
            'signedAt' => $c->signed_at?->format('Y.m.d H:i'),
            'signature' => $c->signature,
        ];
    }

    public function contract(Request $request)
    {
        $c = $this->ownContract($request, $request->integer('id') ?: null);

        return ['contract' => $c ? self::contractView($c, $this->me($request)) : null];
    }

    public function sign(Request $request, Contract $contract)
    {
        $d = $request->validate(['signature' => 'required|string|max:40', 'agreed' => 'accepted']);
        $c = $this->ownContract($request, $contract->id);
        abort_if($c->signed_at, 422, '이미 서명한 계약이에요.');
        abort_if($c->state() === 'expired', 422, '서명 기한이 지났어요. 대행사에 재발송을 요청해 주세요.');

        $w = $this->me($request);
        $signedAt = now();
        // 무결성: 계약 요약 + 서명 + 시각을 해시로 보관
        $hash = hash('sha256', json_encode(self::contractView($c, $w)).'|'.$d['signature'].'|'.$signedAt->toIso8601String());
        $c->update(['signed_at' => $signedAt, 'signature' => $d['signature'], 'signature_hash' => $hash]);

        return ['contract' => self::contractView($c->fresh('application.position.project'), $w)];
    }

    // ── 출퇴근 (QR 전용) ─────────────────────────────────

    private function todayShift(Request $request): ?Application
    {
        return $this->me($request)->applications()
            ->where('status', 'approved')
            ->whereHas('contract', fn ($q) => $q->whereNotNull('signed_at'))
            ->whereHas('position.project', fn ($q) => $q->whereDate('start_date', '<=', today())->whereDate('end_date', '>=', today()))
            ->with('position.project')
            ->first();
    }

    public function shift(Request $request)
    {
        $a = $this->todayShift($request);
        if (! $a) {
            return ['shift' => null];
        }
        $p = $a->position->project;
        $log = AttendanceLog::today($a->id);

        return ['shift' => [
            'venue' => $p->venue,
            'brand' => $p->brand,
            'role' => $a->position->name,
            'startTime' => $a->position->start_time,
            'endTime' => $a->position->end_time,
            'day' => (int) $p->start_date->diffInDays(today()) + 1,
            'days' => (int) $p->start_date->diffInDays($p->end_date) + 1,
            'checkIn' => $log->check_in_at?->format('H:i'),
            'checkOut' => $log->check_out_at?->format('H:i'),
            'late' => $log->exists && $log->isLate($a->position),
        ]];
    }

    /**
     * 현장 매니저 QR(=프로젝트 출근 코드) 확인 후 출근, 출근 상태면 퇴근.
     * shortcut: 카메라 스캔 대신 QR 아래 6자리 코드를 입력받는다. PWA 카메라 스캐너 붙이면 같은 엔드포인트로 code 전송.
     */
    public function attend(Request $request)
    {
        $code = $request->validate(['code' => 'required|string|size:6'])['code'];
        $a = $this->todayShift($request);
        abort_unless($a, 422, '오늘 예정된 근무가 없어요.');
        if (! hash_equals($a->position->project->attendance_code, $code)) {
            throw ValidationException::withMessages(['code' => 'QR 코드가 일치하지 않아요. 현장 매니저 QR을 다시 확인해 주세요.']);
        }
        $log = AttendanceLog::today($a->id);
        if (! $log->check_in_at) {
            $log->fill(['check_in_at' => now(), 'method' => 'qr']);
        } elseif (! $log->check_out_at) {
            // 출근 직후 중복 스캔으로 바로 퇴근 처리되는 것을 막는다.
            abort_if($log->check_in_at->gt(now()->subMinutes(10)), 422, '방금 출근 처리됐어요. 퇴근은 근무 종료 후 스캔해 주세요.');
            $log->check_out_at = now();
        } else {
            abort(422, '오늘 출퇴근을 모두 마쳤어요.');
        }
        $log->save();

        return $this->shift($request);
    }

    // ── 정산 ────────────────────────────────────────────

    public function settlements(Request $request)
    {
        return Settlement::whereHas('application', fn ($q) => $q->where('worker_id', $this->me($request)->id))
            ->where('status', '!=', 'draft')
            ->with('application.position.project')
            ->latest('issued_at')
            ->get()
            ->map(fn (Settlement $s) => [
                'id' => $s->id,
                'project' => $s->application->position->project->brand.' '.$s->application->position->project->title,
                'days' => $s->days,
                'minutes' => $s->minutes,
                'pay' => $s->application->position->pay,
                'base' => $s->base,
                'extra' => $s->extra,
                'tax' => $s->tax,
                'net' => $s->net,
                'status' => $s->status,
                'payDate' => $s->application->position->project->end_date->addDays(7)->format('m/d'),
                'dispute' => $s->dispute_note,
            ]);
    }

    public function dispute(Request $request, Settlement $settlement)
    {
        $d = $request->validate(['note' => 'required|string|min:5|max:500']);
        abort_unless($settlement->application->worker_id === $this->me($request)->id, 404);
        $settlement->update(['dispute_note' => $d['note'], 'disputed_at' => now()]);

        return ['ok' => true];
    }
}
