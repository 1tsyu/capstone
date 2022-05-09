let police = [];
$(document).ready(function () {
  /*웹페이지 열었을 때*/

  $("#bars").show();


  $("#bars").click(function () {
    $("#bars").show();
  });
});



/*toggle sidebar*/
function toggleSidebar(ref) { 

  document.getElementById("sidebar").classList.toggle("active");
 
}

//input 입력 창을 지워줌

function clearInput() {
  let text = document.getElementsByClassName("input_text");

  for (let i = 0; i < text.length; i++) {
    text[i].value = "";
  }
}

function change(num) {
  let ct1 = document.getElementById("contents1");
  let ct2 = document.getElementById("contents2");
  let fi1 = document.getElementById("footer_info_1");
  let fi2 = document.getElementById("footer_info_2");

  let i = 1;

  const tmp = document.getElementById("time");
  const len = document.getElementById("length");

  if (num == 0) {
    ct2.style.display = "none";
    ct1.style.display = "block";
    fi1.style.display = "block";
    fi2.style.display = "none";
  } else if (num == 1) {
    ct1.style.display = "none";
    ct2.style.display = "block";
  } else if(num == 2) {
    fi1.style.display = "none";
    fi2.style.display = "block";
    tmp.innerHTML = "소요시간 : ";
    len.innerHTML = "거리 : ";
  }
}

  $.ajax({
            type : "POST",            // HTTP method type(GET, POST) 형식이다.
            url : "police.php",
            dataType: 'json',      // 컨트롤러에서 대기중인 URL 주소이다.
            success : function(res){ // 비동기통신의 성공일경우 success콜백으로 들어옵니다. 'res'는 응답받은 데이터이다.
              for(let i=0; i<res.length; i++){
                police[i] = res[i];

               
                let police_name = "<div id='po_n'> 이름 : "+police[i].name+"</div>"  
                let police_address = "<div id='po_add'> 주소 : "+police[i].address+"</div>"  
                let police_tel = "<div id='po_tel'> 전화번호 : "+police[i].tel+"</div>"  

                
                let div = "<div class='police" + i + "'>" +
               police_name + police_address + police_tel + "</div>";
               
                $('#surround').append(div);
}
              
            },
            error : function(XMLHttpRequest, textStatus, errorThrown){ // 비동기 통신이 실패할경우 error 콜백으로 들어옵니다.
                console.log(XMLHttpRequest);
            }
    });


