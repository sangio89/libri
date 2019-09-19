<?php

namespace Controller;

use Model\LibriModel;


class LibriController {
    public $connection;

    public function __construct($connection) {
        $this->connection = $connection;
    }

    public function insertAction() {
        $titolo = $_POST['titolo'];
        $autore = $_POST['autore'];
        $prezzo = $_POST['prezzo'];
        $data = [
            $titolo,
            $autore,
            $prezzo
        ];
        $libro = new LibriModel($this->connection);
        $libro->insert($data);
    }

    public function deleteAction() {

    }
}