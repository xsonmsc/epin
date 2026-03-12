<?php
require_once '../config/database.php';
require_once '../utils/Helper.php';

class ProductController {
    private $db;

    public function __construct() {
        $database = new Database();
        $this->db = $database->getConnection();
    }

    public function getAll() {
        $query = "SELECT p.*, c.name as category_name FROM products p LEFT JOIN categories c ON p.category_id = c.id ORDER BY p.id DESC";
        $stmt = $this->db->prepare($query);
        $stmt->execute();
        $products = $stmt->fetchAll();
        Helper::sendResponse("success", "Products fetched", $products);
    }

    public function getOne($id) {
        $stmt = $this->db->prepare("SELECT * FROM products WHERE id = ?");
        $stmt->execute([$id]);
        $product = $stmt->fetch();
        
        if ($product) {
            Helper::sendResponse("success", "Product found", $product);
        } else {
            Helper::sendResponse("error", "Product not found", [], 404);
        }
    }
}
?>