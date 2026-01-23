<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Expense;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;
use PhpOffice\PhpSpreadsheet\Spreadsheet;
use PhpOffice\PhpSpreadsheet\Writer\Xlsx;
use PhpOffice\PhpSpreadsheet\Style\Font;
use PhpOffice\PhpSpreadsheet\Style\Alignment;
use PhpOffice\PhpSpreadsheet\Style\Fill;
use PhpOffice\PhpSpreadsheet\Style\Border;

class ExpenseController extends Controller
{
    public function index(Request $request)
    {
        $query = Expense::where('user_id', $request->user()->id)
            ->with('category')
            ->orderBy('date', 'desc');

        if ($request->has('start_date') && $request->start_date) {
            $query->whereDate('date', '>=', $request->start_date);
        }
        
        if ($request->has('end_date') && $request->end_date) {
            $query->whereDate('date', '<=', $request->end_date);
        }

        if (!$request->has('start_date') && !$request->has('end_date') && $request->has('month') && $request->has('year')) {
            $query->whereMonth('date', $request->month)
                  ->whereYear('date', $request->year);
        }

        if ($request->has('category_id') && $request->category_id) {
            $query->where('category_id', $request->category_id);
        }

        $totalSum = (clone $query)->sum('amount');

        $perPage = $request->get('per_page', 10); 
        $page = $request->get('page', 1);

        $expenses = $query->paginate($perPage);

        return response()->json([
            'success' => true,
            'data' => $expenses->items(),
            'meta' => [
                'current_page' => $expenses->currentPage(),
                'last_page' => $expenses->lastPage(),
                'per_page' => $expenses->perPage(),
                'total' => $expenses->total(),
                'from' => $expenses->firstItem(),
                'to' => $expenses->lastItem(),
                'total_sum' => (float) $totalSum,
            ]
        ]);
    }

    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'date' => 'required|date',
            'category_id' => 'required|exists:categories,id',
            'description' => 'required|string|max:255',
            'amount' => 'required|numeric|min:0',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        $expense = Expense::create([
            'user_id' => $request->user()->id,
            'date' => $request->date,
            'category_id' => $request->category_id,
            'description' => $request->description,
            'amount' => $request->amount,
        ]);
        $expense->load('category');

        return response()->json([
            'success' => true,
            'message' => 'Pengeluaran berhasil ditambahkan',
            'data' => $expense
        ], 201);
    }

    public function show(Request $request, $id)
    {
        $expense = Expense::where('user_id', $request->user()->id)
            ->with('category')
            ->find($id);

        if (!$expense) {
            return response()->json([
                'success' => false,
                'message' => 'Pengeluaran tidak ditemukan'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $expense
        ]);
    }

    public function update(Request $request, $id)
    {
        $expense = Expense::where('user_id', $request->user()->id)->find($id);

        if (!$expense) {
            return response()->json([
                'success' => false,
                'message' => 'Pengeluaran tidak ditemukan'
            ], 404);
        }

        $validator = Validator::make($request->all(), [
            'date' => 'required|date',
            'category_id' => 'required|exists:categories,id',
            'description' => 'required|string|max:255',
            'amount' => 'required|numeric|min:0',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        $expense->update($request->only(['date', 'category_id', 'description', 'amount']));
        $expense->load('category');

        return response()->json([
            'success' => true,
            'message' => 'Pengeluaran berhasil diupdate',
            'data' => $expense
        ]);
    }

    public function destroy(Request $request, $id)
    {
        $expense = Expense::where('user_id', $request->user()->id)->find($id);

        if (!$expense) {
            return response()->json([
                'success' => false,
                'message' => 'Pengeluaran tidak ditemukan'
            ], 404);
        }

        $expense->delete();

        return response()->json([
            'success' => true,
            'message' => 'Pengeluaran berhasil dihapus'
        ]);
    }

    public function summary(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'month' => 'required|integer|between:1,12',
            'year' => 'required|integer|min:2000',
        ]);

        if ($validator->fails()) {
            return response()->json([
                'success' => false,
                'errors' => $validator->errors()
            ], 422);
        }

        $month = $request->month;
        $year = $request->year;
        $userId = $request->user()->id;

        $totalBulanan = Expense::where('user_id', $userId)
            ->whereMonth('date', $month)
            ->whereYear('date', $year)
            ->sum('amount');

        $breakdown = DB::table('expenses')
            ->join('categories', 'expenses.category_id', '=', 'categories.id')
            ->select(
                'categories.id',
                'categories.name',
                'categories.color',
                DB::raw('SUM(expenses.amount) as total'),
                DB::raw('COUNT(expenses.id) as count')
            )
            ->where('expenses.user_id', $userId)
            ->whereMonth('expenses.date', $month)
            ->whereYear('expenses.date', $year)
            ->groupBy('categories.id', 'categories.name', 'categories.color')
            ->orderBy('total', 'desc')
            ->get();

        $breakdown = $breakdown->map(function ($item) use ($totalBulanan) {
            $item->percentage = $totalBulanan > 0 
                ? round(($item->total / $totalBulanan) * 100, 2) 
                : 0;
            return $item;
        });

        $topCategories = $breakdown->take(3);
        $mostExpensive = $breakdown->first();

        return response()->json([
            'success' => true,
            'data' => [
                'month' => $month,
                'year' => $year,
                'total_bulanan' => (float) $totalBulanan,
                'breakdown_per_kategori' => $breakdown,
                'top_3_kategori' => $topCategories,
                'kategori_paling_boros' => $mostExpensive
            ]
        ]);
    }

    public function export(Request $request)
    {
        $monthNames = [
            1 => 'Januari', 2 => 'Februari', 3 => 'Maret', 4 => 'April',
            5 => 'Mei', 6 => 'Juni', 7 => 'Juli', 8 => 'Agustus',
            9 => 'September', 10 => 'Oktober', 11 => 'November', 12 => 'Desember'
        ];

        $startDate = null;
        $endDate = null;
        $sheets = [];
        $isDateRange = false;

        if ($request->has('start_date') && $request->has('end_date') && $request->start_date && $request->end_date) {
            $isDateRange = true;
            $startDate = new \DateTime($request->start_date);
            $endDate = new \DateTime($request->end_date);
            
            if ($startDate > $endDate) {
                $temp = $startDate;
                $startDate = $endDate;
                $endDate = $temp;
            }
            
            $current = clone $startDate;
            $current->modify('first day of this month');
            $end = clone $endDate;
            $end->modify('first day of this month');
            
            while ($current <= $end) {
                $sheets[] = [
                    'month' => (int)$current->format('n'),
                    'year' => (int)$current->format('Y'),
                    'name' => $monthNames[(int)$current->format('n')] . ' ' . $current->format('Y')
                ];
                $current->modify('+1 month');
            }
        } elseif ($request->has('month') && $request->has('year') && !$request->has('start_date') && !$request->has('end_date')) {
            $sheets[] = [
                'month' => $request->month,
                'year' => $request->year,
                'name' => $monthNames[$request->month] . ' ' . $request->year
            ];
        } else {
            $sheets[] = [
                'month' => date('n'),
                'year' => date('Y'),
                'name' => $monthNames[date('n')] . ' ' . date('Y')
            ];
        }

        $categoryFilter = null;
        $categoryName = null;
        if ($request->has('category_id') && $request->category_id) {
            $categoryFilter = $request->category_id;
            $category = \App\Models\Category::find($categoryFilter);
            if ($category) {
                $categoryName = $category->name;
            }
        }

        $spreadsheet = new Spreadsheet();
        $spreadsheet->removeSheetByIndex(0);
        
        $sheetIndex = 0;
        
        foreach ($sheets as $sheetData) {
            $query = Expense::where('user_id', $request->user()->id)
                ->with('category')
                ->orderBy('date', 'desc');
            
            $query->whereMonth('date', $sheetData['month'])
                  ->whereYear('date', $sheetData['year']);
            
            if ($isDateRange) {
                $monthStart = new \DateTime($sheetData['year'] . '-' . $sheetData['month'] . '-01');
                $monthEnd = clone $monthStart;
                $monthEnd->modify('last day of this month');
                
                $filterStart = max($startDate, $monthStart);
                $filterEnd = min($endDate, $monthEnd);
                
                $query->whereDate('date', '>=', $filterStart->format('Y-m-d'))
                      ->whereDate('date', '<=', $filterEnd->format('Y-m-d'));
            }
            
            if ($categoryFilter) {
                $query->where('category_id', $categoryFilter);
            }
            
            $expenses = $query->get();
            
            $sheet = new \PhpOffice\PhpSpreadsheet\Worksheet\Worksheet($spreadsheet, $sheetData['name']);
            $spreadsheet->addSheet($sheet, $sheetIndex);
            $sheetIndex++;
            
            $row = 1;
            
            $sheet->setCellValue('A' . $row, 'LAPORAN PENGELUARAN SPENTLY');
            $sheet->mergeCells('A' . $row . ':D' . $row);
            $sheet->getStyle('A' . $row)->getFont()->setBold(true)->setSize(16);
            $sheet->getStyle('A' . $row)->getAlignment()->setHorizontal(Alignment::HORIZONTAL_CENTER);
            $row++;
            
            $sheet->setCellValue('A' . $row, $sheetData['name']);
            $sheet->mergeCells('A' . $row . ':D' . $row);
            $sheet->getStyle('A' . $row)->getFont()->setBold(true)->setSize(12);
            $sheet->getStyle('A' . $row)->getAlignment()->setHorizontal(Alignment::HORIZONTAL_CENTER);
            $row++;
            
            if ($categoryName) {
                $sheet->setCellValue('A' . $row, 'Kategori: ' . $categoryName);
                $sheet->mergeCells('A' . $row . ':D' . $row);
                $sheet->getStyle('A' . $row)->getFont()->setItalic(true);
                $sheet->getStyle('A' . $row)->getAlignment()->setHorizontal(Alignment::HORIZONTAL_CENTER);
                $row++;
            }
            
            $sheet->setCellValue('A' . $row, 'Dicetak pada: ' . date('d/m/Y H:i'));
            $sheet->mergeCells('A' . $row . ':D' . $row);
            $sheet->getStyle('A' . $row)->getAlignment()->setHorizontal(Alignment::HORIZONTAL_CENTER);
            $row++;
            
            $row++; 
            
            if (count($expenses) > 0) {
                $headerRow = $row;
                $sheet->setCellValue('A' . $row, 'Tanggal');
                $sheet->setCellValue('B' . $row, 'Kategori');
                $sheet->setCellValue('C' . $row, 'Deskripsi');
                $sheet->setCellValue('D' . $row, 'Jumlah (Rp)');
                
                $sheet->getStyle('A' . $row . ':D' . $row)->getFont()->setBold(true)->setSize(11);
                $sheet->getStyle('A' . $row . ':D' . $row)->getFill()
                    ->setFillType(Fill::FILL_SOLID)
                    ->getStartColor()->setRGB('4CAF50');
                $sheet->getStyle('A' . $row . ':D' . $row)->getFont()->getColor()->setRGB('FFFFFF');
                $sheet->getStyle('A' . $row . ':D' . $row)->getAlignment()->setHorizontal(Alignment::HORIZONTAL_CENTER);
                $row++;
                
                // Data rows
                foreach ($expenses as $expense) {
                    $sheet->setCellValue('A' . $row, date('d/m/y', strtotime($expense->date)));
                    $sheet->setCellValue('B' . $row, $expense->category->name);
                    $sheet->setCellValue('C' . $row, $expense->description);
                    $sheet->setCellValue('D' . $row, 'Rp ' . number_format($expense->amount, 0, ',', '.'));
                    $row++;
                }
                
                $row++; // Empty row
                
                // Summary - Bold
                $total = $expenses->sum('amount');
                $sheet->setCellValue('C' . $row, 'TOTAL PENGELUARAN:');
                $sheet->setCellValue('D' . $row, 'Rp ' . number_format($total, 0, ',', '.'));
                $sheet->getStyle('C' . $row . ':D' . $row)->getFont()->setBold(true)->setSize(12);
                $row++;
                
                $sheet->setCellValue('C' . $row, 'JUMLAH TRANSAKSI:');
                $sheet->setCellValue('D' . $row, count($expenses) . ' transaksi');
                $sheet->getStyle('C' . $row . ':D' . $row)->getFont()->setBold(true);
                
                // Add borders to data table
                $lastDataRow = $row - 2;
                $sheet->getStyle('A' . $headerRow . ':D' . $lastDataRow)
                    ->getBorders()->getAllBorders()
                    ->setBorderStyle(Border::BORDER_THIN);
                
                // Align amounts to right
                $sheet->getStyle('D' . ($headerRow + 1) . ':D' . $lastDataRow)
                    ->getAlignment()->setHorizontal(Alignment::HORIZONTAL_RIGHT);
            } else {
                // No data message
                $sheet->setCellValue('A' . $row, 'Belum ada transaksi untuk periode ' . $sheetData['name']);
                $sheet->mergeCells('A' . $row . ':D' . $row);
                $sheet->getStyle('A' . $row)->getFont()->setBold(true)->setItalic(true)->setSize(12);
                $sheet->getStyle('A' . $row)->getAlignment()->setHorizontal(Alignment::HORIZONTAL_CENTER);
                $sheet->getStyle('A' . $row)->getFont()->getColor()->setRGB('999999');
                $row++;
                
                $row++; // Empty row
                
                // Add summary with zero values
                $sheet->setCellValue('C' . $row, 'TOTAL PENGELUARAN:');
                $sheet->setCellValue('D' . $row, 'Rp 0');
                $sheet->getStyle('C' . $row . ':D' . $row)->getFont()->setBold(true)->setSize(12);
                $row++;
                
                $sheet->setCellValue('C' . $row, 'JUMLAH TRANSAKSI:');
                $sheet->setCellValue('D' . $row, '0 transaksi');
                $sheet->getStyle('C' . $row . ':D' . $row)->getFont()->setBold(true);
            }
            
            // Set column widths for better spacing
            $sheet->getColumnDimension('A')->setWidth(15);
            $sheet->getColumnDimension('B')->setWidth(25);
            $sheet->getColumnDimension('C')->setWidth(45);
            $sheet->getColumnDimension('D')->setWidth(20);
        }
        
        // Create temporary file
        $fileName = 'Pengeluaran_Spently_' . date('Y-m-d_His') . '.xlsx';
        $tempFile = tempnam(sys_get_temp_dir(), 'excel_');
        
        $writer = new Xlsx($spreadsheet);
        $writer->save($tempFile);
        
        return response()->download($tempFile, $fileName, [
            'Content-Type' => 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
        ])->deleteFileAfterSend(true);
    }
}
