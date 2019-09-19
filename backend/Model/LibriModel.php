<?php

namespace Model;

class LibriModel {
    public $connection;
    protected $tableName = 'libri';
    public $fields = [
        'id',
        'title',
        'author',
        'price'
    ];

    public function __construct($connection) {
        $this->connection = $connection;
    }

    public function insert($data) {
        $insertQuery = "INSERT INTO " . $this->tableName ." ( ". $this->fields[1] . "," . $this->fields[2] . "," . $this->fields[3] . ") 
        VALUES ('" . $data[0] . "', '" . $data[1] . "', " . $data[2] .");";
        $doInsertQuery = mysqli_query($this->connection, $insertQuery);
    }

    public function delete($id) {
        $deleteQuery = "DELETE FROM " . $this->tableName ." WHERE id = " . $id . ";";
        $doDeleteQuery = mysqli_query($this->connection, $deleteQuery);
    }
}