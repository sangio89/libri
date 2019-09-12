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

    $rowNumber = eseguoLaQueryDiCount($connection, $titolo, $autore);
    $maxPageNumber = ottengoIlMaxPageNumber($rowNumber, $pageSize);
    $data = eseguoLaQueryDiLetturaLibri($connection, $titolo, $autore, $fromRecord, $pageSize);

    echo json_encode(['data' => $data, 'maxPageNumber' => $maxPageNumber]);
} elseif ($_SERVER['REQUEST_URI'] == '/salvalibro' && $_SERVER['REQUEST_METHOD'] == 'POST') {
    $id = $_POST['id'];
    $titolo = $_POST['titolo'];
    $autore = $_POST['autore'];
    $prezzo = $_POST['prezzo'];

    $salvaLibro = salvoIlLibro($connection, $titolo, $autore, $prezzo, $id);
} elseif ($_SERVER['REQUEST_URI'] == '/cancellalibro' && $_SERVER['REQUEST_METHOD'] == 'POST') {
    $id = $_POST['id'];

    $cancellaLibro = cancellaIlLibro($connection ,$id);
} else {
    
    echo 
    "{
        \"errore\": \"Richiesta non supportata\"
    }";
}

function eseguoLaQueryDiCount($connection, $titolo, $autore)
{
    $query = "SELECT COUNT(*) AS TOTALE_LIBRI FROM libri";
    if ($titolo !== null || $autore !== null) {
        $query .= " WHERE title LIKE '$titolo%' AND author LIKE '$autore%'";
    }
    $countRecords = mysqli_query($connection, $query);
    return mysqli_fetch_array($countRecords);
}

function ottengoIlMaxPageNumber($countRow, $pageSize)
{
    $initPageNumber = $countRow['TOTALE_LIBRI'] / $pageSize;
    if (is_int($initPageNumber)) {
        $maxPageNumber = $initPageNumber;
    } else {
        $maxPageNumber = floor($initPageNumber) + 1;
    }
    return $maxPageNumber;
}

function eseguoLaQueryDiLetturaLibri($connection, $titolo, $autore, $fromRecord, $pageSize)
{
    $query = "SELECT id, title, author, price FROM libri";
    if ($titolo !== null || $autore !== null) {
        $query .= " WHERE title LIKE '$titolo%' AND author LIKE '$autore%'";
    }
    $query .= " ORDER BY title ASC LIMIT $fromRecord, $pageSize";

    $records = mysqli_query($connection, $query);
    return mysqli_fetch_all($records, MYSQLI_ASSOC);
}

function salvoIlLibro ($connection, $titolo, $autore, $prezzo, $id) 
{
    if ($id == 0){
        $query = "INSERT INTO libri (title, author, price)  VALUES ('$titolo','$autore',$prezzo)";
    } else {
        $query = "UPDATE libri SET title = '$titolo' , author = '$autore' , price = $prezzo WHERE libri.id = $id;";
    }
    return mysqli_query($connection, $query);
}

function cancellaIlLibro ($connection, $id)
{
    $query = "DELETE FROM `libri` WHERE `libri`.`id` = $id;";
    return mysqli_query($connection, $query);
}