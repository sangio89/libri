<?php
require_once('connection.php');
header('Access-Control-Allow-Origin: ' . $_SERVER['HTTP_ORIGIN']);
header('Access-Control-Allow-Methods: GET, PUT, POST, DELETE, OPTIONS');
header('Access-Control-Max-Age: 1000');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');

if ($_SERVER['REQUEST_URI'] == '/libro') {
    $query = mysqli_query($connection, 'SELECT 
                id, title, author, price
                FROM
                libri
                ');

    $array = mysqli_fetch_all($query, MYSQLI_ASSOC);
    
    echo json_encode(['data' => $array]); //ecco la tua response, un array in formato JSON che contiene una chiave "data" con dentro tutti i libri.

} elseif ($_SERVER['REQUEST_URI'] == '/salvalibro' && $_SERVER['REQUEST_METHOD'] == 'POST') {
    $id = $_POST['id'];
    $titolo = $_POST['titolo'];
    $autore = $_POST['autore'];
    $prezzo = $_POST['prezzo'];
    if ($id == 0){
        $query = "INSERT INTO libri (title, author, price)  VALUES ('$titolo','$autore',$prezzo)";
        $sql = mysqli_query($connection, $query);}
    else {
        $query = "UPDATE libri SET title = '$titolo' , author = '$autore' , price = $prezzo WHERE libri.id = $id;";
        $sql = mysqli_query($connection, $query);
    }
    //
} elseif ($_SERVER['REQUEST_URI'] == '/cancellalibro' && $_SERVER['REQUEST_METHOD'] == 'POST') {
    $id = $_POST['id'];
    $query = "DELETE FROM `libri` WHERE `libri`.`id` = $id;";
    $sql = mysqli_query($connection, $query);
    //ok
} else {
    echo "{
        \"error\": \"Richiesta non supportata\"        
    }";
}