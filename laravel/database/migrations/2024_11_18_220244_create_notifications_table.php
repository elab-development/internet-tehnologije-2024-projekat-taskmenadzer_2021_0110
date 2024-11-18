<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateNotificationsTable extends Migration
{
    /**
     * Run the migrations.
     *
     * @return void
     */
    public function up()
    {
        Schema::create('notifications', function (Blueprint $table) {
            $table->id();
            $table->string('type'); // Tip notifikacije (npr. "task_assigned", "deadline_approaching")
            $table->text('message'); // Poruka notifikacije
            $table->unsignedBigInteger('user_id'); // Korisnik kojem je namenjena notifikacija
            $table->unsignedBigInteger('task_id')->nullable(); // Zadaci na koje se odnosi
            $table->boolean('is_read')->default(false); // Da li je korisnik pročitao notifikaciju
            $table->timestamps();
    
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('task_id')->references('id')->on('tasks')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     *
     * @return void
     */
    public function down()
    {
        Schema::dropIfExists('notifications');
    }
}
