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
        foreach ($data[0] as $titleValue) {
            $titleValue = "mysqli_real_escape_string (' . $this->connection . '., ' . $data[0] . ')"; //DA RISOLVERE
         }
        $insertQuery = "INSERT INTO " . $this->tableName ." ( ". $this->fields[1] . "," . $this->fields[2] . "," . $this->fields[3] . ") 
        VALUES (" . $titleValue . ", '" . $data[1] . "', " . $data[2] .");";var_dump($titleValue);die;
        $result = mysqli_query($this->connection, $insertQuery);
        if ($result == true) { 
            return [
                'success' => true,
                'errors' => [],
            ];
        } else {
            return [
                'success' => false,
                'errors' => "Qualquadra non cosa",
            ];
        }
    }

    public function delete($id) {
        $deleteQuery = "DELETE FROM " . $this->tableName ." WHERE id = " . $id . ";";
        $result = mysqli_query($this->connection, $deleteQuery);
        if ($result == true) { 
            return [
                'success' => true,
                'errors' => [],
            ];
        } else {
            return [
                'success' => false,
                'errors' => "Qualquadra non cosa",
            ];
        }
    }

    public function edit($data, $id) {
        $editQuery = "UPDATE " . $this->tableName . " SET ". $this->fields[1] ." = '". $data[0] ."', ". $this->fields[2] .
        " = '". $data[1] ."' , ". $this->fields[3] ." = ". $data[2] ." WHERE ". $this->fields[0] ." = ". $id ." ;";
        $result = mysqli_query($this->connection, $editQuery);
        if ($result == true) { 
            return [
                'success' => true,
                'errors' => [],
            ];
        } else {
            return [
                'success' => false,
                'errors' => "Qualquadra non cosa",
            ];
        }
    }
}