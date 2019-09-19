<?php

namespace Controller;

use Model\LibriModel;


class LibriController {
    public $connection;

    public function __construct($connection) {
        $this->connection = $connection;
    }

    public function insertAction() {
        $id = $_POST['id'];
        $titolo = $_POST['titolo'];
        $autore = $_POST['autore'];
        $prezzo = $_POST['prezzo'];
        $data = [
            $titolo,
            $autore,
            $prezzo
        ]; 
        if ($id == 0) { 
            $insertLibro = new LibriModel($this->connection);
            $result = $insertLibro->insert($data);
            echo json_encode($result);
        } else {
            $editLibro = new LibriModel($this->connection);
            $result = $editLibro->edit($data, $id);
            echo json_encode($result);
        }
    }   

    public function deleteAction() {
        $id = $_POST['id'];
        $deleteLibro = new LibriModel($this->connection);
        $result = $deleteLibro->delete($id);
        echo json_encode($result);
    }
}