<?php
if (isset($_SERVER['HTTP_ORIGIN'])) { // CROSS DOMAIN 대응 CORS
  header("Access-Control-Allow-Origin: {$_SERVER['HTTP_ORIGIN']}");
  header('Access-Control-Allow-Credentials: true');
      header('Access-Control-Max-Age: 86400');    // cache for 1 day
  }

      // Access-Control headers are received during OPTIONS requests
  if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {

  if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_METHOD']))
  header("Access-Control-Allow-Methods: GET, POST, OPTIONS");

  if (isset($_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']))
  header("Access-Control-Allow-Headers: {$_SERVER['HTTP_ACCESS_CONTROL_REQUEST_HEADERS']}");

  exit(0);
  }

    $host = "localhost";
    $id = "root";
    $password = "abc123";
    $dbName = "cctv";

    $conn = new mysqli($host, $id, $password, $dbName);
    $query = "select * from policeoffice";
    $result = mysqli_query($conn,$query);


    if (!$result){
        echo "<script> alert('오류가 발생했습니다.'); </script>";
    }

    $resultArray = array();
      while($row = mysqli_fetch_assoc($result)) {
        $arraypolice = array(
         "id" => $row['id'],
         "name" => $row['name'],
         "address" => $row['address'],
         "tel" => $row['tel'],
         "classification" => $row['classification'],
         "latitude" => $row['latitude'],
         "longitude" => $row['longitude'],
        );

      array_push($resultArray,$arraypolice);
    }

    echo json_encode($resultArray,JSON_UNESCAPED_UNICODE);
    mysqli_close($conn);
?>