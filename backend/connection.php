<?php
    $user = 'root';
    $password = 'root';
    $db = 'libri';
    $host = 'localhost';
    $port = 8888;
    
    $connection = mysqli_connect(
       $host,
       $user,
       $password,
       $db,
       $port
    );

    if (mysqli_connect_errno()) {
        echo "Errore connessione MySQL: " . mysqli_connect_error();
    }
?>  