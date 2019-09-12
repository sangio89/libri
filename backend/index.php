<?php
require_once('connection.php');
header('Access-Control-Allow-Origin: ' . $_SERVER['HTTP_ORIGIN']);
header('Access-Control-Allow-Methods: GET, PUT, POST, DELETE, OPTIONS');
header('Access-Control-Max-Age: 1000');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
if ($_SERVER['REQUEST_URI'] == '/libro') {
    $titolo = $_POST['titolo'];
    $autore = $_POST['autore'];
    $pageNumber = $_POST['pageNumber'];
    $pageSize = 5;
    $fromRecord = ($pageNumber * $pageSize) - $pageSize;
    if ($titolo !== null || $autore !== null) {
        $countFilteredRecords = mysqli_query($connection, "SELECT COUNT(*) AS TOTALE_LIBRI FROM libri WHERE title LIKE '$titolo%' AND author LIKE '$autore%'");
        $row = mysqli_fetch_array($countFilteredRecords);
    } else {
        $countRecords = mysqli_query($connection, "SELECT COUNT(*) AS TOTALE_LIBRI FROM libri");
        $row = mysqli_fetch_array($countRecords);
    }
    $initPageNumber = $row[TOTALE_LIBRI]/$pageSize;
    if (is_int($initPageNumber)) {
        $maxPageNumber = $initPageNumber;
    } else {
        $maxPageNumber = round($initPageNumber, 0) + 1;
    }
    if ($titolo !== null || $autore !== null) {
        $filteredQuery = mysqli_query($connection, "SELECT title, author, price FROM libri WHERE title LIKE '$titolo%' AND author LIKE '$autore%' ORDER BY title ASC LIMIT $fromRecord, $pageSize");
        $row = mysqli_fetch_all($filteredQuery, MYSQLI_ASSOC);
    } else {
        $query = mysqli_query($connection, "SELECT id, title, author, price FROM libri ORDER BY title ASC LIMIT $fromRecord, $pageSize");
        $row = mysqli_fetch_all($query, MYSQLI_ASSOC);
    }
    echo json_encode(['data' => $row, 'maxPageNumber' => $maxPageNumber]); //ecco la tua response, un array in formato JSON che contiene una chiave "data" con dentro tutti i libri.

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