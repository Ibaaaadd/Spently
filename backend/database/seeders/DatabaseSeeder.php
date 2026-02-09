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
        
        $ibadUser = User::where('email', 'ibad@gmail.com')->first();
        $testUser = User::where('email', 'test@example.com')->first();
        
        $demoCategories = [
            ['user_id' => $ibadUser->id, 'name' => 'Makan', 'color' => '#EF4444'],
            ['user_id' => $ibadUser->id, 'name' => 'Jajan', 'color' => '#F59E0B'],
            ['user_id' => $ibadUser->id, 'name' => 'Transport', 'color' => '#6366F1'],
            ['user_id' => $ibadUser->id, 'name' => 'Lain-lain', 'color' => '#8B5CF6'],
            ['user_id' => $ibadUser->id, 'name' => 'Ngasih Bude', 'color' => '#EC4899'],
            ['user_id' => $ibadUser->id, 'name' => 'Zakat Bulanan', 'color' => '#22C55E'],
            ['user_id' => $ibadUser->id, 'name' => 'Pulsa / Internet', 'color' => '#14B8A6'],
        ];

        foreach ($demoCategories as $category) {
            $cat = Category::create($category);
            
            if ($category['name'] == 'Makan') $demoMakan = $cat->id;
            if ($category['name'] == 'Jajan') $demoJajan = $cat->id;
            if ($category['name'] == 'Transport') $demoTransport = $cat->id;
            if ($category['name'] == 'Lain-lain') $demoLainLain = $cat->id;
            if ($category['name'] == 'Ngasih Bude') $demoNgasihBude = $cat->id;
            if ($category['name'] == 'Zakat Bulanan') $demoZakat = $cat->id;
            if ($category['name'] == 'Pulsa / Internet') $demoPulsa = $cat->id;
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
            ['user_id' => $ibadUser->id, 'date' => '2026-01-01', 'category_id' => $demoMakan, 'description' => 'Beli Pecel', 'amount' => 10000],
            ['user_id' => $ibadUser->id, 'date' => '2026-01-01', 'category_id' => $demoJajan, 'description' => 'Es teh', 'amount' => 3000],
            ['user_id' => $ibadUser->id, 'date' => '2026-01-01', 'category_id' => $demoMakan, 'description' => 'Nasi bebek dan Es teh', 'amount' => 25000],
            ['user_id' => $ibadUser->id, 'date' => '2026-01-02', 'category_id' => $demoNgasihBude, 'description' => 'Jatah bulanan de Mujah', 'amount' => 500000],
            ['user_id' => $ibadUser->id, 'date' => '2026-01-02', 'category_id' => $demoJajan, 'description' => 'Es teh', 'amount' => 4000],
            ['user_id' => $ibadUser->id, 'date' => '2026-01-04', 'category_id' => $demoZakat, 'description' => 'Uang zakat ke Ust Agus', 'amount' => 150000],
            ['user_id' => $ibadUser->id, 'date' => '2026-01-04', 'category_id' => $demoTransport, 'description' => 'Bensin', 'amount' => 50000],
            ['user_id' => $ibadUser->id, 'date' => '2026-01-05', 'category_id' => $demoLainLain, 'description' => 'Bayar hawul', 'amount' => 21000],
            ['user_id' => $ibadUser->id, 'date' => '2026-01-06', 'category_id' => $demoJajan, 'description' => 'Kopken', 'amount' => 30000],
            ['user_id' => $ibadUser->id, 'date' => '2026-01-07', 'category_id' => $demoMakan, 'description' => 'Mie pan', 'amount' => 13000],
            ['user_id' => $ibadUser->id, 'date' => '2026-01-07', 'category_id' => $demoJajan, 'description' => 'Es the', 'amount' => 4000],
            ['user_id' => $ibadUser->id, 'date' => '2026-01-10', 'category_id' => $demoTransport, 'description' => 'Bensin', 'amount' => 50000],
            ['user_id' => $ibadUser->id, 'date' => '2026-01-10', 'category_id' => $demoJajan, 'description' => 'Tiket masuk wisata', 'amount' => 48000],
            ['user_id' => $ibadUser->id, 'date' => '2026-01-10', 'category_id' => $demoJajan, 'description' => 'Seluang Belangi', 'amount' => 50000],
            ['user_id' => $ibadUser->id, 'date' => '2026-01-10', 'category_id' => $demoMakan, 'description' => 'Bakso', 'amount' => 18000],
            ['user_id' => $ibadUser->id, 'date' => '2026-01-10', 'category_id' => $demoJajan, 'description' => 'Jambu cristal', 'amount' => 10000],
            ['user_id' => $ibadUser->id, 'date' => '2026-01-11', 'category_id' => $demoLainLain, 'description' => 'Bowo sawu', 'amount' => 100000],
            ['user_id' => $ibadUser->id, 'date' => '2026-01-11', 'category_id' => $demoLainLain, 'description' => 'Potong rambut', 'amount' => 35000],
            ['user_id' => $ibadUser->id, 'date' => '2026-01-13', 'category_id' => $demoTransport, 'description' => 'Bensin', 'amount' => 50000],
            ['user_id' => $ibadUser->id, 'date' => '2026-01-14', 'category_id' => $demoMakan, 'description' => 'Bakso', 'amount' => 10000],
            ['user_id' => $ibadUser->id, 'date' => '2026-01-14', 'category_id' => $demoLainLain, 'description' => 'Futsal', 'amount' => 20000],
            ['user_id' => $ibadUser->id, 'date' => '2026-01-14', 'category_id' => $demoLainLain, 'description' => 'Parkir dan perahu', 'amount' => 5000],
            ['user_id' => $ibadUser->id, 'date' => '2026-01-18', 'category_id' => $demoLainLain, 'description' => 'Mini soccer', 'amount' => 50000],
            ['user_id' => $ibadUser->id, 'date' => '2026-01-18', 'category_id' => $demoMakan, 'description' => 'Makan nasi', 'amount' => 28000],
            ['user_id' => $ibadUser->id, 'date' => '2026-01-18', 'category_id' => $demoJajan, 'description' => 'D coffee cup', 'amount' => 38500],
            ['user_id' => $ibadUser->id, 'date' => '2026-01-18', 'category_id' => $demoLainLain, 'description' => 'Parkir', 'amount' => 7000],
            ['user_id' => $ibadUser->id, 'date' => '2026-01-18', 'category_id' => $demoMakan, 'description' => 'Hotways', 'amount' => 52000],
            ['user_id' => $ibadUser->id, 'date' => '2026-01-18', 'category_id' => $demoMakan, 'description' => 'Pecel', 'amount' => 9000],
            ['user_id' => $ibadUser->id, 'date' => '2026-01-18', 'category_id' => $demoJajan, 'description' => 'Es teh', 'amount' => 4000],
            ['user_id' => $ibadUser->id, 'date' => '2026-01-19', 'category_id' => $demoMakan, 'description' => 'Krawu', 'amount' => 12000],
            ['user_id' => $ibadUser->id, 'date' => '2026-01-19', 'category_id' => $demoTransport, 'description' => 'Bensin', 'amount' => 50000],
            ['user_id' => $ibadUser->id, 'date' => '2026-01-19', 'category_id' => $demoMakan, 'description' => 'Penyetan', 'amount' => 10000],
            ['user_id' => $ibadUser->id, 'date' => '2026-01-20', 'category_id' => $demoLainLain, 'description' => 'Cuci motor', 'amount' => 15000],
            ['user_id' => $ibadUser->id, 'date' => '2026-01-21', 'category_id' => $demoJajan, 'description' => 'Coin efootball', 'amount' => 18000],
            ['user_id' => $ibadUser->id, 'date' => '2026-01-21', 'category_id' => $demoMakan, 'description' => 'Bakso', 'amount' => 10000],
            ['user_id' => $ibadUser->id, 'date' => '2026-01-21', 'category_id' => $demoJajan, 'description' => 'Es teh', 'amount' => 4000],
            ['user_id' => $ibadUser->id, 'date' => '2026-01-22', 'category_id' => $demoMakan, 'description' => 'Mie', 'amount' => 4000],
            ['user_id' => $ibadUser->id, 'date' => '2026-01-23', 'category_id' => $demoJajan, 'description' => 'Dimsum mentai', 'amount' => 50000],
            ['user_id' => $ibadUser->id, 'date' => '2026-01-23', 'category_id' => $demoPulsa, 'description' => '23 Gb', 'amount' => 60000],
            ['user_id' => $ibadUser->id, 'date' => '2026-01-25', 'category_id' => $demoTransport, 'description' => 'Bensin', 'amount' => 50000],
            ['user_id' => $ibadUser->id, 'date' => '2026-01-26', 'category_id' => $demoMakan, 'description' => 'Soto', 'amount' => 35000],
            ['user_id' => $ibadUser->id, 'date' => '2026-01-27', 'category_id' => $demoMakan, 'description' => 'Mie', 'amount' => 8000],
            ['user_id' => $ibadUser->id, 'date' => '2026-01-29', 'category_id' => $demoLainLain, 'description' => 'Parkir', 'amount' => 7000],
            ['user_id' => $ibadUser->id, 'date' => '2026-01-31', 'category_id' => $demoMakan, 'description' => 'Nasi bungkus', 'amount' => 7000],
            ['user_id' => $ibadUser->id, 'date' => '2026-01-31', 'category_id' => $demoMakan, 'description' => 'Nasi bebek dan Es teh', 'amount' => 59000],
            ['user_id' => $ibadUser->id, 'date' => '2026-01-31', 'category_id' => $demoJajan, 'description' => 'Quesilo', 'amount' => 15000],
            
            ['user_id' => $ibadUser->id, 'date' => '2026-02-01', 'category_id' => $demoLainLain, 'description' => 'Ngasih Pak Munir', 'amount' => 100000],
            ['user_id' => $ibadUser->id, 'date' => '2026-02-01', 'category_id' => $demoLainLain, 'description' => 'Ngasih By Nyai', 'amount' => 100000],
            ['user_id' => $ibadUser->id, 'date' => '2026-02-01', 'category_id' => $demoLainLain, 'description' => 'Ngasih Pak Wahab', 'amount' => 200000],
            ['user_id' => $ibadUser->id, 'date' => '2026-02-01', 'category_id' => $demoMakan, 'description' => 'Penyetan Lele dan Es Teh', 'amount' => 19000],
            ['user_id' => $ibadUser->id, 'date' => '2026-02-01', 'category_id' => $demoMakan, 'description' => 'Pecel dan Es teh', 'amount' => 15000],
            ['user_id' => $ibadUser->id, 'date' => '2026-02-04', 'category_id' => $demoJajan, 'description' => 'Es teh', 'amount' => 4000],
            ['user_id' => $ibadUser->id, 'date' => '2026-02-04', 'category_id' => $demoJajan, 'description' => 'Air Putih', 'amount' => 4000],
            ['user_id' => $ibadUser->id, 'date' => '2026-02-04', 'category_id' => $demoMakan, 'description' => 'Bakso', 'amount' => 11000],
            ['user_id' => $ibadUser->id, 'date' => '2026-02-04', 'category_id' => $demoJajan, 'description' => 'Beli Nutriboost', 'amount' => 7700],
            ['user_id' => $ibadUser->id, 'date' => '2026-02-04', 'category_id' => $demoTransport, 'description' => 'Bensin', 'amount' => 50000],
            ['user_id' => $ibadUser->id, 'date' => '2026-02-04', 'category_id' => $demoJajan, 'description' => 'Vouche Alfamart 100K', 'amount' => 105000],
            ['user_id' => $ibadUser->id, 'date' => '2026-02-07', 'category_id' => $demoJajan, 'description' => 'Es teh', 'amount' => 3000],
            ['user_id' => $ibadUser->id, 'date' => '2026-02-08', 'category_id' => $demoLainLain, 'description' => 'Zakat Pak Agus', 'amount' => 150000],
            ['user_id' => $ibadUser->id, 'date' => '2026-02-08', 'category_id' => $demoLainLain, 'description' => 'Potong rambut', 'amount' => 35000],
            ['user_id' => $ibadUser->id, 'date' => '2026-02-09', 'category_id' => $demoNgasihBude, 'description' => 'Bulanan de Mujah', 'amount' => 500000],
        ];

        foreach ($demoExpenses as $expense) {
            Expense::create($expense);
        }
    }
}
