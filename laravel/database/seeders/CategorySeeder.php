<?php

namespace Database\Seeders;

use App\Models\Category;
use Faker\Factory;
use Illuminate\Database\Seeder;

class CategorySeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $faker = Factory::create();

        
        for ($i = 0; $i < 10; $i++) {
            Category::create([
                'name' => $faker->word(), 
            ]);
        }
    }
}
