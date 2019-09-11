<?php 
require_once("connection.php");

$titolo = $_POST['deleteBookTitle'];
$autore = $_POST['deleteBookAuthor'];
$prezzo = $_POST['deleteBookPrice'];

$sql = "DELETE FROM libri.libri (title, author, price) VALUES ('$titolo','$autore','$prezzo')";


?>