<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\RsaSet;

class indexController extends Controller
{

    public function generateKey(Request $req){

    	$rsa = new RsaSet($req->all());

    	$rsa->khoitao();

    	return response(["error"=>0,"message" => "Tạo khóa thành công","data" => $rsa->toArray()]);
    }

    public function encrypt(Request $req){

    	$rsa = new RsaSet($req->all());

    	if($rsa->mahoa()){

    		$file = '/files/'.md5(date('Y-m-d H:i:s:u')).'.txt';

			$data = $rsa->encrypt_encrypted_doc ;
			
			file_put_contents(public_path().$file, $data);

			return response(["url"=>asset($file),"error"=>0,"message" => "Mã hóa thành công","data" => $rsa->toArray()])
			->download(asset($file), "bản mã hóa");
    	}

	    return response(["error"=>1,"message" => "Mã hóa thất bại","data" => $rsa->toArray()]);

    }

    public function check(Request $req){

    	$rsa = new RsaSet($req->all());

    	if($rsa->check())

    		return response(["error"=>0,"message"=>"Chữ ký hợp lệ","data" => $rsa->toArray()]);

    	return response(["error"=>1,"message" => "Chữ ký không đúng","data" => $rsa->toArray()]);
    }

    public function index(Request $req){

    	return view('welcome');
    }
}
