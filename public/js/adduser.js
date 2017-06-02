
$(function() {
          // 파일선택 값이 바뀌면
          $("#photoInput").change(function() {
              readURL(this);
          });
      });


function readURL(input) {
    if (input.files && input.files[0]) {
        var reader = new FileReader();
        reader.onload = function (e) {
            $('#photoOutput').attr('src', e.target.result);
        }
        reader.readAsDataURL(input.files[0]);
    }
}
   $("#deleteImage").click(function(){
      console.log(1)
      $("#photoOutput").attr('src','./img/user.png');
   });





window.onload=function(){
document.getElementById('duplicate').onclick = function () {

 location.href = '/process/adduser/' + $('#name').val();
}



document.getElementById('check').onclick = function(){
var pass1 = document.getElementById('pass1');
var pass2 = document.getElementById('pass2');


if(pass1.value === pass2.value){

  alert('비밀번호가 일치합니다.');
}else{

  alert('비밀번호가 일치하지 않음.');
}

}

}
