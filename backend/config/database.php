<?php
require_once __DIR__ . '/../utils/Helper.php';

use MongoDB\Driver\BulkWrite;
use MongoDB\Driver\Command;
use MongoDB\Driver\Exception\Exception as MongoException;
use MongoDB\Driver\Manager;
use MongoDB\Driver\Query;

class Database {
    private $host = "localhost";
    private $port = 27017;
    private $db_name = "digistore_db";
    private $username = "";
    private $password = "";
    private $manager;

    public function __construct() {
        try {
            $uri = $this->buildUri();
            $this->manager = new Manager($uri);
        } catch (MongoException $exception) {
            // Production-da bunu log faylina yazin
            Helper::sendResponse("error", "Database Connection Error: " . $exception->getMessage(), [], 500);
        }
    }

    private function buildUri() {
        if (!empty($this->username)) {
            $credentials = urlencode($this->username) . ":" . urlencode($this->password) . "@";
            return "mongodb://" . $credentials . $this->host . ":" . $this->port . "/" . $this->db_name . "?authSource=admin";
        }
        return "mongodb://" . $this->host . ":" . $this->port;
    }

    public function getManager() {
        return $this->manager;
    }

    public function getDbName() {
        return $this->db_name;
    }

    public function findOne($collection, $filter = [], $options = []) {
        $options['limit'] = 1;
        $query = new Query($filter, $options);
        $cursor = $this->manager->executeQuery($this->db_name . "." . $collection, $query);
        $doc = current($cursor->toArray());
        return $doc ? $this->bsonToArray($doc) : null;
    }

    public function find($collection, $filter = [], $options = []) {
        $query = new Query($filter, $options);
        $cursor = $this->manager->executeQuery($this->db_name . "." . $collection, $query);
        $result = [];
        foreach ($cursor as $doc) {
            $result[] = $this->bsonToArray($doc);
        }
        return $result;
    }

    public function insertOne($collection, $document) {
        $bulk = new BulkWrite();
        $id = $bulk->insert($document);
        $this->manager->executeBulkWrite($this->db_name . "." . $collection, $bulk);
        return $id;
    }

    public function updateOne($collection, $filter, $update, $options = []) {
        $bulk = new BulkWrite();
        $options = array_merge(["multi" => false, "upsert" => false], $options);
        $bulk->update($filter, $update, $options);
        $result = $this->manager->executeBulkWrite($this->db_name . "." . $collection, $bulk);
        return [
            "matched" => $result->getMatchedCount(),
            "modified" => $result->getModifiedCount(),
            "upserted" => $result->getUpsertedCount()
        ];
    }

    public function aggregate($collection, $pipeline) {
        $command = new Command([
            "aggregate" => $collection,
            "pipeline" => $pipeline,
            "cursor" => new stdClass()
        ]);
        $cursor = $this->manager->executeCommand($this->db_name, $command);
        $result = [];
        foreach ($cursor as $doc) {
            $result[] = $this->bsonToArray($doc);
        }
        return $result;
    }

    public function getNextSequence($name) {
        $command = new Command([
            "findAndModify" => "counters",
            "query" => ["_id" => $name],
            "update" => ["\$inc" => ["seq" => 1]],
            "upsert" => true,
            "new" => true
        ]);
        $cursor = $this->manager->executeCommand($this->db_name, $command);
        $response = current($cursor->toArray());
        $value = $response->value ?? null;
        if (!$value || !isset($value->seq)) {
            Helper::sendResponse("error", "Counter error for: " . $name, [], 500);
        }
        return (int) $value->seq;
    }

    private function bsonToArray($document) {
        return json_decode(\MongoDB\BSON\toJSON(\MongoDB\BSON\fromPHP($document)), true);
    }
}
?>
