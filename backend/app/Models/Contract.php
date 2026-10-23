<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Contract extends Model
{
    protected $guarded = [];

    protected function casts(): array
    {
        return ['sent_at' => 'datetime', 'expires_at' => 'datetime', 'signed_at' => 'datetime'];
    }

    public function application(): BelongsTo
    {
        return $this->belongsTo(Application::class);
    }

    /** signed|pending|expiring|expired */
    public function state(): string
    {
        if ($this->signed_at) {
            return 'signed';
        }
        if ($this->expires_at->isPast()) {
            return 'expired';
        }

        return $this->expires_at->lt(now()->addHours(3)) ? 'expiring' : 'pending';
    }
}
