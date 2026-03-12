<?php
require_once '../config/database.php';
require_once '../utils/Helper.php';

class ProductController {
    private $db;

    public function __construct() {
        $this->db = new Database();
    }

    public function getAll() {
        $products = $this->db->aggregate("products", [
            ["\$sort" => ["id" => -1]],
            [
                "\$lookup" => [
                    "from" => "categories",
                    "localField" => "category_id",
                    "foreignField" => "id",
                    "as" => "category"
                ]
            ],
            [
                "\$unwind" => [
                    "path" => "\$category",
                    "preserveNullAndEmptyArrays" => true
                ]
            ],
            [
                "\$addFields" => [
                    "category_name" => ["\$ifNull" => ["\$category.name", null]]
                ]
            ],
            [
                "\$project" => [
                    "category" => 0
                ]
            ]
        ]);

        Helper::sendResponse("success", "Products fetched", $products);
    }

    public function getOne($id) {
        $product = $this->db->findOne("products", ["id" => (int) $id]);

        if ($product) {
            unset($product['_id']);
            Helper::sendResponse("success", "Product found", $product);
        } else {
            Helper::sendResponse("error", "Product not found", [], 404);
        }
    }
}
?>
