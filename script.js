      $(document).ready(function(){
        /*웹페이지 열었을 때*/
        $("#triangle_close").show();
        $("#triangle_open").hide();

        /*close을 클릭했을 때 open를 보여줌*/
        $("#triangle_close").click(function(){
            $("#triangle_close").hide();
            $("#triangle_open").show();
        });

        /*open를 클릭했을 때 close을 보여줌*/
        $("#triangle_open").click(function(){
            $("#triangle_close").show();
            $("#triangle_open").hide();
        });
    });

/*sidebar*/
function toggleSidebar(ref){
  document.getElementById("sidebar").classList.toggle('active');
}
  


//input 입력 창을 지워줌

function clearInput(){
  let text = document.getElementsByClassName('input_text');

for(let i=0; i<text.length; i++){
	  text[i].value = '';
}
}