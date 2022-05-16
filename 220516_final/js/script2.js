var map;
var marker_s, marker_e, marker_p1, marker_p2;
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
let startlocX = 128.5911308712179;
let startlocY = 35.84377679724957;
let endlocX = 128.5781953690347;
let endlocY = 35.84531265710616;
// let startlocX=128.57702454733175;
// let startlocY=35.85479459364812;
// let endlocX=128.5842192776504;
// let endlocY=35.847160657373024;
var sumDistance = 0;
var sumTime = 0;
function initTmap() {
  // 1. 지도 띄우기
  map = new Tmapv2.Map("map_div", {
    center: new Tmapv2.LatLng(startlocY, startlocX),
    width: "100%",
    height: "100vh",
    zoom: 15,
    zoomControl: true,
    scrollwheel: true,
  });
  var startPoint = new Tmapv2.Marker({
    position: new Tmapv2.LatLng(startlocY, startlocX), //시작좌표.
    //icon: 'http://tmapapi.sktelecom.com/upload/tmap/marker/pin_b_m_a.png', //Marker의 아이콘.
    //map: map //Marker가 표시될 Map 설정.
  });
  var endPoint = new Tmapv2.Marker({
    position: new Tmapv2.LatLng(35.84531265710616, 128.5781953690347), //e도착좌표.
    //c 'http://tmapapi.sktelecom.com/upload/tmap/marker/pin_b_m_a.png', //Marker의 아이콘.
    //map: map //Marker가 표시될 Map 설정.
  });
  // for(let i=0;i<chart_array.length;i+=2){
  //     var marker = new Tmapv2.Marker({
  //     position: new Tmapv2.LatLng(chart_array[i],chart_array[i+1]), //Marker의 중심좌표 설정.
  //     map: map //Marker가 표시될 Map 설정.
  //   });
  // }
  //출발지에서 도착지까지의 거리에서 11로 나눈값
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
    iconName = "http://tmapapi.sktelecom.com/upload/tmap/marker/pin_b_m_";
    iconName += String(cnt + 1) + ".png";
    var marker1 = new Tmapv2.Marker({
      position: new Tmapv2.LatLng(lati, long), //Marker의 중심좌표 설정.
      icon: iconName, //Marker의 아이콘.
      map: map, //Marker가 표시될 Map 설정.
    });
    var marker2 = new Tmapv2.Marker({
      position: new Tmapv2.LatLng(endlocY, endlocX), //e도착좌표.
      icon: "http://tmapapi.sktelecom.com/upload/tmap/marker/pin_b_m_a.png", //Marker의 아이콘.
      map: map, //Marker가 표시될 Map 설정.
    });

    for (var i = 0; i < chart_array.length; i += 2) {
      var marker3 = new Tmapv2.Marker({
        position: new Tmapv2.LatLng(chart_array[i], chart_array[i + 1]), //Marker의 중심좌표 설정.
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
    ans.push(chart_array[loc]);
    ans.push(chart_array[loc + 1]);
    c = chart_array[loc]; //위도
    d = chart_array[loc + 1]; //경도
    chart_array.splice(loc, 1); //cctv 좌표 배열에서 위도,경도 제거
    chart_array.splice(loc + 1, 1); //
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
              position: new Tmapv2.LatLng(chart_array[i], chart_array[i + 1]),
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
      var tDistance = "총 거리 : " + String(sumDistance) + "km,";
      var tTime = " 총 시간 : " + String(sumTime) + "분";
      $("#result").text(tDistance + tTime);
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
              position: new Tmapv2.LatLng(chart_array[i], chart_array[i + 1]),
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
