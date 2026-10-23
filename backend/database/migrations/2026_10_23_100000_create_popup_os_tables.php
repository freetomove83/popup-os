<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

/**
 * Popup OS 핵심 흐름: 프로젝트(=공고) → 포지션 → 지원 → 계약 → 출퇴근(QR) → 정산.
 * 출퇴근은 QR 전용이라 GPS 컬럼이 없다.
 */
return new class extends Migration
{
    public function up(): void
    {
        // 프로젝트 = 워커에게 노출되는 공고. 대행 등록(operator) 시 동의·claim 상태를 함께 보관한다.
        Schema::create('projects', function (Blueprint $table) {
            $table->id();
            $table->string('brand');
            $table->string('organizer');
            $table->string('title');
            $table->string('venue')->default('미정');
            $table->string('area')->default('');
            $table->date('start_date');
            $table->date('end_date');
            $table->string('manager')->nullable();
            $table->text('description')->nullable();
            $table->json('tags')->nullable();
            $table->string('posted_by')->default('agency'); // operator|agency
            $table->string('claim_status')->default('claimed'); // unclaimed|invited|claimed
            $table->string('contact')->nullable();
            $table->boolean('consent_agreed')->default(false);
            $table->string('consent_method')->nullable(); // 구두|이메일|서면
            $table->date('consent_date')->nullable();
            $table->string('attendance_code', 6);
            $table->timestamps();
        });

        Schema::create('positions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('project_id')->constrained()->cascadeOnDelete();
            $table->string('name');
            $table->unsignedInteger('pay');
            $table->string('start_time', 5)->default('10:00');
            $table->string('end_time', 5)->default('19:00');
            $table->unsignedSmallInteger('break_minutes')->default(60);
            $table->unsignedSmallInteger('headcount');
            $table->json('tags')->nullable();
            $table->timestamps();
        });

        Schema::create('workers', function (Blueprint $table) {
            $table->id();
            $table->string('phone')->unique(); // 숫자만, 로그인 식별자
            $table->string('name')->nullable();
            $table->string('gender')->nullable();
            $table->unsignedTinyInteger('age')->nullable();
            $table->string('area')->nullable();
            $table->string('available')->nullable();
            $table->string('nationality')->nullable();
            $table->text('bio')->nullable();
            $table->unsignedSmallInteger('height')->nullable(); // 정확값 — API로는 구간 하한만 내보낸다
            $table->unsignedSmallInteger('weight')->nullable();
            $table->string('photo_path')->nullable();
            $table->string('photo_status')->default('none'); // none|pending|approved|rejected
            $table->string('instagram')->nullable();
            $table->json('flags')->nullable();
            $table->json('tags')->nullable();
            $table->timestamps();
        });

        // 커리어 타임라인 — platform(정산 확정 시 자동·인증) / self(자기기입·미인증)
        Schema::create('work_records', function (Blueprint $table) {
            $table->id();
            $table->foreignId('worker_id')->constrained()->cascadeOnDelete();
            $table->foreignId('project_id')->nullable()->constrained()->nullOnDelete();
            $table->string('organizer');
            $table->string('project');
            $table->string('role');
            $table->string('dates');
            $table->string('source'); // platform|self
            $table->boolean('verified')->default(false);
            $table->string('status')->nullable(); // 완료|노쇼|지각
            $table->boolean('evidence')->default(false);
            $table->string('visibility')->default('link'); // private|link|public
            $table->timestamps();
        });

        Schema::create('applications', function (Blueprint $table) {
            $table->id();
            $table->foreignId('worker_id')->constrained()->cascadeOnDelete();
            $table->foreignId('position_id')->constrained()->cascadeOnDelete();
            $table->string('status')->default('applied'); // applied|held|approved|rejected
            $table->timestamps();
            $table->unique(['worker_id', 'position_id']);
        });

        Schema::create('contracts', function (Blueprint $table) {
            $table->id();
            $table->foreignId('application_id')->unique()->constrained()->cascadeOnDelete();
            $table->timestamp('sent_at');
            $table->timestamp('expires_at');
            $table->timestamp('signed_at')->nullable();
            $table->string('signature')->nullable();
            $table->string('signature_hash', 64)->nullable();
            $table->timestamps();
        });

        Schema::create('attendance_logs', function (Blueprint $table) {
            $table->id();
            $table->foreignId('application_id')->constrained()->cascadeOnDelete();
            $table->date('work_date');
            $table->timestamp('check_in_at')->nullable();
            $table->timestamp('check_out_at')->nullable();
            $table->string('method')->default('qr'); // qr|qrphoto|manager
            $table->string('photo_path')->nullable();
            $table->timestamps();
            $table->unique(['application_id', 'work_date']);
        });

        Schema::create('settlements', function (Blueprint $table) {
            $table->id();
            $table->foreignId('application_id')->unique()->constrained()->cascadeOnDelete();
            $table->unsignedSmallInteger('days');
            $table->unsignedInteger('minutes');
            $table->unsignedInteger('base');
            $table->unsignedInteger('extra')->default(0);
            $table->unsignedInteger('tax');
            $table->unsignedInteger('net');
            $table->string('status')->default('draft'); // draft|scheduled|paid
            $table->timestamp('issued_at')->nullable();
            $table->text('dispute_note')->nullable();
            $table->timestamp('disputed_at')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        foreach (['settlements', 'attendance_logs', 'contracts', 'applications', 'work_records', 'workers', 'positions', 'projects'] as $t) {
            Schema::dropIfExists($t);
        }
    }
};
