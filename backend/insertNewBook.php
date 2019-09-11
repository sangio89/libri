<?php 
require_once("connection.php");

$titolo = $_POST['newBookTitle'];
$autore = $_POST['newBookAuthor'];
$prezzo = $_POST['newBookPrice'];

$sql = "INSERT INTO libri.libri (title, author, price)  VALUES ('$titolo','$autore','$prezzo')";


?>