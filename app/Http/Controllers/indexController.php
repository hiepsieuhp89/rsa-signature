<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

use App\Models\RsaSet;

class indexController extends Controller
{

    public function generateKey(Request $req){

    	$rsa = new RsaSet($req->all());
        
    	if($rsa->khoitao())

    	   return response(["error"=>0,"message" => "Tạo khóa thành công","data" => $rsa->toArray()]);

        return response(["error"=>1,"message" => "Tạo khóa không thành công","data" => $rsa->toArray()]);
    }
    public function readdocx(Request $req){

        $rsa = new RsaSet($req->all());
        
        $rsa->readdocx();

        return response(["error"=>0,"message" => "Đọc file docx thành công","data" => $rsa->toArray()]);
    }
    public function encrypt(Request $req){

    	$rsa = new RsaSet($req->all());

    	if($rsa->mahoa()){

    		$file = '/files/'.md5(date('Y-m-d H:i:s:u')).'.txt';

			$data = $rsa->encrypt_encrypted_doc ;
			
			file_put_contents(public_path().$file, $data);

			return response(["url"=>asset($file),"error"=>0,"message" => "Tạo chữ ký thành công","data" => $rsa->toArray()]);
    	}

	    return response(["error"=>1,"message" => "Tạo chữ ký thất bại","data" => $rsa->toArray()]);
    }
    public function check(Request $req){

    	$rsa = new RsaSet($req->all());

    	if($rsa->check())

    		return response(["error"=>0,"message"=>"Chữ ký hợp lệ, tài liệu không bị chỉnh sửa","data" => $rsa->toArray()]);

    	return response(["error"=>1,"message" => "Tài liệu đã được chỉnh sửa hoặc chữ ký không chính
xác","data" => $rsa->toArray()]);
    }
    public function md5file(Request $req){

        $rsa = new RsaSet($req->all());

        if($rsa->md5file())

            return response(["error"=>0,"message"=>"Đọc tài liệu thành công","data" => $rsa->toArray()]);

        return response(["error"=>1,"message" => "Đọc tài liệu không thành công","data" => $rsa->toArray()]);

        return $md5;
    }
    public function index(Request $req){

    	return view('welcome');
    }
}
