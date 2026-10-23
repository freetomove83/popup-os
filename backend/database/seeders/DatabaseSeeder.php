<?php

namespace Database\Seeders;

use App\Models\Application;
use App\Models\Project;
use App\Models\User;
use App\Models\Worker;
use App\Support\Payroll;
use Illuminate\Database\Seeder;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\Storage;

/**
 * 로컬 개발용 데모 데이터. 날짜는 실행일 기준 상대값이라 언제 시드해도
 * "오늘 진행 중인 현장 / 서명 대기 / 정산 발행됨" 상태가 갖춰진다.
 * 브랜드·행사명은 모두 가상(실제 브랜드명 금지 규칙).
 *
 * 로컬 테스트 계정
 *   관리자: admin@popup-os.test / popupos-dev-2026
 *   워커:   휴대폰 010-4821-7733 (김지은) — 인증번호는 local 환경에서 화면에 표시된다.
 */
class DatabaseSeeder extends Seeder
{
    public function run(): void
    {
        User::updateOrCreate(['email' => 'admin@popup-os.test'], ['name' => '김매니저', 'password' => 'popupos-dev-2026']);

        $d = fn (int $offset) => today()->addDays($offset);
        $project = function (array $attrs, array $positions) {
            $p = Project::create($attrs + ['attendance_code' => Project::newAttendanceCode()]);
            foreach ($positions as [$name, $pay, $start, $end, $break, $hc, $tags]) {
                $p->positions()->create(['name' => $name, 'pay' => $pay, 'start_time' => $start, 'end_time' => $end, 'break_minutes' => $break, 'headcount' => $hc, 'tags' => $tags]);
            }

            return $p->load('positions');
        };
        $consent = fn (string $method, int $daysAgo) => ['consent_agreed' => true, 'consent_method' => $method, 'consent_date' => today()->subDays($daysAgo)];

        $mood = $project([
            'brand' => '무드랩', 'organizer' => '(주)무드랩', 'title' => 'MOMENT POPUP 팝업 운영 스태프',
            'venue' => '더현대 서울 5F 이벤트홀', 'area' => '서울 영등포', 'start_date' => $d(-1), 'end_date' => $d(1),
            'manager' => '김매니저', 'tags' => ['#POS숙달', '#응대', '#외국어우대'], 'contact' => '01031208890',
            'description' => '무드랩 팝업스토어 운영 스태프를 모집합니다. 고객 응대·제품 안내·재고 정리 업무입니다.',
            'posted_by' => 'agency', 'claim_status' => 'claimed',
        ] + $consent('이메일', 30), [
            ['운영 스태프(프로모터)', 12000, '10:00', '19:00', 60, 12, ['#POS숙달', '#응대']],
            ['서버', 13000, '11:00', '20:00', 60, 4, ['#음료', '#응대']],
            ['상하차', 14000, '08:00', '12:00', 0, 3, ['#체력직']],
        ]);

        $nyc = $project([
            'brand' => '뉴욕의 거장들', 'organizer' => '(주)뉴욕의거장들', 'title' => '미술 전시 팝업 안내·운영',
            'venue' => '롯데백화점 잠실 1F', 'area' => '서울 송파', 'start_date' => $d(3), 'end_date' => $d(7),
            'tags' => ['#전시', '#안내', '#주말가능'], 'contact' => '01044120931',
            'description' => '미술 전시 팝업의 관람 안내와 현장 운영을 담당할 스태프를 모집합니다.',
            'posted_by' => 'operator', 'claim_status' => 'invited',
        ] + $consent('서면', 10), [
            ['안내 스태프', 12500, '10:30', '19:30', 60, 8, ['#안내', '#전시']],
            ['운영 리더', 16000, '09:30', '19:30', 60, 2, ['#리더경험']],
        ]);

        $project([
            'brand' => '퍼스트 라운딩', 'organizer' => '(주)퍼스트라운딩', 'title' => '성수 팝업 물류·상하차',
            'venue' => '성수 팝업존 B동', 'area' => '서울 성동', 'start_date' => $d(1), 'end_date' => $d(2),
            'tags' => ['#상하차가능', '#조기출근'], 'contact' => '01077452213',
            'description' => '팝업 물류 상하차 및 진열 보조. 이른 시간 근무 가능한 분 우대.',
            'posted_by' => 'operator', 'claim_status' => 'unclaimed',
        ] + $consent('구두', 5), [
            ['상하차', 15000, '07:00', '11:00', 0, 6, ['#체력직', '#조기출근']],
        ]);

        $project([
            'brand' => '티랩(T-LAB)', 'organizer' => '(주)티랩', 'title' => '신제품 체험 부스 운영',
            'venue' => '코엑스 D홀', 'area' => '서울 강남', 'start_date' => $d(10), 'end_date' => $d(13),
            'tags' => ['#부스운영', '#외국어가능'], 'contact' => '01055107734',
            'description' => '신제품 체험 부스 운영 및 시연. 영어 응대 가능자 우대.',
            'posted_by' => 'agency', 'claim_status' => 'claimed',
        ] + $consent('구두', 20), [
            ['부스 운영', 13000, '10:00', '18:00', 60, 10, ['#부스운영', '#외국어가능']],
            ['시연 진행', 15000, '10:00', '18:00', 60, 4, ['#시연', '#발표']],
        ]);

        $project([
            'brand' => '어반핏 스탠다드', 'organizer' => '(주)어반핏', 'title' => '성수 팝업 판매·응대 스태프',
            'venue' => '어반핏 성수 쇼룸', 'area' => '서울 성동', 'start_date' => $d(7), 'end_date' => $d(16),
            'tags' => ['#판매', '#응대'], 'contact' => '01022884471',
            'description' => '패션 팝업 판매·응대 스태프. 피팅룸 관리 포함.',
            'posted_by' => 'operator', 'claim_status' => 'unclaimed',
        ] + $consent('구두', 3), [
            ['판매 스태프', 12000, '11:00', '20:00', 60, 10, ['#판매']],
            ['피팅룸', 11500, '11:00', '20:00', 60, 4, ['#응대']],
        ]);

        $project([
            'brand' => '데일리글로우', 'organizer' => '(주)데일리글로우', 'title' => 'N차 팝업 뷰티 체험 운영',
            'venue' => '홍대 N스퀘어', 'area' => '서울 마포', 'start_date' => $d(3), 'end_date' => $d(6),
            'tags' => ['#뷰티', '#체험'], 'contact' => '01033719025',
            'description' => '뷰티 체험존 운영과 샘플 안내.',
            'posted_by' => 'operator', 'claim_status' => 'invited',
        ] + $consent('이메일', 6), [
            ['체험 안내', 12500, '10:00', '19:00', 60, 6, ['#뷰티']],
            ['계산대', 12500, '10:00', '19:00', 60, 4, ['#POS숙달']],
        ]);

        // 이미 끝난 행사 — 정산서 발행 + 커리어 인증 이력 생성용
        $past = $project([
            'brand' => '베러스킨', 'organizer' => '(주)베러스킨', 'title' => '메이크업 체험 부스 운영',
            'venue' => '코엑스 마곡', 'area' => '서울 강서', 'start_date' => $d(-20), 'end_date' => $d(-18),
            'manager' => '김매니저', 'tags' => ['#뷰티'], 'contact' => '01055107734',
            'posted_by' => 'operator', 'claim_status' => 'claimed',
        ] + $consent('이메일', 40), [
            ['메이크업 체험', 12000, '10:00', '19:00', 60, 6, ['#뷰티']],
        ]);

        $worker = fn (array $a, array $records = []) => tap(Worker::create($a), function (Worker $w) use ($records) {
            foreach ($records as [$org, $proj, $role, $dates, $source, $status, $vis]) {
                $w->records()->create(['organizer' => $org, 'project' => $proj, 'role' => $role, 'dates' => $dates, 'source' => $source, 'verified' => $source === 'platform', 'status' => $status, 'evidence' => $source === 'self' && $vis === 'public', 'visibility' => $vis]);
            }
        });

        $kim = $worker([
            'phone' => '01048217733', 'name' => '김지은', 'gender' => '여', 'age' => 28, 'area' => '서울 마포', 'available' => '평일·주말 전체',
            'bio' => '향수·뷰티 팝업 프로모터 2년. POS·재고정리 능숙, 일본어 응대 가능.', 'height' => 168, 'weight' => 52, 'instagram' => '@jieun_kim',
            'flags' => ['verified' => true], 'tags' => [['pos', '#POS숙달'], ['default', '#프로모터 경력 2년'], ['lang', '#일어가능']],
        ], [
            ['뉴욕의 거장들', '미술 전시 팝업', '안내 스태프', '2026.08.20~08.24', 'platform', '완료', 'public'],
            ['퍼스트 라운딩', '성수 팝업 운영', '서버', '2026.07.30', 'platform', '지각', 'link'],
            ['무드랩', '봄 시즌 팝업', '운영 스태프', '2026.04.11~04.13', 'platform', '완료', 'public'],
            ['어반핏 스탠다드', '성수 팝업', '판매 스태프', '2026.06.10~06.15', 'self', null, 'public'],
        ]);
        $sky = $worker([
            'phone' => '01055512233', 'name' => '이하늘', 'gender' => '여', 'age' => 22, 'area' => '인천', 'available' => '주말',
            'bio' => '첫 팝업 근무입니다. 성실하게 배우겠습니다.', 'height' => 162, 'weight' => 47,
            'tags' => [['pos', '#POS숙달'], ['default', '#첫 근무']],
        ]);
        $emma = $worker([
            'phone' => '01077784521', 'name' => 'Emma Müller', 'gender' => '여', 'age' => 25, 'nationality' => '독일 · 체류자격 확인', 'area' => '서울 용산', 'available' => '평일',
            'bio' => '독일어·영어·기초 한국어. 뷰티/패션 팝업 응대 경험 다수.', 'height' => 173, 'weight' => 58,
            'flags' => ['foreign' => true, 'verified' => true], 'tags' => [['lang', '#영어가능'], ['lang', '#독일어가능'], ['default', '#응대']],
        ], [
            ['티랩(T-LAB)', '신제품 체험 부스', '부스 운영', '2026.08.01~08.04', 'platform', '완료', 'public'],
            ['Nordwind Messe', 'Fashion Week Booth', 'Sales Staff', '2025.09.01~09.05', 'self', null, 'link'],
        ]);
        $choi = $worker([
            'phone' => '01093317788', 'name' => '최민준', 'gender' => '남', 'age' => 31, 'area' => '서울 강서', 'available' => '평일 오전',
            'bio' => '상하차·체력직 위주로 근무합니다.', 'height' => 178, 'weight' => 74, 'instagram' => '@minjun_31',
            'tags' => [['pos', '#상하차가능'], ['default', '#체력직']],
        ], [
            ['퍼스트 라운딩', '성수 팝업 물류', '상하차', '2026.09.02~09.03', 'platform', '완료', 'public'],
            ['뉴욕의 거장들', '미술 전시 팝업', '상하차', '2026.08.20', 'platform', '노쇼', 'public'],
            ['한빛물류', '물류센터 야간 근무', '상하차', '2026.05.02~05.30', 'self', null, 'private'],
        ]);
        $park = $worker([
            'phone' => '01062214409', 'name' => '박서준', 'gender' => '남', 'age' => 26, 'area' => '서울 송파', 'available' => '전체',
            'bio' => '카페 근무 3년, 음료 제조 가능합니다.', 'height' => 181, 'weight' => 70,
            'tags' => [['default', '#음료'], ['default', '#응대']],
        ], [
            ['무드랩', '봄 시즌 팝업', '서버', '2026.04.11~04.13', 'platform', '완료', 'public'],
        ]);

        // 사진 검수 대기 데모용 플레이스홀더
        Storage::disk('public')->put('photos/seed-choi.svg', '<svg xmlns="http://www.w3.org/2000/svg" width="240" height="240"><rect width="240" height="240" fill="#FDE7E7"/><circle cx="120" cy="95" r="45" fill="#E5484D" opacity=".55"/><rect x="45" y="155" width="150" height="85" rx="60" fill="#E5484D" opacity=".55"/></svg>');
        $choi->update(['photo_path' => 'photos/seed-choi.svg', 'photo_status' => 'pending']);

        $apply = function (Worker $w, Project $p, int $posIdx, string $status = 'applied') {
            return Application::create(['worker_id' => $w->id, 'position_id' => $p->positions[$posIdx]->id, 'status' => $status]);
        };
        $sign = fn (Application $a, Carbon $at) => $a->contract()->create(['sent_at' => $at, 'expires_at' => $at->copy()->addDay(), 'signed_at' => $at->copy()->addMinutes(3), 'signature' => $a->worker->name, 'signature_hash' => hash('sha256', "seed-{$a->id}")]);
        $log = function (Application $a, Carbon $day, string $in, ?string $out) {
            $checkIn = $day->copy()->setTimeFromTimeString($in);
            if ($checkIn->isFuture()) {
                return;
            }
            $a->logs()->create(['work_date' => $day, 'check_in_at' => $checkIn, 'check_out_at' => $out ? $day->copy()->setTimeFromTimeString($out) : null, 'method' => 'qr']);
        };

        // 진행 중 현장(무드랩)
        foreach ([[$kim, '09:52'], [$emma, '09:58']] as [$w, $in]) {
            $a = $apply($w, $mood, 0, 'approved');
            $sign($a, now()->subDays(3));
            $log($a, $d(-1), $in, '19:04');
            $log($a, $d(0), $in, null);
        }
        $apply($park, $mood, 1, 'approved')->contract()->create(['sent_at' => now()->subHours(4), 'expires_at' => now()->addHours(20)]);
        $apply($choi, $mood, 2, 'approved')->contract()->create(['sent_at' => now()->subHours(22), 'expires_at' => now()->addHours(2)]);
        $apply($sky, $mood, 0);

        // 예정 현장 지원
        $apply($sky, $nyc, 0);
        $apply($kim, $nyc, 0);

        // 종료 현장 — 3일 근무 후 정산서 발행
        foreach ([[$kim, '09:55'], [$emma, '10:14']] as [$w, $in]) {
            $a = $apply($w, $past, 0, 'approved');
            $sign($a, $d(-25));
            foreach ([-20, -19, -18] as $off) {
                $log($a, $d($off), $in, '19:00');
            }
        }
        Payroll::calculate($past);
        Payroll::issue($past);
    }
}
