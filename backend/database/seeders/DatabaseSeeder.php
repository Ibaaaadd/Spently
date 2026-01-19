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
        $this->call(UserSeeder::class);
        
        $demoUser = User::where('email', 'demo@spently.com')->first();
        $testUser = User::where('email', 'test@example.com')->first();
        
        $demoCategories = [
            ['user_id' => $demoUser->id, 'name' => 'Makanan', 'color' => '#EF4444'],
            ['user_id' => $demoUser->id, 'name' => 'Transport', 'color' => '#6366F1'],
            ['user_id' => $demoUser->id, 'name' => 'Belanja', 'color' => '#22C55E'],
            ['user_id' => $demoUser->id, 'name' => 'Hiburan', 'color' => '#F59E0B'],
            ['user_id' => $demoUser->id, 'name' => 'Kesehatan', 'color' => '#EC4899'],
            ['user_id' => $demoUser->id, 'name' => 'Pendidikan', 'color' => '#8B5CF6'],
        ];

        foreach ($demoCategories as $category) {
            $cat = Category::create($category);
            
            if ($category['name'] == 'Makanan') $demoMakanan = $cat->id;
            if ($category['name'] == 'Transport') $demoTransport = $cat->id;
            if ($category['name'] == 'Belanja') $demoBelanja = $cat->id;
            if ($category['name'] == 'Hiburan') $demoHiburan = $cat->id;
            if ($category['name'] == 'Kesehatan') $demoKesehatan = $cat->id;
            if ($category['name'] == 'Pendidikan') $demoPendidikan = $cat->id;
        }
        
        $testCategories = [
            ['user_id' => $testUser->id, 'name' => 'Makanan', 'color' => '#EF4444'],
            ['user_id' => $testUser->id, 'name' => 'Transport', 'color' => '#3B82F6'],
            ['user_id' => $testUser->id, 'name' => 'Belanja', 'color' => '#10B981'],
        ];

        foreach ($testCategories as $category) {
            Category::create($category);
        }

        $demoExpenses = [
            ['user_id' => $demoUser->id, 'date' => '2026-01-15', 'category_id' => $demoMakanan, 'description' => 'Makan siang di restoran', 'amount' => 50000],
            ['user_id' => $demoUser->id, 'date' => '2026-01-15', 'category_id' => $demoTransport, 'description' => 'Bensin motor', 'amount' => 30000],
            ['user_id' => $demoUser->id, 'date' => '2026-01-16', 'category_id' => $demoMakanan, 'description' => 'Beli groceries', 'amount' => 150000],
            ['user_id' => $demoUser->id, 'date' => '2026-01-16', 'category_id' => $demoBelanja, 'description' => 'Beli baju', 'amount' => 200000],
            ['user_id' => $demoUser->id, 'date' => '2026-01-17', 'category_id' => $demoMakanan, 'description' => 'Makan malam', 'amount' => 75000],
            ['user_id' => $demoUser->id, 'date' => '2026-01-17', 'category_id' => $demoHiburan, 'description' => 'Nonton bioskop', 'amount' => 50000],
            ['user_id' => $demoUser->id, 'date' => '2026-01-18', 'category_id' => $demoTransport, 'description' => 'Ojek online', 'amount' => 25000],
            ['user_id' => $demoUser->id, 'date' => '2026-01-18', 'category_id' => $demoMakanan, 'description' => 'Kopi dan snack', 'amount' => 35000],
            ['user_id' => $demoUser->id, 'date' => '2026-01-19', 'category_id' => $demoKesehatan, 'description' => 'Obat dan vitamin', 'amount' => 80000],
            ['user_id' => $demoUser->id, 'date' => '2026-01-19', 'category_id' => $demoPendidikan, 'description' => 'Buku pelajaran', 'amount' => 120000],
        ];

        foreach ($demoExpenses as $expense) {
            Expense::create($expense);
        }
    }
}
