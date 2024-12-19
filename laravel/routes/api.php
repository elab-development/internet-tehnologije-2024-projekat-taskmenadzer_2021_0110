<?php

use App\Http\Controllers\CategoryController;
use App\Http\Controllers\NotificationController;
use App\Http\Controllers\TaskController;
use App\Http\Controllers\UserController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

Route::middleware('auth:api')->get('/user', function (Request $request) {
    return $request->user();
});

Route::post('/registracija', [UserController::class, 'registracija']);
Route::post('/prijava', [UserController::class, 'prijava']);
Route::post('/odjava', [UserController::class, 'odjava'])->middleware('auth:sanctum');
Route::get('/users', [UserController::class, 'allUsers'])->middleware('auth:sanctum');


Route::post('/forgot-password', [UserController::class, 'sendResetLink']);
Route::post('/reset-password', [UserController::class, 'resetPassword'])->name('password.update');

Route::get('reset-password/{token}', function ($token) {
    return view('auth.resetovanje-lozinke', ['token' => $token, 'email' => request('email')]);
})->middleware('guest')->name('password.reset');


Route::middleware('auth:sanctum')->group(function () {
    Route::get('/notifications', [NotificationController::class, 'index']);
    Route::get('/notifications/{id}', [NotificationController::class, 'show']);
    Route::post('/notifications', [NotificationController::class, 'store']);
    Route::put('/notifications/{id}', [NotificationController::class, 'update']);
    Route::delete('/notifications/{id}', [NotificationController::class, 'destroy']);
});

Route::resource('categories', CategoryController::class)->middleware(['auth:sanctum', 'role:member,manager,admin']);

Route::resource('tasks', TaskController::class)->except([
    'create', 'edit'
]);

// Route::resource('tasks', TaskController::class)->except([
//     'create', 'edit'
// ])->middleware(['auth:sanctum', 'role:member,manager']);

Route::get('/tasks/export/pdf', [TaskController::class, 'exportToPDF'])->middleware(['auth:sanctum', 'role:member,manager']);
Route::post('/tasks/upload/{taskId}', [TaskController::class, 'dodajFajl'])->middleware(['auth:sanctum', 'role:member,manager']);

Route::get('/holidays', function () {
    $country = 'RS'; // ISO kod Srbije
    $year = now()->year;

    $response = Http::get("https://date.nager.at/api/v3/PublicHolidays/$year/$country");

    if ($response->successful()) {
        return response()->json($response->json(), 200);
    }

    return response()->json(['error' => 'Could not fetch holidays'], 500);
});