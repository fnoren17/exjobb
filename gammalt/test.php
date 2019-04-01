<?php
    $user = "root";
    $pass = "";
    $db = "ks";
    $connect = mysqli_connect("localhost", $user, $pass, $db) or die("Connection failed");


    $name = $_POST["name"];
    $query = "SELECT * FROM rating WHERE name = '$name'";
    //echo gettype($query);
    $rs = mysqli_query($connect, $query) or die(mysqli_error($connect));
    //echo $rs;

    $row = array();

    while($r = mysqli_fetch_assoc($rs)){
        $row[] = $r;
    }

    echo json_encode($row);
?>