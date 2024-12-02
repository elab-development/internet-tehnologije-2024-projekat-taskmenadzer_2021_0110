<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Task;
use App\Models\User;
use Faker\Factory;
use Illuminate\Database\Seeder;

class TaskSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $faker = Factory::create();

        $categories = Category::all();
        $users = User::all();

        // Kreiranje 50 zadataka
        for ($i = 0; $i < 50; $i++) {
            Task::create([
                'title' => $faker->sentence(3), 
                'description' => $faker->paragraph(),
                'status' => $faker->randomElement(['pending', 'in_progress', 'completed']), 
                'deadline' => $faker->dateTimeBetween('+1 week', '+1 month'), 
                'category_id' => $faker->randomElement($categories->pluck('id')->toArray()),
                'assigned_to' => $faker->randomElement($users->pluck('id')->toArray()),
            ]);
        }
    }
}
