<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Exception;

class RsaSet extends Model
{
    use HasFactory;

    //protected $p, $q, $n, $e, $d, $eule, $pub_key, $pri_key;

    function __construct($input){

        //key set

    	$this->p = isset($input['p']) ? (double)$input['p'] : null;

    	$this->q = isset($input['q']) ? (double)$input['q'] : null;

    	$this->eule = ($this->p != null && $this->q != null) ? ($this->p-1 ) * ($this->q - 1) : null;

    	$this->n = ($this->eule != null) ? ($this->p *$this->q) : null;

    	$this->e = isset($input['e']) ? (double)$input['e'] : null;

    	$this->pub_key = null;

        $this->d = isset($input['d']) ? (double)$input['d'] : null;

        // $this->p = (double)$input['p'];

        // $this->q = (double)$input['q'];

        // $this->eule = ($this->p-1 ) * ($this->q - 1);

        // $this->n = ($this->p * $this->q);

        // $this->e = (double)$input['e'];

        // $this->pub_key = null;

        // $this->d = (double)$input['d'];


        //encrypt and send

        $this->encrypt_md5 = isset($input['encrypt_md5']) ? $input['encrypt_md5'] : null;// ban ro gui di

        $this->encrypt_encrypted_doc = isset($input['encrypt_encrypted_doc']) ? $input['encrypt_encrypted_doc'] : null;// ban ma hoa gui di

        // check

        $this->decrypt_encrypted_doc = isset($input['decrypt_encrypted_doc']) ? $input['decrypt_encrypted_doc'] : null;// ban ma hoa nhan duoc

        $this->decrypt_doc = isset($input['decrypt_doc']) ? $input['decrypt_doc'] : null;// ban ro nhan duoc

        $this->decrypt_decrypted_doc= isset($input['decrypt_decrypted_doc']) ? $input['decrypt_decrypted_doc'] : null;// ban giai ma duoc tu ban ma hoa nhan duoc

    }
    public function kiemtrasonguyento($so){

    	$kiemtra = true;

    	if ($so == 2 || $so == 3){

            return $kiemtra;
        }
        else{
            if ($so == 1 || $so % 2 == 0 || $so % 3 == 0){

                $kiemtra = false;
            }
            else{

                for ($i = 5; $i <= sqrt($so); $i = $i + 6)

                    if ($so % $i == 0 || $so % ($i + 2) == 0){

                        $kiemtra = false;

                        break;
                    }
            }
        }
        return $kiemtra;
    }
    public function nguyentocungnhau($so1, $so2)
        {

            while ($so2 != 0)
            {
                $temp = $so1 % $so2;
                $so1 = $so2;
                $so2 = $temp;
            }

            if ($so1 == 1) 
            	$ktx_ = true;
            else 
            	$ktx_ = false;

            return $ktx_;
        }

    public function RSA_mod ($mx,$ex,$nx){
        if(!is_numeric($mx) || !is_numeric($ex) || !is_numeric($nx)){
                            throw new Exception('Số sai');
                        }
            //bình phương và nhân
            //Chuyển e sang hệ nhị phân
                $a = [];
                $k = 0;
                do{
                    $a[$k] = $ex % 2;
                    $k++;
                    $ex = $ex / 2;
                }while ($ex != 0);
                //Quá trình lấy dư

                $kq = 1;
                for ($i = $k - 1; $i >= 0; $i--){

                    $kq = ($kq * $kq) % $nx;
                    if ($a[$i] == 1){
                        $kq = ($kq * $mx) % $nx;
                    }

                }
                return $kq;
            
    }

    public function taokhoa()
        {
            //Tinh n=p*q
            $this->n = $this->p * $this->q;

            //Tính Phi(n)=(p-1)*(q-1)
            $this->eule = ($this->p - 1) * ($this->q - 1);

            //Tính e là một số ngẫu nhiên có giá trị 0 < e <phi(n) và là số nguyên tố cùng nhau với Phi(n)
            do{

                $this->e = rand(2, $this->eule);

            } while (!$this->nguyentocungnhau($this->e, $this->eule));

            //Tính d = 1 mod eule
            $this->d = 0;
            $i = 2;
            while (((1 + $i * $this->eule) % $this->e) != 0 || $this->d <= 0)
            {
                $i++;
                $this->d = (1 + $i * $this->eule) / $this->e;
            }
            //$this->d = base64_encode($this->d);
        }

    public function khoitao(){

        if($this->p > 0 && $this->q > 0)

            if($this->p == $this->q || !$this->kiemtrasonguyento($this->p) || !$this->kiemtrasonguyento($this->q))

             return false;

    	while($this->p == $this->q || !$this->kiemtrasonguyento($this->p) || !$this->kiemtrasonguyento($this->q)){

            $this->p = rand(7, 101);

            $this->q = rand(7, 101);
        };

    	$this->taokhoa();

        return true;
    }

    public function mahoa()
        {
            try{
                if ($this->d == NULL || $this->d == "")

                    return false; // chua nhap khoa

                else
                {
                    if ($this->encrypt_md5 == "")
                    {
                        return false; // chua nhap ban ro
                    }

                    else
                    {

                        $base64 = $this->encrypt_md5;

                       //$base64 = base64_encode($base64);

                        //dd($base64);

                        $mh_temp2 = [];

                        for ($i = 0; $i < strlen($base64); $i++)
                        {
                            $mh_temp2[$i] = ord($base64[$i]); //return integer
                        }

                        //dd($mh_temp2);

                        $mh_temp3 = [];
                        
                        for ($i = 0; $i < count($mh_temp2); $i++)
                        {
                            $mh_temp3[$i] = $this->RSA_mod($mh_temp2[$i], $this->e, $this->n); // mã hóa
                            if($mh_temp3[$i] < 0) return false;
                        }

                        //dd($mh_temp3);

                        $data = implode(',',$mh_temp3);

                        $this->encrypt_encrypted_doc = base64_encode($data);

                        $this->banMaHoaGuiDen = base64_encode($data);

                    }
                }
                return true;
            }catch(Exception $e){
                return false;
            }
    }
    public function check()
        {
            try{

                if ($this->d == NULL || $this->d == "")

                    return false; // chua nhap khoa

                else{

                    $giaima = base64_decode($this->decrypt_encrypted_doc);

                    $b = explode(',',$giaima);           

                    $c = [];

                    for ($i = 0; $i < count($b); $i++)
                    {
                        $c[$i] = $this->RSA_mod($b[$i], $this->d, $this->n);

                        if($c[$i] < 0) {
                            $this->decrypt_decrypted_doc = "";
                            return false;

                        }
                    }

                    $str = "";

                    for ($i = 0; $i < count($c); $i++)

                    {
                        $str .= chr($c[$i]);
                    }
                
                    $this->decrypt_decrypted_doc = $str;

                    if($this->decrypt_decrypted_doc == md5($this->decrypt_doc))

                        return true;
                    else
                        
                        return false;
                }
            }catch(Exception $e){

                $this->decrypt_decrypted_doc = "";
                return false;

            }
        }
}
