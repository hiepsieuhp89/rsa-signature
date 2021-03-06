<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="utf-8">
  <meta content="width=device-width, initial-scale=1.0" name="viewport">

  <base href="{{ asset('') }}">
  <title>{{ env('APP_NAME') }}</title>
  <meta content="" name="descriptison">
  <meta content="" name="keywords">

  <!-- Favicons -->
  <link href="img\favicon.png" rel="icon">
  <link href="img\apple-touch-icon.png" rel="apple-touch-icon">

  <!-- Google Fonts -->
  <link href="https://fonts.googleapis.com/css?family=Open+Sans:300,300i,400,400i,600,600i,700,700i|Raleway:300,300i,400,400i,500,500i,600,600i,700,700i|Poppins:300,300i,400,400i,500,500i,600,600i,700,700i" rel="stylesheet">

  <!-- Vendor CSS Files -->
  <link href="vendor\bootstrap\css\bootstrap.min.css" rel="stylesheet">
  <link href="vendor\icofont\icofont.min.css" rel="stylesheet">
  <link href="vendor\boxicons\css\boxicons.min.css" rel="stylesheet">
  <link href="vendor\venobox\venobox.css" rel="stylesheet">
  <link href="vendor\owl.carousel\assets\owl.carousel.min.css" rel="stylesheet">
  <link href="vendor\aos\aos.css" rel="stylesheet">
  <link href="css\iziToast.min.css" rel="stylesheet">

  <!-- Template Main CSS File -->
  <link href="css\style.css" rel="stylesheet">

  <!-- =======================================================
  * Template Name: iPortfolio - v1.2.1
  * Template URL: https://devforum.info/frontend-template/
  * Author: DevForum.Info
  ======================================================== -->
</head>

<body>

  <!-- ======= Mobile nav toggle button ======= -->
  <button type="button" class="mobile-nav-toggle d-xl-none"><i class="icofont-navigation-menu"></i></button>

  <!-- ======= Header ======= -->
  <header id="header">
    <div class="d-flex flex-column">

      <div class="profile">
        <img src="img\ava.jpg" alt="" class="img-fluid rounded-circle">
        <h1 class="text-light"><a href="{{ route('index') }}">{{ config('app.author.name') }}</a></h1>
        <div class="social-links mt-3 text-center">
          <a href="{{ config('app.author.facebook') }}" class="facebook"><i class="bx bxl-facebook"></i></a>
          <a href="{{ config('app.author.youtube') }}" class="google-plus"><i class="bx bxl-youtube"></i></i></a>
          <a href="{{ config('app.author.github') }}" class="github"><i class="bx bxl-github"></i></i></a>
        </div>
      </div>

      <nav class="nav-menu">
        <ul>
          <li class="active"><a href="#rsa"><i class="bx bx-home"></i> <span>Chữ ký số RSA</span></a></li>
          <li><a href="#tutorial"><i class="bx bx-file-blank"></i> <span>Hướng dẫn</span></a></li>
          <li><a href="#hero"> <i class="bx bx-user"></i><span>Giới thiệu tác giả</span></a></li>

        </ul>
      </nav><!-- .nav-menu -->
      <button type="button" class="mobile-nav-toggle d-xl-none"><i class="icofont-navigation-menu"></i></button>

    </div>
  </header><!-- End Header -->

  <main id="main">


    <section id="rsa">

      <form id="key_generate_form">  
        <div class="container" id="rsa">
                <div class="section-title">
          <h2>Chữ ký số RSA</h2>
            </div>
                    <div class="row mr-0 mt-0 ml-0" style="padding: 5px;">
                        <div title="Tạo khóa" class="col-lg-4 col-md-10 mx-auto col-12" style="background: black;">
                            {{-- <div class="row toggle-panel mr-0 mt-0 ml-0" style="padding: 10px;">
                                <a style="border: none;" href="" class="panel item btn custom-btn bordered mt-3 col-md-6 aos-init aos-animate" data-aos="fade-up" data-aos-delay="700">Tao</a>
                                <a style="border: none;" href="" class="panel item btn custom-btn bordered mt-3 col-md-6 aos-init aos-animate" data-aos="fade-up" data-aos-delay="700">learn more</a>
                            </div> --}}
                              <div class="hero-text mt-4 mb-3 text-center">

                                    <h6 class="mb-3 mt-3 aos-init aos-animate text-white" data-aos="fade" data-aos-delay="300">Tạo khóa</h6>
                                    <div class="row">
                                        <label for="p" class="text-white text-modify1 col-sm-2 col-form-label">P =</label>
                                        <div class="col-sm-4 mb-2">
                                            <input type="number" class="form-control form-control-modify1 key-update" id="p" name="p">
                                        </div>
                                        <label for="q" class="text-white text-modify1 col-sm-2 col-form-label">Q =</label>
                                        <div class="col-sm-4 mb-2">
                                            <input type="number" class="form-control form-control-modify1 key-update" id="q" name="q">
                                        </div>
                                        <label for="eule" class="text-white text-modify1 col-sm-3 col-form-label">Ф(n) =</label>
                                        <div class="col-sm-9 mb-2">
                                            <input type="number" class="form-control form-control-modify1" id="eule" readonly="" name="eule" placeholder="=(P-1)*(Q-1)">
                                        </div>
                                    </div>
                                    <h6 class="mb-3 mt-5 aos-init aos-animate text-white" data-aos="fade" data-aos-delay="300">Cặp khóa công khai</h6>

                                    <div class="row">
                                        <label for="n" class="text-white text-modify1 col-sm-2 col-form-label">N =</label>
                                        <div class="col-sm-4">
                                            <input type="number" class="form-control form-control-modify1" id="n" name="n" readonly="">
                                        </div>
                                        <label for="e" class="text-white text-modify1 col-sm-2 col-form-label">E =</label>
                                        <div class="col-sm-4">
                                            <input type="number" class="form-control form-control-modify1" id="e" name="e">
                                        </div>
                                    </div>
                                    <h6 class="mb-3 mt-5 aos-init aos-animate text-white" data-aos="fade" data-aos-delay="300">Khóa bí mật</h6>

                                    <div class="row">
                                        <label for="d" class="text-white text-modify1 col-sm-2 col-form-label">D =</label>
                                        <div class="col-sm-10">
                                            <input type="number" class="form-control form-control-modify1" id="d" name="d">
                                        </div>
                                    </div>
                                    <a style="color:var(--primary-color);" action="auto-generate-key" class="btn custom-btn bordered mt-3 text-white" >Tạo khóa bất kỳ</a>
                              </div>
                         </div>
                         <div title="Mã hóa/giải mã" class="col-lg-8 col-md-10 mx-auto col-12" style="background: whitesmoke;">
                              <div class="hero-text mt-3 mb-3 text-center">
                                    <div class="row m-0">
                                        <div class="col-md-6 h-100 pb-3" style="background-color: white; padding: 0 30px;">
                                            <h6 class="mb-2 mt-3 aos-init aos-animate" data-aos="fade" data-aos-delay="300">Bên gửi</h6>
                                            <div class="row">
                                                <div class="mb-2 w-100">
                                                  <label for="encrypt_file" class="form-label float-start">Chọn file tài liệu cần ký(txt, docx,...) hoặc nhập Văn bản cần ký bên dưới</label>
                                                  <input class="form-control" type="file" id="encrypt_file" name="encrypt_file" insert-to="encrypt_doc">
                                                </div>
                                                <div class="mb-2 w-100">
                                                  <label for="encrypt_doc" class="form-label float-start">Văn bản cần ký(tùy chọn)</label>
                                                  <textarea class="form-control" id="encrypt_doc" rows="1" name="encrypt_doc"></textarea>
                                                </div>
                                                <div class="mb-2 w-100">
                                                  <label for="encrypt_md5" class="form-label float-start">Băm md5</label>
                                                  <textarea class="form-control" id="encrypt_md5" rows="1" name="encrypt_md5"></textarea>
                                                </div>
                                                <div class="mb-2 w-100">
                                                  <label for="encrypt_encrypted_doc" class="form-label float-start">Chữ ký</label>
                                                  <textarea class="form-control" id="encrypt_encrypted_doc" rows="1" name="encrypt_encrypted_doc"></textarea>
                                                </div>
                                            </div>
                                            <a action="encrypt" style="color:var(--primary-color);" class="btn custom-btn bordered mt-3 text-white">Lưu chữ ký</a>
                                        </div>
                                        <div class="col-md-6 h-100 pb-3" style=" padding: 0 30px;">
                                            <h6 class="mb-2 mt-3 aos-init aos-animate" data-aos="fade" data-aos-delay="300">Bên xác nhận</h6>
                                            <div class="row">
                                                <div class="mb-2" w-100>
                                                  <label for="decrypt_file" class="form-label float-start">Chọn file tài liệu cần kiểm tra chữ ký(txt, docx,...) hoặc nhập Văn bản cần kiểm tra bên dưới </label>
                                                  <input class="form-control" type="file" id="decrypt_file" name="decrypt_file">
                                                </div>
                                                <div class="mb-2 w-100">
                                                  <label for="decrypt_doc" class="form-label float-start">Văn bản cần xác nhận(Tùy chọn)</label>
                                                  <textarea class="form-control" id="decrypt_doc" rows="1" name="decrypt_doc"></textarea>
                                                </div>
                                                <div class="mb-2 w-100">
                                                  <label for="decrypt_encrypted_doc" class="form-label float-start">Chữ ký nhận được</label>
                                                  <textarea class="form-control" id="decrypt_encrypted_doc" rows="1" name="decrypt_encrypted_doc"></textarea>
                                                </div>
                                                <div class="mb-2 w-100">
                                                  <label for="decrypt_decrypted_doc" class="form-label float-start">Giải mã chữ ký</label>
                                                  <textarea class="form-control" id="decrypt_decrypted_doc" rows="1" name="decrypt_decrypted_doc"></textarea>
                                                </div>                                            </div>
                                            <a action="check" class="btn custom-btn bordered mt-3 text-white">Kiểm tra chữ ký</a>
                                        </div>
                                    </div>
                              </div>
                         </div>

                    </div>
        </div>
      </form>
    </section>


    <section id="tutorial">
      <div class="container">

        <div class="section-title">
          <h2>Hướng dẫn</h2>
          <p>- Nhập thông tin <b>khóa</b> hoặc bấm <b>Tạo khóa bất kỳ</b> để hệ thống tự động tạo khóa</p>
          <p>- Nhập <b>văn bản cần kí</b> hoặc chọn <b>tài liệu</b> cần kí, có thể là tài liệu word (docx) hoặc text document, sau đó hệ thống sinh ra mã băm MD5 của tài liệu</p>
          <p>- Bấm <b>Lưu chữ ký và hệ thống đẩy ra trang chứa chữ ký đã tạo</b> để <b>tải về</b>
          <p>Kiểm tra chữ kí: <br>
            &emsp; -Nếu người dùng nhập tài liệu thì <b>chọn tài liệu cần kiểm tra</b>  <br>
            &emsp; -Nếu người dùng nhập văn bản thì <b>chọn văn bản cần kiểm tra</b> <br>
            &emsp; -Bấm <b>Kiểm tra chữ ký</b> để kiểm tra chữ ký cho tài liệu, nếu tài liệu đã bị thay đổi hoặc chữ ký không đúng, <b> hệ thống sẽ cảnh báo tài liệu không khớp chữ ký </b>
          </p>
        </div>
      </div>
    </section>


    <section id="hero" class="d-flex flex-column justify-content-center align-items-center" style="position: relative;">
    <div class="hero-container" data-aos="fade-in">
      <h1>{{ config('app.author.name') }}</h1>
      <p>I'm <span class="typed" data-typed-items="Designer, Developer, Freelancer, Gamer, FAer"></span></p>
    </div>
  </section>

  </main>
    <a id="download" href="" target="_blank"></a>
  <footer id="footer">
  </footer>

  <a href="#" class="back-to-top"><i class="icofont-simple-up"></i></a>

  <!-- Vendor JS Files -->
  <script data-cfasync="false" src="/cdn-cgi/scripts/5c5dd728/cloudflare-static/email-decode.min.js"></script><script src="vendor\jquery\jquery.min.js"></script>
  <script src="vendor\bootstrap\js\bootstrap.bundle.min.js"></script>
  <script src="vendor\jquery.easing\jquery.easing.min.js"></script>
  <script src="vendor\php-email-form\validate.js"></script>
  <script src="vendor\waypoints\jquery.waypoints.min.js"></script>
  <script src="vendor\counterup\counterup.min.js"></script>
  <script src="vendor\isotope-layout\isotope.pkgd.min.js"></script>
  <script src="vendor\venobox\venobox.min.js"></script>
  <script src="vendor\owl.carousel\owl.carousel.min.js"></script>
  <script src="vendor\typed.js\typed.min.js"></script>
  <script src="vendor\aos\aos.js"></script>
  <script src="js/iziToast.min.js"></script>
  <script src="js/encrypt.js"></script>
     <script>
        function initialResponse(res){
            iziToast.destroy();
            if(res.url){

                $('#download').attr('href',res.url);

                document.getElementById('download').click();

            }
            $.each(res.data, function(i, n){

                $('.form-control[name="'+ i +'"]').val(n);

            });

            if(res.message)
                
                if(res.error)
                    iziToast.warning({
                                displayMode: 1,
                                position: 'topRight',
                                closeOnClick: true,
                                message: res.message,
                            });
                else
                    iziToast.success({
                                displayMode: 1,
                                position: 'topRight',
                                closeOnClick: true,
                                message: res.message,
                            });
        }
        $(document).ready(function(){

            $('.key-update').bind('keyup change input',function(){
                var n_value = $('.form-control#p').val() * $('.form-control#q').val();
                var phi_eule_value = ($('.form-control#p').val()-1) * ($('.form-control#q').val()-1);

                $('.form-control#eule').val(phi_eule_value);
                $('.form-control#n').val(n_value);
            })

            $('[action="auto-generate-key"]').on('click',function(){
                var d = new FormData(document.getElementById('key_generate_form'));
                iziToast.info({
                                timeout:0,
                                displayMode: 1,
                                position: 'topRight',
                                closeOnClick: true,
                                message: 'Đang tạo khóa, vui lòng chờ',
                            });
                $.ajax({
                    type : 'post',
                    url : '{{ route('client.key.generate') }}',
                    data : d,
                    contentType: false,
                    cache: false,
                    processData: false,
                    success:function(res){
                        initialResponse(res);
                    }
                });
            })

            $('[action="check"]').on('click',function(){
                var d = new FormData(document.getElementById('key_generate_form'));
                iziToast.info({
                                timeout:0,
                                displayMode: 1,
                                position: 'topRight',
                                closeOnClick: true,
                                message: 'Đang kiểm tra chữ ký, vui lòng chờ',
                            });
                $.ajax({
                    type : 'post',
                    url : '{{ route('client.rsa.check') }}',
                    data : d,
                    contentType: false,
                    cache: false,
                    processData: false,
                    success:function(res){
                        initialResponse(res);
                    }
                });
            })

            $('[action="encrypt"]').on('click',function(){

                if($('.form-control[name="encrypt_doc"').val() == ""){
                    $('.form-control[name="decrypt_file"').val("").show();
                    $('.form-control[name="decrypt_doc"').val("").hide();
                }
                else{
                    $('.form-control[name="decrypt_doc"').val("").show();
                    $('.form-control[name="decrypt_file"').val("").hide();
                }

                var d = new FormData(document.getElementById('key_generate_form'));
                iziToast.info({
                                timeout:0,
                                displayMode: 1,
                                position: 'topRight',
                                closeOnClick: true,
                                message: 'Đang tạo chữ ký, vui lòng chờ',
                            });
                $.ajax({
                    type : 'post',
                    url : '{{ route('client.rsa.encrypt') }}',
                    data : d,
                    contentType: false,
                    cache: false,
                    processData: false,
                    success:function(res){
                        initialResponse(res);
                    }
                });
            })

            $('.form-control[name="encrypt_doc"').bind('keyup change input',function(){

                $('.form-control[name="encrypt_file"').val('');

                var md5 = CryptoJS.MD5($(this).val());

                $('.form-control[name="encrypt_md5"').val(md5);

            })
            $('.form-control[name="decrypt_doc"').bind('keyup change input',function(){

                $('.form-control[name="decrypt_file"').val('');

            })

            $('.form-control[name="encrypt_file"').bind('change input',function(){

                $('.form-control[name="encrypt_doc"').val("");

            })
            $('.form-control[name="decrypt_file"').bind('change input',function(){

                $('.form-control[name="decrypt_doc"').val("");

            })

            $('[type="file"]').on('change', function() {

              var d = new FormData(document.getElementById('key_generate_form'));
              iziToast.info({
                            timeout:0,
                                displayMode: 1,
                                position: 'topRight',
                                closeOnClick: true,
                                message: 'Đang tải tài liệu, vui lòng chờ',
                            });
                d.append('file',this.files[0]);
                $.ajax({
                    type : 'post',
                    url : '{{ route('client.rsa.md5file') }}',
                    data : d,
                    contentType: false,
                    cache: false,
                    processData: false,
                    success:function(res){
                        initialResponse(res);
                    }
                });

              // var doc=new Docxtemplater().loadZip(zip)

              // var text= doc.getFullText();

              // var e = this;
              // $('.form-control[name="'+ $(e).attr('insert-to') +'"]').val(text);
              
              // if($(e).attr('insert-to') == "encrypt_doc")
              //     $('.form-control[name="encrypt_md5"').val(CryptoJS.MD5($('.form-control[name="encrypt_doc"').val()));

              //var fr = new FileReader();

                // fr.onload = function(){

                //     $('.form-control[name="'+ $(e).attr('insert-to') +'"]').val(fr.result);

                //     if($(e).attr('insert-to') == "encrypt_doc")

                //         $('.form-control[name="encrypt_md5"').val(CryptoJS.MD5($('.form-control[name="encrypt_doc"').val()));
                // }
                  
                // fr.readAsText(this.files[0]);
            })
            $.ajaxSetup({
                headers:{
                        'X-CSRF-TOKEN' : '{{ csrf_token() }}'
                }
            });
        })
     </script> 

  <!-- Template Main JS File -->
  <script src="js\main.js"></script>

</body>

</html>