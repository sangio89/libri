<?php
require_once('connection.php');
require_once('../vendor/autoload.php');
header('Access-Control-Allow-Origin: ' . $_SERVER['HTTP_ORIGIN']);
header('Access-Control-Allow-Methods: GET, PUT, POST, DELETE, OPTIONS');
header('Access-Control-Max-Age: 1000');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');
use Controller\LibriController;

$libroController = new LibriController($connection);

if ($_SERVER['REQUEST_URI'] == '/libro') {
    $titolo = $_POST['titolo'];
    $autore = $_POST['autore'];
    $pageNumber = $_POST['pageNumber'];
    $pageSize = 5;
    $fromRecord = ($pageNumber * $pageSize) - $pageSize;
    $orderColumn = $_POST['orderColumn'];
    $orderDirection = $_POST['orderDirection'];
    $rowNumber = eseguoLaQueryDiCount($connection, $titolo, $autore);
    $maxPageNumber = ottengoIlMaxPageNumber($rowNumber, $pageSize);
    if ($orderColumn == NULL || $orderDirection == NULL) {
        $data = eseguoLaQueryDiLetturaLibri($connection, $titolo, $autore, $fromRecord, $pageSize);
    } else {
        $data = eseguoLaQueryDiLetturaLibri($connection, $titolo, $autore, $fromRecord, $pageSize, $orderColumn, $orderDirection);
    }

    echo json_encode(['data' => $data, 'maxPageNumber' => $maxPageNumber]);
} elseif ($_SERVER['REQUEST_URI'] == '/salvalibro' && $_SERVER['REQUEST_METHOD'] == 'POST') {
    $libroController->insertAction();
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

function eseguoLaQueryDiLetturaLibri($connection, $titolo, $autore, $fromRecord, $pageSize, $orderColumn = 'title', $orderDirection = 'ASC')
{
    $query = "SELECT id, title, author, price FROM libri";
    if ($titolo !== null || $autore !== null) {
        $query .= " WHERE title LIKE '$titolo%' AND author LIKE '$autore%'";
    }
    $query .= " ORDER BY $orderColumn $orderDirection LIMIT $fromRecord, $pageSize";
    $records = mysqli_query($connection, $query);
    $esegui = mysqli_fetch_all($records, MYSQLI_ASSOC);
    return $esegui;
}

function salvoIlLibro ($connection, $titolo, $autore, $prezzo, $id) 
{
    $uguaglianza = "SELECT * FROM libri WHERE (title = '$titolo' AND author = '$autore' AND price = $prezzo)";
    $records = mysqli_query($connection, $uguaglianza);
    $libriGiaEsistenti = mysqli_fetch_all($records, MYSQLI_ASSOC);
    $result = [
        'success' => true,
        'errors' => [],
    ];


    if (empty($libriGiaEsistenti)){
        if ($id == 0) { 
            $query = "INSERT INTO libri (title, author, price)  VALUES ('$titolo','$autore',$prezzo)";
        } else {
            $query = "UPDATE libri SET title = '$titolo' , author = '$autore' , price = $prezzo WHERE libri.id = $id;";
        }
        mysqli_query($connection, $query);
    } else {
        $result['success'] = false;
        $result['errors'] = [
            'Esiste gia un libro con gli stessi valori'
        ];          
    }
    return $result;
    
}

function cancellaIlLibro ($connection, $id)
{
    $query = "DELETE FROM `libri` WHERE `libri`.`id` = $id;";
    return mysqli_query($connection, $query);
}