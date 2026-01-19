<?php

namespace Database\Seeders;

use App\Models\User;
use App\Models\Category;
use App\Models\Expense;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DatabaseSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // Create categories
        $categories = [
            ['name' => 'Makanan', 'color' => '#EF4444'],
            ['name' => 'Transport', 'color' => '#6366F1'],
            ['name' => 'Belanja', 'color' => '#22C55E'],
            ['name' => 'Hiburan', 'color' => '#F59E0B'],
            ['name' => 'Kesehatan', 'color' => '#EC4899'],
            ['name' => 'Pendidikan', 'color' => '#8B5CF6'],
        ];

        foreach ($categories as $category) {
            Category::create($category);
        }

        // Create sample expenses
        $expenses = [
            ['date' => '2026-01-15', 'category_id' => 1, 'description' => 'Makan siang di restoran', 'amount' => 50000],
            ['date' => '2026-01-15', 'category_id' => 2, 'description' => 'Bensin motor', 'amount' => 30000],
            ['date' => '2026-01-16', 'category_id' => 1, 'description' => 'Beli groceries', 'amount' => 150000],
            ['date' => '2026-01-16', 'category_id' => 3, 'description' => 'Beli baju', 'amount' => 200000],
            ['date' => '2026-01-17', 'category_id' => 1, 'description' => 'Makan malam', 'amount' => 75000],
            ['date' => '2026-01-17', 'category_id' => 4, 'description' => 'Nonton bioskop', 'amount' => 50000],
            ['date' => '2026-01-18', 'category_id' => 2, 'description' => 'Ojek online', 'amount' => 25000],
            ['date' => '2026-01-18', 'category_id' => 1, 'description' => 'Kopi dan snack', 'amount' => 35000],
            ['date' => '2026-01-19', 'category_id' => 1, 'description' => 'Obat dan vitamin', 'amount' => 80000],
            ['date' => '2026-01-19', 'category_id' => 6, 'description' => 'Buku pelajaran', 'amount' => 120000],
            ['date' => '2026-01-20', 'category_id' => 1, 'description' => 'Obat dan vitamin', 'amount' => 80000],
            ['date' => '2026-01-20', 'category_id' => 6, 'description' => 'Buku pelajaran', 'amount' => 120000],
            ['date' => '2026-01-14', 'category_id' => 1, 'description' => 'Obat dan vitamin', 'amount' => 80000],
            ['date' => '2026-01-14', 'category_id' => 6, 'description' => 'Buku pelajaran', 'amount' => 120000],
            ['date' => '2026-01-14', 'category_id' => 1, 'description' => 'Obat dan vitamin', 'amount' => 80000],
            ['date' => '2026-01-13', 'category_id' => 6, 'description' => 'Buku pelajaran', 'amount' => 120000],
        ];

        foreach ($expenses as $expense) {
            Expense::create($expense);
        }
    }
}
