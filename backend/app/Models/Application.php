<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\HasOne;

class Application extends Model
{
    protected $guarded = [];

    public function worker(): BelongsTo
    {
        return $this->belongsTo(Worker::class);
    }

    public function position(): BelongsTo
    {
        return $this->belongsTo(Position::class);
    }

    public function contract(): HasOne
    {
        return $this->hasOne(Contract::class);
    }

    public function logs(): HasMany
    {
        return $this->hasMany(AttendanceLog::class)->orderBy('work_date');
    }

    public function settlement(): HasOne
    {
        return $this->hasOne(Settlement::class);
    }
}
