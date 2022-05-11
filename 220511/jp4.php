<!DOCTYPE html>
<html>
	<head>
		<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
		<title>simpleMap</title>
		<script	src="https://code.jquery.com/jquery-3.2.1.min.js"></script>
		<script src="https://apis.openapi.sk.com/tmap/jsv2?version=1&appKey=l7xx83a37de8e64f4f2999b3967051ff6160"></script>
		<script type="text/javascript">
			var map, marker;
			var markerArr = [], labelArr = [];
			var lonlat;
			var markers = [];

			function initTmap() {
				// 1. 지도 띄우기
				map = new Tmapv2.Map("map_div", {
					center : new Tmapv2.LatLng(37.570028, 126.986072),
					width : "70%",
					height : "400px",
					zoom : 15,
					zoomControl : true,
					scrollwheel : true
				});
				map.addListener("click", onClick1);

				// 2. POI 통합 검색 API 요청
				$("#btn_select").click(
					function() {
						var searchKeyword = $('#searchKeyword').val(); // 검색 키워드
						$.ajax({
							method : "GET", // 요청 방식
							url : "https://apis.openapi.sk.com/tmap/pois?version=1&format=json&callback=result", // url 주소
							async : false, // 동기설정
							data : { // 요청 데이터 정보
								"appKey" : "l7xx83a37de8e64f4f2999b3967051ff6160", // 발급받은 Appkey
								"searchKeyword" : searchKeyword, // 검색 키워드
								"resCoordType" : "EPSG3857", // 요청 좌표계
								"reqCoordType" : "WGS84GEO", // 응답 좌표계
								"count" : 10 // 가져올 갯수
							},
							success : function(response) {
								console.log(response);
								var resultpoisData = response.searchPoiInfo.pois.poi;

								// 2. 기존 마커, 팝업 제거
								if (markerArr.length > 0) {
									for(var i in markerArr) {
										markerArr[i].setMap(null);
									}
									markerArr = [];
								}

								if (labelArr.length > 0) {
									for (var i in labelArr) {
										labelArr[i].setMap(null);
									}
									labelArr = [];
								}

								var innerHtml = ""; // Search Reulsts 결과값 노출 위한 변수
								//맵에 결과물 확인 하기 위한 LatLngBounds객체 생성
								var positionBounds = new Tmapv2.LatLngBounds();

								// 3. POI 마커 표시
								for (var k in resultpoisData) {
									// POI 마커 정보 저장
									var noorLat = Number(resultpoisData[k].noorLat);
									var noorLon = Number(resultpoisData[k].noorLon);
									var name = resultpoisData[k].name;

									// POI 정보의 ID
									var id = resultpoisData[k].id;

									// 좌표 객체 생성
									var pointCng = new Tmapv2.Point(
											noorLon, noorLat);

									// EPSG3857좌표계를 WGS84GEO좌표계로 변환
									var projectionCng = new Tmapv2.Projection.convertEPSG3857ToWGS84GEO(
											pointCng);

									var lat = projectionCng._lat;      //위도
									var lon = projectionCng._lng;      //경도

									// 좌표 설정
									var markerPosition = new Tmapv2.LatLng(
											lat, lon);

									// Marker 설정
									marker = new Tmapv2.Marker(
										{
											position : markerPosition, // 마커가 표시될 좌표
											//icon : "http://tmapapi.sktelecom.com/upload/tmap/marker/pin_b_m_a.png",
											icon : "http://tmapapi.sktelecom.com/upload/tmap/marker/pin_b_m_"
													+ k
													+ ".png", // 아이콘 등록
											iconSize : new Tmapv2.Size(
													24, 38), // 아이콘 크기 설정
											title : name, // 마커 타이틀
											map : map // 마커가 등록될 지도 객체
										});

									// 결과창에 나타날 검색 결과 html
									innerHtml += "<li><div><img src='http://tmapapi.sktelecom.com/upload/tmap/marker/pin_b_m_" + k + ".png' style='vertical-align:middle;'/><span>"
											+ name
											+ "</span>  <button type='button' name='sendBtn' onClick='poiDetail("
											+ id
											+ ");'>정보</button></div></li>";

									// 마커들을 담을 배열에 마커 저장
									markerArr.push(marker);
									positionBounds.extend(markerPosition); // LatLngBounds의 객체 확장
								}

								$("#searchResult").html(innerHtml); //searchResult 결과값 노출
								map.panToBounds(positionBounds); // 확장된 bounds의 중심으로 이동시키기
								map.zoomOut();
							},
							error : function(request, status, error) {
								console.log("code:"
										+ request.status + "\n"
										+ "message:"
										+ request.responseText
										+ "\n" + "error:" + error);
							}
						});
					});

          //좌표 ==========================================================================================
          var lon, lat;
        	map.addListener("click", function onClick(evt){
        		var mapLatLng = evt.latLng;

        	 	coordConvert(mapLatLng._lng, mapLatLng._lat);
        	});

        	function coordConvert(lon, lat){
        		var selectLevel = $("#selectLevel").val();
        		$.ajax({
        			method:"GET",
        			url:"https://apis.openapi.sk.com/tmap/geo/coordconvert?version=1&format=json&callback=result",
        			async:false,
        			data:{

        				"appKey" : "l7xx83a37de8e64f4f2999b3967051ff6160",
        				"lon" : lon,
        				"lat" : lat,
        				"toCoord" : selectLevel
        			},
        			success:function(response){
        				var resultCoordinate = response.coordinate;

        				var lon2 = resultCoordinate.lon;
        				var lat2 = resultCoordinate.lat;

        			    var result = "A : "+lon+","+lat;
        				var resultDiv = document.getElementById("result");
        				resultDiv.innerHTML = result;
        			},
        			error:function(request,status,error){
        				console.log("code:"+request.status+"\n"+"message:"+request.responseText+"\n"+"error:"+error);
        			}
        		});

        	}
          //좌표 end ===================================================================================



			}
			function onClick1(e){
		// 클릭한 위치에 새로 마커를 찍기 위해 이전에 있던 마커들을 제거
		removeMarkers();

		lonlat = e.latLng;
		//Marker 객체 생성.
		marker = new Tmapv2.Marker({
			position: new Tmapv2.LatLng(lonlat.lat(),lonlat.lng()), //Marker의 중심좌표 설정.
			map: map //Marker가 표시될 Map 설정.
		});

		markers.push(marker);
	}
	// 모든 마커를 제거하는 함수입니다.
	function removeMarkers() {
		for (var i = 0; i < markers.length; i++) {
			markers[i].setMap(null);
		}
		markers = [];
	}

			// 4. POI 상세 정보 API
			function poiDetail(poiId) {
				console.log(poiId);

				$.ajax({
					method : "GET", // 요청 방식
					url : "https://apis.openapi.sk.com/tmap/pois/"
							+ poiId // 상세보기를 누른 아이템의 POI ID
							+ "?version=1&resCoordType=EPSG3857&format=json&callback=result&appKey="
							+ "l7xx83a37de8e64f4f2999b3967051ff6160", // 발급받은 Appkey
					async : false, // 동기 설정
					success : function(response) {
						console.log(response);

						// 응답받은 POI 정보
						var detailInfo = response.poiDetailInfo;
						var name = detailInfo.name;
						var address = detailInfo.address;

						var noorLat = Number(detailInfo.frontLat);
						var noorLon = Number(detailInfo.frontLon);

						var pointCng = new Tmapv2.Point(noorLon, noorLat);
						var projectionCng = new Tmapv2.Projection.convertEPSG3857ToWGS84GEO(
								pointCng);

						var lat = projectionCng._lat;
						var lon = projectionCng._lng;

						var labelPosition = new Tmapv2.LatLng(lat, lon);

						// 상세보기 클릭 시 지도에 표출할 popup창
						var content = "<div style=' border-radius:10px 10px 10px 10px;background-color:#2f4f4f; position: relative;"
								+ "line-height: 15px; padding: 5 5px 2px 4; right:65px;'>"
								+ "<div style='font-size: 11px; font-weight: bold ; line-height: 15px; color : white'>"
								+ "name : "
								+ name
								+ "</br>"
								+ "address : "
								+ address + "</br>"
                + lat + "</br>"
                + lon + "</div>" + "</div>";

						var labelInfo = new Tmapv2.Label({
							position : labelPosition,
							content : content,
							map : map
						});
						//popup 생성

						// popup들을 담을 배열에 팝업 저장
						labelArr.push(labelInfo);
					},
					error : function(request, status, error) {
						console.log("code:" + request.status + "\n"
								+ "message:" + request.responseText + "\n"
								+ "error:" + error);
					}
				});
			}

</script>
<body onload="initTmap();">
	<div>
		<input type="text" class="text_custom" id="searchKeyword" name="searchKeyword" value="영남이공대학교">
		<button id="btn_select">적용하기</button>
	</div>
	<div>
		<span id="result"></span>
		<div style="width: 30%; float:left;">
			<div class="title"><strong>Search</strong> Results</div>
			<div class="rst_wrap">
				<div class="rst mCustomScrollbar">
					<ul id="searchResult" name="searchResult">
						<li>검색결과</li>
					</ul>
				</div>
			</div>
		</div>
		<div id="map_div" class="map_wrap" style="float:left"></div>
	</div>
</body>
</html>
