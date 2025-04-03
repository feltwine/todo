<?php

namespace App\Models;

use Carbon\Carbon;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

/**
 * @property integer $id
 * @property string $title
 * @property string $description
 * @property boolean $completed
 *
 * @property string|Carbon $created_at
 * @property string|Carbon $updated_at
 * @property string|Carbon|null $deleted_at
 *
 * @mixin Builder
 */
class Todo extends Model
{
    use HasFactory;
    protected $fillable = [
        'title',
        'description',
        'completed',
    ];

    protected $casts = [
      'created_at' => 'datetime',
      'updated_at' => 'datetime',
    ];
}
