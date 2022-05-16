let policeData = [];
let placeData = [];
let cctvData = [];
let cctvData_2 = [];
var map;
var totalMarkerArr = [];
var drawInfoArr = [];
var resultdrawArr = [];
var ans = []; // 경유할  cctv위도 경도를 저장하는 배열
var totallen = 0; //출발지에서 도착지까지 총거리
var cnt = 0;
let c = 0;
let d = 0;
let iconName = "";
let stopflag = 0;
let startlocX = 0;
let startlocY = 0;
let endlocX = 0;
let endlocY = 0;
// let startlocX=128.57702454733175;
// let startlocY=35.85479459364812;
// let endlocX=128.5842192776504;
// let endlocY=35.847160657373024;
var sumDistance = 0;
var sumTime = 0;

$(document).ready(function () {
  /*웹페이지 열었을 때*/
  $("#triangle_close").show();
  $("#triangle_open").hide();

  /*close을 클릭했을 때 open를 보여줌*/
  $("#triangle_close").click(function () {
    $("#triangle_close").hide();
    $("#triangle_open").show();
    $("#bars").hide();
  });

  /*open를 클릭했을 때 close을 보여줌*/
  $("#triangle_open").click(function () {
    $("#triangle_close").show();
    $("#triangle_open").hide();
    $("#bars").show();
  });

  $("#bars").click(function () {
    $("#bars").hide();
    $("#triangle_close").hide();
    $("#triangle_open").show();
  });

  getCctv();
  getPolice();
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
//경로or경찰서 select + 경찰서 list 부분----------------------------------------------------------------
function change(num) {
  let ct1 = document.getElementById("contents1");
  let ct2 = document.getElementById("contents2");
  let fi1 = document.getElementById("footer_info_1");
  let fi2 = document.getElementById("footer_info_2");
  let lc1 = document.getElementById("location-start");
  let lc2 = document.getElementById("location");

  let i = 1;

  const tmp = document.getElementById("time");
  const len = document.getElementById("length");

  if (num == 0) {
    ct2.style.display = "none";
    ct1.style.display = "block";
    fi1.style.display = "block";
    fi2.style.display = "none";
    document.getElementById("search_go").style.display = "none";
  } else if (num == 1) {
    ct1.style.display = "none";
    ct2.style.display = "block";
  } else if (num == 2) {
    if (lc1.value == "" || lc2.value == "") {
      alert("출발지 or 도착지를 입력해주세요");
      if (lc1.value == "" || (lc1.value == "" && lc2.value == "")) {
        search_point(0);
      } else if (lc2.value == "") {
        search_point(1);
      }
    } else {
      fi1.style.display = "none";
      fi2.style.display = "block";
      $("#location-start").removeAttr("onclick");
      $("#location").removeAttr("onclick");
      document.getElementById("delete_btn1").style.display = "none";
      document.getElementById("delete_btn2").style.display = "none";
      printName();
      navigate();
    }
  }
}

//출발지+도착지 검색부분----------------------------------------------------------------
function search_point(select) {
  let search_go = document.getElementById("search_go");
  let search_input = document.getElementById("search_input");
  search_input.innerHTML = "";
  document.getElementById("searchResult").innerHTML = "";
  if (select == 0) {
    search_input.innerHTML =
      "<input type='text' id='search_point' value='' /><button id='search_btn'><i class='fa-solid fa-magnifying-glass'></i></button>";
    search_go.style.display = "block";
    document
      .getElementById("search_point")
      .setAttribute("placeholder", " 출발지를 입력하세요");
    document
      .getElementById("search_btn")
      .setAttribute("onclick", "searchresult(0)");
  } else if (select == 1) {
    search_input.innerHTML =
      "<input type='text' id='search_point' value='' /><button id='search_btn'><i class='fa-solid fa-magnifying-glass'></i></button>";
    search_go.style.display = "block";
    document
      .getElementById("search_point")
      .setAttribute("placeholder", " 도착지를 입력하세요");
    document
      .getElementById("search_btn")
      .setAttribute("onclick", "searchresult(1)");
  }
  document.getElementById("search_point").focus();
}
function searchresult(select) {
  var searchKeyword = $("#search_point").val(); // 검색 키워드
  $.ajax({
    method: "GET", // 요청 방식
    url: "https://apis.openapi.sk.com/tmap/pois?version=1&format=json&callback=result", // url 주소
    async: false, // 동기설정
    data: {
      // 요청 데이터 정보
      appKey: "l7xxf71b7e3a0f8143d6b17183353dc91a56", // 발급받은 Appkey
      searchKeyword: searchKeyword, // 검색 키워드
      resCoordType: "EPSG3857", // 요청 좌표계
      reqCoordType: "WGS84GEO", // 응답 좌표계
      areaLLCode: "27",
      areaLMCode: "200",
      count: 100, // 가져올 갯수
    },
    success: function (response) {
      console.log(response);
      var resultpoisData = response.searchPoiInfo.pois.poi;
      var innerHtml = "";
      let count = 0;

      for (let i = 0; i < resultpoisData.length; i++) {
        if (resultpoisData[i].lowerAddrName == "대명동") {
          placeData[count] = {
            name: resultpoisData[i].name,
            address:
              resultpoisData[i].newAddressList.newAddress[0].fullAddressRoad,
            coordinate: {
              lat: resultpoisData[i].noorLat,
              log: resultpoisData[i].noorLon,
            },
          };
          count++;
        }
      }
      for (let i = 0; i < count; i++) {
        innerHtml +=
          "<div class='select_list' onclick='goInput(" +
          select +
          "," +
          i +
          ")'>" +
          "<p>" +
          placeData[i].name +
          "</p>" +
          "<p> 주소 : " +
          placeData[i].address +
          "</p>" +
          "</div>";
      }
      $("#searchResult").html(innerHtml); //searchResult 결과값 노출
    },
    error: function (request, status, error) {
      console.log(
        "code:" +
          request.status +
          "\n" +
          "message:" +
          request.responseText +
          "\n" +
          "error:" +
          error
      );
    },
  });
}

function goInput(select, i) {
  var pointCng = new Tmapv2.Point(
    placeData[i].coordinate.log,
    placeData[i].coordinate.lat
  );
  var projectionCng = new Tmapv2.Projection.convertEPSG3857ToWGS84GEO(pointCng);
  if (select == 0) {
    document.getElementById("location-start").value = placeData[i].name;
    startlocX = projectionCng._lng;
    startlocY = projectionCng._lat;
  } else if (select == 1) {
    document.getElementById("location").value = placeData[i].name;
    endlocX = projectionCng._lng;
    endlocY = projectionCng._lat;
  }
  document.getElementById("search_point").value = "";
  document.getElementById("searchResult").innerHTML = "";
  document.getElementById("search_go").style.display = "none";
}
//출발지,도착지 정보 날리는 부분-------------------------------------------
function delete_point(select) {
  document.getElementById("footer_info_2").style.display = "none";
  document.getElementById("footer_info_1").style.display = "block";
  console.log(startlocX, startlocY, endlocX, endlocY);
  if (ans.length > 0) {
    ans = [];
    map.destroy();
    initTmap();
  }
  if (select == 0) {
    document.getElementById("location-start").value = "";
    startlocX = "";
    startlocY = "";
  } else if (select == 1) {
    document.getElementById("location").value = "";
    endlocX = "";
    endlocY = "";
  }
}

//데이터가져오는 부분------------------------------------------------------
function getCctv() {
  $.ajax({
    type: "POST", // HTTP method type(GET, POST) 형식이다.
    url: "cctv.php",
    dataType: "json", // 컨트롤러에서 대기중인 URL 주소이다.
    success: function (res) {
      let count = 0;
      // 비동기통신의 성공일경우 success콜백으로 들어옵니다. 'res'는 응답받은 데이터이다.
      for (let i = 0; i < res.length; i++) {
        cctvData[count] = res[i].latitude;
        cctvData[count + 1] = res[i].longitude.replace("\r", "");
        count += 2;
        cctvData_2[i] = {
          latitude: res[i].latitude,
          longitude: res[i].longitude.replace("\r", ""),
        };
      }
    },
    error: function (XMLHttpRequest, textStatus, errorThrown) {
      // 비동기 통신이 실패할경우 error 콜백으로 들어옵니다.
      console.log(XMLHttpRequest);
    },
  });
}

function getPolice() {
  $.ajax({
    type: "POST", // HTTP method type(GET, POST) 형식이다.
    url: "police.php",
    dataType: "json", // 컨트롤러에서 대기중인 URL 주소이다.
    success: function (res) {
      // 비동기통신의 성공일경우 success콜백으로 들어옵니다. 'res'는 응답받은 데이터이다.
      for (let i = 0; i < res.length; i++) {
        policeData[i] = res[i];

        let police_img = "<img src='img/police.png'/>";
        let police_name =
          "<div class='po_n'> 이름 : " + policeData[i].name + "</div>";
        let police_address =
          "<div class='po_add'> 주소 : <br>" + policeData[i].address + "</div>";
        let police_tel =
          "<div class='po_tel'> 전화번호 : " + policeData[i].tel + "</div>";

        let div =
          "<button class='police' onclick='viewPolice(" +
          i +
          ")'>" +
          police_img +
          "<div class='police_detail'>" +
          police_name +
          police_address +
          police_tel +
          "</div></button>";

        $("#surround").append(div);
      }
    },
    error: function (XMLHttpRequest, textStatus, errorThrown) {
      // 비동기 통신이 실패할경우 error 콜백으로 들어옵니다.
      console.log(XMLHttpRequest);
    },
  });
}

//지도부분----------------------------------------------------------------
function initTmap() {
  // 1. 지도 띄우기
  map = new Tmapv2.Map("map_div", {
    center: new Tmapv2.LatLng(35.840253, 128.579759),
    width: "100%",
    height: "100vh",
    zoom: 15,
    zoomControl: true,
    scrollwheel: true,
  });
}

function navigate() {
  var startPoint = new Tmapv2.Marker({
    position: new Tmapv2.LatLng(startlocY, startlocX), //시작좌표.
  });
  var endPoint = new Tmapv2.Marker({
    position: new Tmapv2.LatLng(endlocY, endlocX), //e도착좌표.
  });
  totallen = parseInt(
    startPoint.getPosition().distanceTo(endPoint.getPosition()) / 11
  );

  function calcu(lati, long) {
    let qwe = [];
    let tmp = []; //인덱스 저장
    let dtmp = [];
    let arr = [];
    let cpy = []; //(원본)
    let drr = []; //노드에서 도착점까지 거리가 정렬된 배열
    let cdrr = []; //노드에서 도착점까지 거리를 담은 배열   (원본)
    let rra = [];
    let deviation = []; //근사값을 구하기 위해 경계지점(시작점에 도착점까지의 거리를 노드 수 만큼 나눈 값)에서 각 노드들의 편차를 저장하는 배열
    if (cnt == 10) {
      //재귀함수 종료조건
      return;
    }
    //iconName = "http://tmapapi.sktelecom.com/upload/tmap/marker/pin_b_m_";
    //iconName += String(cnt + 1) + ".png";
    var marker1 = new Tmapv2.Marker({
      position: new Tmapv2.LatLng(lati, long), //Marker의 중심좌표 설정.
      icon: "img/cctv_marker.png", //Marker의 아이콘.
      map: map, //Marker가 표시될 Map 설정.
    });
    var marker2 = new Tmapv2.Marker({
      position: new Tmapv2.LatLng(endlocY, endlocX), //e도착좌표.
      icon: "img/end_marker.png", //Marker의 아이콘.
      map: map, //Marker가 표시될 Map 설정.
    });
    var marker0 = new Tmapv2.Marker({
      position: new Tmapv2.LatLng(startlocY, startlocX), //e도착좌표.
      icon: "img/start_marker.png", //Marker의 아이콘.
      map: map, //Marker가 표시될 Map 설정.
    });

    for (var i = 0; i < cctvData.length; i += 2) {
      var marker3 = new Tmapv2.Marker({
        position: new Tmapv2.LatLng(cctvData[i], cctvData[i + 1]), //Marker의 중심좌표 설정.
        //icon: 'http://tmapapi.sktelecom.com/upload/tmap/marker/pin_b_m_b.png', //Marker의 아이콘.
        //map: map //Marker가 표시될 Map 설정.
      });
      // 두 지점간의 거리를 계산합니다.
      distance1 = marker1.getPosition().distanceTo(marker3.getPosition()); //시작점에서 cctv들과의 거리
      distance2 = marker3.getPosition().distanceTo(marker2.getPosition()); //cctv에서 도착지까지 거리
      rra.push(distance1);
      cdrr.push(distance2);
    }

    for (var i = 0; i < rra.length; i++) {
      //총거리에서 11을 나눈값에서 근사값을 구하기 위한 배열
      arr.push(Math.abs(totallen - rra[i]));
    }

    for (var i = 0; i < arr.length; i++) {
      cpy[i] = arr[i]; //원본 복사 배열
    }

    arr.sort(function (a, b) {
      return a - b;
    });

    for (var i = 0; i < arr.length; i++) {
      if (tmp.length == 5) {
        //근사값 거리에 있는 cctv5개 넣음
        break;
      }
      //if(arr[i]>totallen){
      tmp.push(cpy.indexOf(arr[i]));
      //}
    }

    for (var i = 0; i < tmp.length; i++) {
      drr.push(cdrr[tmp[i]]);
    }

    drr.sort(function (a, b) {
      return a - b;
    });

    let loc = cdrr.indexOf(drr[0]) * 2; //cctv배열에서 위도의 인덱스
    ans.push(cctvData[loc]);
    ans.push(cctvData[loc + 1]);
    c = cctvData[loc]; //위도
    d = cctvData[loc + 1]; //경도
    cctvData.splice(loc, 1); //cctv 좌표 배열에서 위도,경도 제거
    cctvData.splice(loc + 1, 1); //
    cnt += 1; //재귛함수 종료 카운트
    return calcu(c, d);
  }

  calcu(startlocY, startlocX); //시작좌표 함수에 매개변수로 입력
  var plz = "";
  plz += String(ans[1]) + "," + String(ans[0]);
  plz += "_" + String(ans[3]) + "," + String(ans[2]);
  plz += "_" + String(ans[5]) + "," + String(ans[4]);
  plz += "_" + String(ans[7]) + "," + String(ans[6]);
  plz += "_" + String(ans[9]) + "," + String(ans[8]);
  var zlp = "";
  //zlp+=String(ans[11])+","+String(ans[10]);
  zlp += String(ans[13]) + "," + String(ans[12]);
  zlp += "_" + String(ans[15]) + "," + String(ans[14]);
  //zlp+="_"+String(ans[17])+","+String(ans[16]);
  //zlp+="_"+String(ans[19])+","+String(ans[18]);
  //zlp+="_"+String(ans[21])+","+String(ans[20]);
  // 2. 시작, 도착 심볼찍기
  // var ans1=String(chart_array[13]);
  // ans1+=","+String(chart_array[12]);
  // marker_s = new Tmapv2.Marker(
  // 		{
  // 			position : new Tmapv2.LatLng(35.85479459364812, 128.57702454733175),
  // 			icon : "http://tmapapi.sktelecom.com/upload/tmap/marker/pin_r_m_s.png",
  // 			iconSize : new Tmapv2.Size(24, 38),
  // 			map : map
  // 		});

  // // 도착
  // marker_e = new Tmapv2.Marker(
  // 		{
  // 			position : new Tmapv2.LatLng(37.57081522, 127.00160213),
  // 			icon : "http://tmapapi.sktelecom.com/upload/tmap/marker/pin_r_m_e.png",
  // 			iconSize : new Tmapv2.Size(24, 38),
  // 			map : map
  // 		});
  // 3. 경로탐색 API 사용요청
  $.ajax({
    method: "POST",
    url: "https://apis.openapi.sk.com/tmap/routes/pedestrian?version=1&format=json&callback=result",
    async: false,
    data: {
      appKey: "l7xxf71b7e3a0f8143d6b17183353dc91a56",
      startX: String(startlocX),
      startY: String(startlocY),
      endX: String(ans[11]), //시작점과 도착점의 중간 cctv 위도 경도
      endY: String(ans[10]), //시작점과 도착점의 중간 cctv 위도 경도
      passList: plz,
      reqCoordType: "WGS84GEO",
      resCoordType: "EPSG3857",
      startName: "출발지",
      endName: "도착지",
      searchOption: 10,
    },

    success: function (response) {
      var resultData = response.features;
      //결과 출력
      sumDistance = parseFloat(
        (resultData[0].properties.totalDistance / 1000).toFixed(1)
      );
      sumTime = parseFloat(
        (resultData[0].properties.totalTime / 60).toFixed(0)
      );
      //기존 그려진 라인 & 마커가 있다면 초기화s
      drawInfoArr = [];
      for (var i in resultData) {
        //for문 [S]
        var geometry = resultData[i].geometry;
        var properties = resultData[i].properties;
        var polyline_;
        if (geometry.type == "LineString") {
          for (var j in geometry.coordinates) {
            // 경로들의 결과값(구간)들을 포인트 객체로 변환
            var latlng = new Tmapv2.Point(
              geometry.coordinates[j][0],
              geometry.coordinates[j][1]
            );
            // 포인트 객체를 받아 좌표값으로 변환
            var convertPoint = new Tmapv2.Projection.convertEPSG3857ToWGS84GEO(
              latlng
            );
            // 포인트객체의 정보로 좌표값 변환 객체로 저장
            var convertChange = new Tmapv2.LatLng(
              convertPoint._lat,
              convertPoint._lng
            );
            // 배열에 담기
            drawInfoArr.push(convertChange);
          }
        } else {
          var markerImg = "";
          var pType = "";
          var size;
          if (properties.pointType == "S") {
            //출발지 마커
            markerImg =
              "http://tmapapi.sktelecom.com/upload/tmap/marker/pin_r_m_s.png";
            pType = "S";
            size = new Tmapv2.Size(24, 38);
          } else if (properties.pointType == "E") {
            //도착지 마커
            markerImg =
              "http://tmapapi.sktelecom.com/upload/tmap/marker/pin_r_m_e.png";
            pType = "E";
            size = new Tmapv2.Size(24, 38);
          } else {
            //각 포인트 마커
            markerImg = "http://topopen.tmap.co.kr/imgs/point.png";
            pType = "P";
            size = new Tmapv2.Size(8, 8);
          }

          // 경로들의 결과값들을 포인트 객체로 변환

          var latlon = new Tmapv2.Point(
            geometry.coordinates[0],
            geometry.coordinates[1]
          );
          // 포인트 객체를 받아 좌표값으로 다시 변환
          var convertPoint = new Tmapv2.Projection.convertEPSG3857ToWGS84GEO(
            latlon
          );
          var routeInfoObj = {
            markerImage: markerImg,
            lng: convertPoint._lng,
            lat: convertPoint._lat,
            pointType: pType,
          };
          // Marker 추가
          for (let i = 0; i < 10; i++) {
            marker_p = new Tmapv2.Marker({
              position: new Tmapv2.LatLng(cctvData[i], cctvData[i + 1]),
              //routeInfoObj.lat,
              //routeInfoObj.lng),
              icon: "http://tmapapi.sktelecom.com/upload/tmap/marker/pin_b_m_b.png",
              iconSize: size,
              map: map,
            });
          }
        }
      } //for문 [E]
      drawLine(drawInfoArr);
    },

    error: function (request, status, error) {
      console.log(
        "code:" +
          request.status +
          "\n" +
          "message:" +
          request.responseText +
          "\n" +
          "error:" +
          error
      );
    },
  });

  // 3. 경로탐색 API 사용요청

  $.ajax({
    method: "POST",
    url: "https://apis.openapi.sk.com/tmap/routes/pedestrian?version=1&format=json&callback=result",
    async: false,
    data: {
      appKey: "l7xxf71b7e3a0f8143d6b17183353dc91a56",
      startX: String(ans[11]),
      startY: String(ans[10]),
      endX: String(endlocX),
      endY: String(endlocY),
      passList: zlp,
      reqCoordType: "WGS84GEO",
      resCoordType: "EPSG3857",
      startName: "출발지",
      endName: "도착지",
      searchOption: 10,
    },

    success: function (response) {
      var resultData = response.features;
      sumDistance += parseFloat(
        (resultData[0].properties.totalDistance / 1000).toFixed(1)
      );
      sumTime += parseFloat(
        (resultData[0].properties.totalTime / 60).toFixed(0)
      );
      //결과 출력
      var tDistance = "총 거리 : " + String(sumDistance) + "km";
      var tTime = " 총 시간 : " + String(sumTime) + "분";
      document.getElementById("time").innerHTML = tTime;
      document.getElementById("length").innerHTML = tDistance;
      //기존 그려진 라인 & 마커가 있다면 초기화s
      //drawInfoArr = [];
      for (var i in resultData) {
        //for문 [S]
        var geometry = resultData[i].geometry;
        var properties = resultData[i].properties;
        var polyline_;
        if (geometry.type == "LineString") {
          for (var j in geometry.coordinates) {
            // 경로들의 결과값(구간)들을 포인트 객체로 변환
            var latlng = new Tmapv2.Point(
              geometry.coordinates[j][0],
              geometry.coordinates[j][1]
            );
            // 포인트 객체를 받아 좌표값으로 변환

            var convertPoint = new Tmapv2.Projection.convertEPSG3857ToWGS84GEO(
              latlng
            );

            // 포인트객체의 정보로 좌표값 변환 객체로 저장

            var convertChange = new Tmapv2.LatLng(
              convertPoint._lat,
              convertPoint._lng
            );
            // 배열에 담기
            drawInfoArr.push(convertChange);
          }
        } else {
          var markerImg = "";
          var pType = "";
          var size;
          if (properties.pointType == "S") {
            //출발지 마커
            markerImg =
              "http://tmapapi.sktelecom.com/upload/tmap/marker/pin_r_m_s.png";
            pType = "S";
            size = new Tmapv2.Size(24, 38);
          } else if (properties.pointType == "E") {
            //도착지 마커
            markerImg =
              "http://tmapapi.sktelecom.com/upload/tmap/marker/pin_r_m_e.png";
            pType = "E";
            size = new Tmapv2.Size(24, 38);
          } else {
            //각 포인트 마커
            markerImg = "http://topopen.tmap.co.kr/imgs/point.png";
            pType = "P";
            size = new Tmapv2.Size(8, 8);
          }
          // 경로들의 결과값들을 포인트 객체로 변환
          var latlon = new Tmapv2.Point(
            geometry.coordinates[0],
            geometry.coordinates[1]
          );
          // 포인트 객체를 받아 좌표값으로 다시 변환
          var convertPoint = new Tmapv2.Projection.convertEPSG3857ToWGS84GEO(
            latlon
          );
          var routeInfoObj = {
            markerImage: markerImg,
            lng: convertPoint._lng,
            lat: convertPoint._lat,
            pointType: pType,
          };
          // Marker 추가
          for (let i = 0; i < 10; i++) {
            marker_p = new Tmapv2.Marker({
              position: new Tmapv2.LatLng(cctvData[i], cctvData[i + 1]),
              //routeInfoObj.lat,
              //routeInfoObj.lng),
              icon: "http://tmapapi.sktelecom.com/upload/tmap/marker/pin_b_m_b.png",
              iconSize: size,
              map: map,
            });
          }
        }
      } //for문 [E]
      drawLine(drawInfoArr);
      Move();
    },
    error: function (request, status, error) {
      console.log(
        "code:" +
          request.status +
          "\n" +
          "message:" +
          request.responseText +
          "\n" +
          "error:" +
          error
      );
    },
  });
}

function addComma(num) {
  var regexp = /\B(?=(\d{3})+(?!\d))/g;
  return num.toString().replace(regexp, ",");
}

function drawLine(arrPoint) {
  var polyline_;
  polyline_ = new Tmapv2.Polyline({
    path: arrPoint,
    strokeColor: "#DD0000",
    strokeWeight: 6,
    map: map,
  });
  resultdrawArr.push(polyline_);
}

//지도 무빙부분----------------------------------------------------------------
function Move() {
  var lonlat = new Tmapv2.LatLng(
    (startlocY + endlocY) / 2,
    (startlocX + endlocX) / 2
  );
  map.setCenter(lonlat); // 지도의 중심 좌표를 설정합니다.
}

function viewPolice(select) {
  let p_longitude = parseFloat(policeData[select].longitude.replace("\r", ""));
  let p_latitude = parseFloat(policeData[select].latitude);
  map.destroy();
  initTmap();
  var lonlat = new Tmapv2.LatLng(p_latitude, p_longitude);
  var p_marker = new Tmapv2.Marker({
    position: new Tmapv2.LatLng(p_latitude, p_longitude), //Marker의 중심좌표 설정.
    icon: "img/police_marker.png", //Marker의 아이콘.
    map: map, //Marker가 표시될 Map 설정.
  });
  map.setCenter(lonlat); // 지도의 중심 좌표를 설정합니다.
}

//경로주변 cctv--------------------------------------------------
function showCctv() {
  let newCctv = [];
  let count = 0;
  if (startlocX >= endlocX && startlocY >= endlocY) {
    for (let i = 0; i < cctvData_2.length; i++) {
      if (
        endlocX <= cctvData_2[i].longitude &&
        cctvData_2[i].longitude <= startlocX &&
        endlocY <= cctvData_2[i].latitude &&
        cctvData_2[i].latitude <= startlocY
      ) {
        newCctv[count] = {
          longitude: cctvData_2[i].longitude,
          latitude: cctvData_2[i].latitude,
        };
        count++;
      }
    }
  } else if (startlocX >= endlocX && startlocY <= endlocY) {
    for (let i = 0; i < cctvData_2.length; i++) {
      if (
        endlocX <= cctvData_2[i].longitude &&
        cctvData_2[i].longitude <= startlocX &&
        startlocY <= cctvData_2[i].latitude &&
        cctvData_2[i].latitude <= endlocY
      ) {
        newCctv[count] = {
          longitude: cctvData_2[i].longitude,
          latitude: cctvData_2[i].latitude,
        };
        count++;
      }
    }
  } else if (startlocX <= endlocX && startlocY >= endlocY) {
    for (let i = 0; i < cctvData_2.length; i++) {
      if (
        startlocX <= cctvData_2[i].longitude &&
        cctvData_2[i].longitude <= endlocX &&
        endlocY <= cctvData_2[i].latitude &&
        cctvData_2[i].latitude <= startlocY
      ) {
        newCctv[count] = {
          longitude: cctvData_2[i].longitude,
          latitude: cctvData_2[i].latitude,
        };
        count++;
      }
    }
  } else if (startlocX <= endlocX && startlocY <= endlocY) {
    for (let i = 0; i < cctvData_2.length; i++) {
      if (
        startlocX <= cctvData_2[i].longitude &&
        cctvData_2[i].longitude <= endlocX &&
        startlocY <= cctvData_2[i].latitude &&
        cctvData_2[i].latitude <= endlocY
      ) {
        newCctv[count] = {
          longitude: cctvData_2[i].longitude,
          latitude: cctvData_2[i].latitude,
        };
        count++;
      }
    }
  }
  cctvMarker(newCctv);
}

function cctvMarker(data) {
  for (let i = 0; i < data.length; i++) {
    var cctvMarker = new Tmapv2.Marker({
      position: new Tmapv2.LatLng(data[i].latitude, data[i].longitude), //Marker의 중심좌표 설정.
      icon: "img/cctv_marker.png", //Marker의 아이콘.
      map: map, //Marker가 표시될 Map 설정.
    });
  }
}

function printName() {
  let name = document.getElementById("location-start").value;
  let endname = document.getElementById("location").value;

  document.getElementById("result").innerHTML = name + "<br/> ➜ " + endname;
}
