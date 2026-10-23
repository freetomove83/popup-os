<?php

namespace App\Support;

use App\Models\Project;
use App\Models\Worker;
use App\Models\WorkRecord;
use Illuminate\Support\Collection;

/**
 * API 응답 모양을 프론트 타입(client/src/data/*.ts)과 맞춘다.
 * 신체 정확값·연락처 원문은 여기서 걸러 내보내지 않는다(구간 하한·마스킹 값만).
 */
class Present
{
    private const TONES = ['brand', 'pop', 'info', 'danger', 'neutral', 'dark'];

    public static function maskPhone(?string $v): ?string
    {
        if (! $v) {
            return null;
        }
        $d = preg_replace('/\D/', '', $v);

        return strlen($d) < 7 ? '****' : substr($d, 0, 3).'-****-'.substr($d, -4);
    }

    public static function maskHandle(?string $v): ?string
    {
        if (! $v) {
            return null;
        }
        $h = ltrim($v, '@');

        return mb_strlen($h) <= 2 ? '@***' : '@'.mb_substr($h, 0, 2).'***';
    }

    public static function bucket(?int $v): ?int
    {
        return $v === null ? null : intdiv($v, 5) * 5;
    }

    public static function initials(?string $name): string
    {
        $name = trim((string) $name);
        if ($name === '') {
            return '?';
        }
        if (preg_match('/\p{Hangul}/u', $name)) {
            return mb_substr($name, 0, 2);
        }
        $words = preg_split('/\s+/', $name);

        return mb_strtoupper(count($words) > 1 ? mb_substr($words[0], 0, 1).mb_substr($words[1], 0, 1) : mb_substr($name, 0, 2));
    }

    /** 플랫폼(인증) 이력만으로 신뢰 지표를 계산한다. 자기기입 이력은 반영하지 않는다. */
    public static function trust(Collection $records): array
    {
        $platform = $records->where('source', 'platform');
        $total = $platform->count();
        $noShow = $platform->where('status', '노쇼')->count();
        $late = $platform->where('status', '지각')->count();
        $byOrg = $platform->whereIn('status', ['완료', '지각'])->countBy('organizer');
        $rehired = $byOrg->filter(fn ($n) => $n >= 2)->count();

        $pct = fn (int $n) => $total ? (int) round($n / $total * 100) : null;
        $noShowPct = $pct($noShow);
        $latePct = $pct($late);
        $rate = fn (?int $p) => $p === null ? null : ($p === 0 ? 'success' : ($p >= 10 ? 'danger' : 'warning'));

        return [
            'total' => $total,
            'noShowPct' => $noShowPct,
            'stats' => [
                ['label' => '노쇼율', 'value' => $noShowPct === null ? '—' : "{$noShowPct}%", 'tone' => $rate($noShowPct), 'note' => "표본 {$total}건"],
                ['label' => '완료 건수', 'value' => (string) ($total - $noShow)],
                ['label' => '재고용률', 'value' => $byOrg->isEmpty() ? '—' : (int) round($rehired / $byOrg->count() * 100).'%', 'tone' => $byOrg->isEmpty() ? null : 'brand', 'note' => $byOrg->isEmpty() ? '데이터 없음' : "재고용 {$rehired}/{$byOrg->count()}"],
                ['label' => '지각률', 'value' => $latePct === null ? '—' : "{$latePct}%", 'tone' => $rate($latePct)],
            ],
        ];
    }

    public static function record(WorkRecord $r): array
    {
        return [
            'id' => (string) $r->id,
            'organizer' => $r->organizer,
            'project' => $r->project,
            'role' => $r->role,
            'dates' => $r->dates,
            'source' => $r->source,
            'verified' => $r->verified,
            'status' => $r->status,
            'evidence' => $r->evidence,
            'visibility' => $r->visibility,
        ];
    }

    /** 대행사(관리자)가 보는 검카드. 비공개 자기기입 이력은 제외한다. */
    public static function worker(Worker $w): array
    {
        $records = $w->records;
        $trust = self::trust($records);
        $flags = (array) $w->flags;
        $flags['newcomer'] = $trust['total'] === 0;
        $flags['caution'] = ($flags['caution'] ?? false) || ($trust['noShowPct'] ?? 0) >= 10;

        $meta = array_filter([
            $w->gender,
            $w->age ? "{$w->age}세" : null,
            $w->nationality,
            $w->area,
            $w->available ? "가능일 {$w->available}" : null,
        ]);

        return [
            'id' => (string) $w->id,
            'ini' => self::initials($w->name),
            'tone' => self::TONES[$w->id % count(self::TONES)],
            'name' => $w->name ?? '(이름 미입력)',
            'gender' => $w->gender ?? '—',
            'age' => $w->age ?? 0,
            'area' => $w->area ?? '—',
            'available' => $w->available ?? '—',
            'meta' => implode(' · ', $meta),
            'flags' => $flags,
            'stats' => $trust['stats'],
            'tags' => $w->tags ?? [],
            'note' => $flags['newcomer'],
            'act' => $flags['caution'] ? 'caution' : ($flags['newcomer'] ? 'trial' : 'approve'),
            'photoStatus' => $w->photo_status,
            'photoUrl' => $w->photo_status === 'approved' && $w->photo_path ? '/storage/'.$w->photo_path : null,
            'height' => self::bucket($w->height) ?? 0,
            'weight' => self::bucket($w->weight) ?? 0,
            'bio' => $w->bio,
            'contact' => $w->phone ? ['type' => 'phone', 'value' => self::maskPhone($w->phone)] : null,
            'instagram' => self::maskHandle($w->instagram),
            'history' => $records->where('visibility', '!=', 'private')->map(fn ($r) => self::record($r))->values(),
        ];
    }

    public static function period(Project $p): string
    {
        return $p->start_date->format('Y.m.d').'~'.$p->end_date->format('m.d');
    }

    /** 워커 앱 공고. positions 는 approved_count 와 함께 로드돼 있어야 한다. */
    public static function job(Project $p): array
    {
        return [
            'id' => (string) $p->id,
            'brand' => $p->brand,
            'organizer' => $p->organizer,
            'ownerVerified' => $p->claim_status === 'claimed',
            'title' => $p->title,
            'venue' => $p->venue,
            'area' => $p->area,
            'startDate' => $p->start_date->format('Y.m.d'),
            'endDate' => $p->end_date->format('Y.m.d'),
            'dday' => $p->dday(),
            'status' => $p->recruitStatus(),
            'roles' => $p->positions->map(fn ($r) => [
                'id' => $r->id,
                'name' => $r->name,
                'pay' => $r->pay,
                'hours' => $r->hours(),
                'headcount' => $r->headcount,
                'filled' => $r->approved_count ?? 0,
                'tags' => $r->tags ?? [],
            ])->values(),
            'tags' => $p->tags ?? [],
            'desc' => $p->description ?? '',
            'applicants' => $p->positions->sum('applicants_count'),
        ];
    }

    /** 관리자 공고(대행 등록) 목록 행. */
    public static function posting(Project $p): array
    {
        return [
            'id' => (string) $p->id,
            'brand' => $p->brand,
            'organizer' => $p->organizer,
            'contact' => self::maskPhone($p->contact) ?? '—',
            'consent' => [
                'agreed' => $p->consent_agreed,
                'method' => $p->consent_method,
                'date' => $p->consent_date?->format('Y-m-d'),
            ],
            'postedBy' => $p->posted_by,
            'claimStatus' => $p->claim_status,
            'title' => $p->title,
            'venue' => $p->venue,
            'period' => self::period($p),
            'dday' => $p->dday(),
            'status' => $p->recruitStatus(),
            'roles' => $p->positions->count(),
            'headcount' => $p->positions->sum('headcount'),
            'filled' => $p->positions->sum('approved_count'),
            'applicants' => $p->positions->sum('applicants_count'),
        ];
    }
}
