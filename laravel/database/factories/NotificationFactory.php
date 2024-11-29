<?php

namespace Database\Factories;

use App\Models\Notification;
use App\Models\User;
use App\Models\Task;
use Illuminate\Database\Eloquent\Factories\Factory;

class NotificationFactory extends Factory
{
    /**
     * The name of the factory's corresponding model.
     *
     * @var string
     */
    protected $model = Notification::class;

    /**
     * Define the model's default state.
     *
     * @return array
     */
    public function definition()
    {
        return [
            'type' => $this->faker->randomElement(['task_assigned', 'deadline_approaching', 'general']),
            'message' => $this->faker->sentence,
            'user_id' => User::inRandomOrder()->first()->id ?? User::factory(),
            'task_id' => Task::inRandomOrder()->first()->id ?? null, // Neki zapisi mogu biti null
            'is_read' => $this->faker->boolean,
        ];
    }
}
