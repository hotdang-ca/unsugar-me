<?php
use Illuminate\Http\Response;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

/*
|--------------------------------------------------------------------------
| Application Routes
|--------------------------------------------------------------------------
|
| Here is where you can register all of the routes for an application.
| It is a breeze. Simply tell Lumen the URIs it should respond to
| and give it the Closure to call when that URI is requested.
|
*/

$app->group(['prefix' => 'api/v1'], function () use ($app) {
  $app->get('/hello', function () use ($app) {
    return response()->json([
      "version" => $app->version()
    ]);
  });

  $app->get('/convert/{grams}/to_percent', function ($grams) {
    // 25g is 100%
    // so, 2.5g is 10%

    // TODO: record these numbers.
    $percent = ($grams / 25);
    return response()->json([
      "sugar" => [
        "amount" => $grams,
        "percentage" => $percent
      ]
    ]);
  });

  $app->get('/save/{brand}/{grams}/{per}/{unit}', function ($brand, $grams, $per, $unit) {
    // TODO: maybe only accept GET from origins from my own site...

    DB::insert('insert into sugarsins (brand, grams, per, unit) values (?, ?, ?, ?)',
    [ $brand,
      $grams,
      $per,
      $unit
    ]);

    return response()->json([
      "information" => [
        "brand" => $brand,
        "per" => $per,
        "unit" => $unit
      ]
    ]);
  });

  $app->get('/sugarsins', function() {
    $results = DB::select("SELECT * FROM sugarsins");
    return response()->json($results);
  });
});
