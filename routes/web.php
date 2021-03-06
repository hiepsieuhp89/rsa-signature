<?php

use Illuminate\Support\Facades\Route;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

Route::get('/', [App\Http\Controllers\indexController::class,'index'])->name('index');

Route::get('/key/generate', [App\Http\Controllers\indexController::class,'generateKey']);
Route::post('/key/generate', [App\Http\Controllers\indexController::class,'generateKey'])->name('client.key.generate');

Route::post('/encrypt', [App\Http\Controllers\indexController::class,'encrypt'])->name('client.rsa.encrypt');

Route::post('/check', [App\Http\Controllers\indexController::class,'check'])->name('client.rsa.check');

Route::post('/readdocx', [App\Http\Controllers\indexController::class,'readdocx'])->name('client.rsa.readdox');

Route::post('/md5_file', [App\Http\Controllers\indexController::class,'md5file'])->name('client.rsa.md5file');